// Author: Moss Limpert

const models = require('../models');
const db = require('../database.js');

const { Account } = models;

// splat world
// add user
const addUser = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  // try catch w pass hash
  try {
    const hash = await Account.generateHash(pass);

    db.query('INSERT INTO user SET ?', {
      username: username,
      password: hash
    },
    (err) => {
      if (err) console.log(err);
      
      res.end();
    });

    console.log('Successfully inserted 1 user.');

    return res.redirect('/');
  } catch (err) {
    console.log(err);
    // failed to create/update
    if (err.code === 1004) {
      return res.status(500).json({ error: 'Failed to create new user'});
    }

    return res.status(500).json({ error: 'An error occured!' });
  }
};

// get a user
const getUser = (req, res) => {
  let username = null; 
  let id = null;

  if (req.query.id) id = req.query.id;
  if (req.query.username) username = req.query.username;

  //console.log(id, username);

  if (id === null && username === null) {
    return res.status(400).json({ error: 'No id or username provided.'});
  }

  let sql = 'SELECT username FROM user';
  if (id === null) {
    try {
      let addition = ' WHERE username = ?';
      db.execute(
        sql+addition,
        [username],
        (err, results) => {
          if (err) console.log(err);

          //console.log(results);

          if (results.length !== 0) return res.status(302).json({user: results[0]});
          else return res.status(404).json({ error: 'No user found.'});
        });
        console.log('Successfully retrieved 1 user: case 1');

        return res.status(200);
    } catch (err) {
      console.log(err);

      return res.status(500).json({
          error: 'Failed to retrieve user.'
      });
    }
  } else if (username === null) {
    try { 
      let addition = ' WHERE id = ?';
      db.execute(
        sql+addition,
        [id],
        (err, results) => {
          if (err) console.log(err);

          //console.log(results);

          if (results.length !== 0) return res.status(302).json({user: results[0]});
          else return res.status(404).json({ error: 'No user found.'});
        });
        console.log('Successfully retrieved 1 user: case 2');

        return res.status(200);
    } catch (err) {
      console.log(err);

      return res.status(500).json({
          error: 'Failed to retrieve user.'
      });
    }
  } else {
    try {
      let addition = ' WHERE id = ? OR username = ?';
      db.execute(
        sql+addition,
        [id,username],
        (err, results) => {
          if (err) console.log(err);

          //console.log(results);

          if (results.length !== 0) return res.status(302).json({user: results[0]});
          else return res.status(404).json({ error: 'No user found.'});
        });
        console.log('Successfully retrieved 1 user: case 3');

        return res.status(200);
    } catch (err) {
      console.log(err);

      return res.status(500).json({
          error: 'Failed to retrieve user.'
      });
    }
  }
};

const loginPage = (req, res) => {
  res.render('login');
};            // login 
const buyPremiumPage = (req, res) => res.render('buy-premium'); // buy premium page
const docPage = (req, res) => res.render('docs');               // documentation page
const changePassPage = (req, res) => res.render('reset');       // change password page

// logs a user out of their account.
const logout = (req, res) => {
  req.session.destroy();
  return res.redirect('/');
};

// logs a user in to their account
const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  if (!username || !pass) {
    return res.status(400).json({ error: 'Allfields are required!' });
  }

  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password!' });
    }

    // session variables
    req.session.account = Account.toAPI(account);

    return res.json({ redirect: '/home' });
  });
};

// allows a user to sign up for Bubbles
const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  if (!username || !pass || !pass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  try {
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({ username, password: hash });
    await newAccount.save();

    // session variables
    req.session.account = Account.toAPI(newAccount);

    return res.json({ redirect: '/home' });
  } catch (err) {
    //console.log(err.errors);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already in use!' });
    }

    if (err.errors.username) {
      //console.log(err.errors.username);
      return res.status(500).json({ error: err.errors.username.properties.message });
    }

    return res.status(500).json({ error: 'An error occured!' });
  }
};

// allows a current user to change their password
const changePassword = async (req, res) => {
  // req.session.account.username
  const { username } = req.session.account;
  const oldPass = `${req.body.oldPass}`;
  const pass2 = `${req.body.pass2}`;
  const pass3 = `${req.body.pass3}`;

  if (!username || !oldPass || !pass2 || !pass3) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (pass2 !== pass3) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  try {
    return await Account.authenticate(username, oldPass, async (err, account) => {
      if (err || !account) {
        return res.status(401).json({ error: 'Old password is incorrect!' });
      }

      const hash = await Account.generateHash(pass2);
      await Account.updateOne({ username }, { password: hash });

      req.session.account = Account.toAPI(account);
      return res.json({ redirect: '/home' });
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error occured!' });
  }
};

// allows the user unlimited access to the app
const buyPremium = async (req, res) => {
  try {

    return await Account.buyPremium(req.session.account._id, (acknowledged) => {
      if (!acknowledged) {
        res.status(500).json({error: 'Error updating account!'});
      }

      return res.redirect('/home');
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving user!' });
  }
};

module.exports = {
  loginPage,
  login,
  logout,
  signup,
  changePassPage,
  changePassword,
  buyPremiumPage,
  buyPremium,
  docPage,
  addUser,
  getUser
};
