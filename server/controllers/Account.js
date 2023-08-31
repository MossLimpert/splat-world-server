// Author: Moss Limpert

const models = require('../models');
const mysql = require('mysql2')

const { Account } = models;

const loginPage = (req, res) => {
  let sql = "SELECT * FROM TEST";
  let connection = mysql.createConnection({
    host: 'localhost',
    database: 'splat_world',
    user: 'root',
    password: 'V-8BhthTn9vjMU$E'
  });
  connection.query(sql, (err, results) => {
    if (err) console.log(err);
    console.log(results);
  })
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
  docPage
};
