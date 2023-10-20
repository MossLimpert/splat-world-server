// Author: Moss Limpert

const models = require('../models');
const db = require('../database.js');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');

const { Account } = models;

const minio = require('../objectstorage.js');
const { sendFromFileStreamBuffer, testGetObjectFileDownload } = minio;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve('hosted/downloads')); 
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + '.jpg');
  }
});
let upload = multer({storage:storage});
console.log(upload);

// console.log(storage);

// splat world
// add user
const addUser = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  console.log(req.body);
  // try catch w pass hash
  try {
    const hash = await Account.generateHash(pass);

    db.query('INSERT INTO ' + process.env.DATABASE + '.user SET ?', {
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

  let sql = 'SELECT username, join_date FROM ' + process.env.DATABASE + '.user';
  if (id === null) {
    try {
      let addition = ' WHERE username = ?';
      db.execute(
        sql+addition,
        [username],
        (err, results) => {
          if (err) console.log(err);

          console.log(results);

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

          console.log(results);

          if (results && results.length !== 0) return res.status(302).json({user: results[0]});
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

          console.log(results);

          if (results && results.length !== 0) return res.status(302).json({user: results[0]});
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

// verify account
const verifyUser = async (req, res) => {
  let sql = 'SELECT username, password, id FROM ' + process.env.DATABASE + '.user WHERE username = ?';
  let username = null;
  let password = null;

  // add de-encryption step for password
  //console.log(`${req.body.username}`);
  //console.log(`${req.body.password}`);
  if (`${req.body.username}`) username = `${req.body.username}`;
  if (`${req.body.password}`) password = `${req.body.password}`;

  if (username === null || password == null) {
    return res.status(400).json({error: "Either username or password is missing. You need both to login."});
  }

  try {
    db.execute(
      sql,
      [username],
      async (err, results) => {
        if (err) console.log(err);

        //console.log(results);

        if (results && results.length !== 0) {
          const match = await bcrypt.compare(password, results[0].password);

          if (match) {
            return res.status(202).json({user: {
              username: results[0].username,
              id: results[0].id
            }});
          } else return res.status(400).json({error: 'Username or password incorrect'});
        } else return res.status(404).json({ error: 'User not found.'});
      });

    console.log('Successfully retrieved user to compare.');
    return res.status(200);
  } catch (err) {
    console.log(err);

    return res.status(500).json({error: 'Failed to log in user.'});
  }
};

const loginPage = (req, res) => {
  res.render('login');
};            // login 
const buyPremiumPage = (req, res) => res.render('buy-premium'); // buy premium page
const docPage = (req, res) => res.render('docs');               // documentation page
const changePassPage = (req, res) => res.render('reset');       // change password page

// logs a user out of their account.
const logout = (req, res) => res.redirect('/');
  //req.session.destroy();

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
    //req.session.account = Account.toAPI(account);

    return res.json({ redirect: '/home' });
  });
};

// allows a user to sign up for Bubbles
const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.password}`;
  const pass2 = `${req.body.retype}`;

  console.log(req.body.username, req.body.password, req.body.retype);

  if (!username || !pass || !pass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  try {
    const hash = await bcrypt.generateHash(pass);
    
    db.query('INSERT INTO ' + process.env.DATABASE + '.user SET ?', {
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
    //console.log(err.errors);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already in use!' });
    }

    return res.status(500).json({ error: err });
  }
};

// uploads a profile pic to the server that the user sends
const uploadPfp = async (req, res) => {
  try {
    console.log(req.body.pfpname);
    let name = toString(req.body.pfpname);

    sendFromFileStreamBuffer(
      {
        name: name,
      }, 
      'user-pfp', 
      'pfptest', 
      path.resolve('./hosted/img/bubbles.png')
    );

    return res.redirect('/reset');
  } catch (err) {
    console.log(err);
    return res.json({error: err});
  }
};

const downloadPfp = async (req, res) => {
  try {
    let fileDownload = await testGetObjectFileDownload();
    return res.download(fileDownload);
  } catch (err) {
    console.log(err);
    return res.json({error: err});
  }
}
// const getPfp = async (req, res) => {

// };
// allows a current user to change their password
// const changePassword = async (req, res) =>npm {
//   // req.session.account.username
//   //const { username } = req.session.account;
//   const oldPass = `${req.body.oldPass}`;
//   const pass2 = `${req.body.pass2}`;
//   const pass3 = `${req.body.pass3}`;

//   if (!username || !oldPass || !pass2 || !pass3) {
//     return res.status(400).json({ error: 'All fields are required!' });
//   }

//   if (pass2 !== pass3) {
//     return res.status(400).json({ error: 'Passwords do not match!' });
//   }

//   try {
//     return await Account.authenticate(username, oldPass, async (err, account) => {
//       if (err || !account) {
//         return res.status(401).json({ error: 'Old password is incorrect!' });
//       }

//       const hash = await Account.generateHash(pass2);
//       await Account.updateOne({ username }, { password: hash });

//       //req.session.account = Account.toAPI(account);
//       return res.json({ redirect: '/home' });
//     });
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({ error: 'An error occured!' });
//   }
// };

// allows the user unlimited access to the app
// const buyPremium = async (req, res) => {
//   try {

//     return await Account.buyPremium(req.session.account._id, (acknowledged) => {
//       if (!acknowledged) {
//         res.status(500).json({error: 'Error updating account!'});
//       }

//       return res.redirect('/home');
//     });

//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({ error: 'Error retrieving user!' });
//   }
// };

module.exports = {
  loginPage,
  login,
  logout,
  signup,
  changePassPage,
  buyPremiumPage,
  docPage,
  addUser,
  getUser,
  verifyUser,
  uploadPfp,
  downloadPfp,

};
