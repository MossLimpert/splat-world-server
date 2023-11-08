// Author: Moss Limpert

const bcrypt = require('bcrypt');
const path = require('path');
const sharp = require('sharp');
// const fs = require('fs');
// const fsPromises = fs.promises;
// MySQL
const db = require('../database.js');
//MIN.IO
const minio = require('../objectstorage.js');
const { sendFromFileStreamBuffer, testGetObjectFileDownload, getObjectFileDownload } = minio;

const models = require('../models');
const { Account } = models;

// uses sharp to get file metadata
const getFileMetadata = async (filePath) => {
  try {
    const metaData = await sharp(filePath).metadata();
    // console.log(metaData);
    return metaData;
  } catch (err) {
    console.log(err);
    return err;
  }
};

// delete file
// https://bobbyhadz.com/blog/javascript-node-js-delete-file#deleting-a-file-using-unlink-with-fspromises-and-asyncawait
// async function deleteFile(path) {
//   try {
//     await fsPromises.unlink(path);

//     console.log(`Deleted the file under ${path}`);
//   } catch (err) {
//     console.log('An error occured: ', err.message);
//   }
// }

// link a user to its profile picture
const linkPfp = (etag, uid) => {
  console.log(`etag: ${etag} uid: ${uid}`);
  try {
    db.query(
      `UPDATE ${process.env.DATABASE}.user SET pfp_link = ? WHERE id = ?`,
      [etag, uid],
      (err, results) => {
        if (err) {
          console.log(err);
          throw err;
        }

        console.log(results);
        return { results };
      },
    );

    return true;
  } catch (err) {
    return { error: err };
  }
};

// get the minio etag associated with a user's pfp
const getPfpLink = (req, res) => {
  const { uid } = req.query;
  try {
    db.query(
      `SELECT pfp_link FROM ${process.env.DATABASE}.user WHERE id = ?`,
      [uid],
      (err, results, fields) => {
        if (err) {
          console.log(err);
          return err;
        }

        console.log(results, fields);
        if (results && results.length !== 0) return res.json({ results });
        return res.status(500).json({ error: err });
      },
    );

    return res.redirect('/');
  } catch (err) {
    console.log(err);
    return err;
  }
};

// const downloadPfpByEtag = (req, res) => {

// };

// get # of tags a user has
const getUserTagCount = (req, res) => {
  const uid = Number(req.query.id);

  try {
    db.query(
      `SELECT * FROM ${process.env.DATABASE}.tag WHERE author_ref = ?`,
      [uid],
      (err, results) => {
        if (err) {
          console.log(err);
        }

        // console.log(fields);
        const tagCount = results.length;
        // console.log(results);
        // console.log(tagCount);

        if (results && results.length >= 0) {
          return res.json({ count: tagCount });
        } else return res.json({ error: err });
      },
    );

    return false;
  } catch (err) {
    console.log(err);
    return res.json({ error: err });
  }
};

// splat world
// add user
const addUser = async (req, res) => {
  // console.log(req);
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  // console.log(req.body);
  // try catch w pass hash
  try {
    const hash = await Account.generateHash(pass);

    db.query(
      `INSERT INTO ${process.env.DATABASE}.user SET ?`,
      {
        username,
        password: hash,
      },
      (err) => {
        if (err) console.log(err);

        res.end();
      },
    );

    console.log('Successfully inserted 1 user.');

    return res.redirect('/');
  } catch (err) {
    console.log(err);
    // failed to create/update
    if (err.code === 1004) {
      return res.status(500).json({ error: 'Failed to create new user' });
    }

    return res.status(500).json({ error: 'An error occured!' });
  }
};

// get a user
// ADD: GET PFP LINK, tag count, ooooh take in an array of desired variables? an enum?
const getUser = (req, res) => {
  let username = null;
  let id = null;

  if (req.query.id) id = req.query.id;
  if (req.query.username) username = req.query.username;

  // console.log(id, username);

  if (id === null && username === null) {
    return res.status(400).json({ error: 'No id or username provided.' });
  }

  const sql = `SELECT username, join_date FROM ${process.env.DATABASE}.user`;
  if (id === null) {
    try {
      const addition = ' WHERE username = ?';
      db.execute(
        sql + addition,
        [username],
        (err, results) => {
          if (err) console.log(err);

          console.log(results);

          if (results.length !== 0) return res.status(302).json({ user: results[0] });
          return res.status(404).json({ error: 'No user found.' });
        },
      );
      console.log('Successfully retrieved 1 user: case 1');

      return res.status(200);
    } catch (err) {
      console.log(err);

      return res.status(500).json({
        error: 'Failed to retrieve user.',
      });
    }
  } else if (username === null) {
    try {
      const addition = ' WHERE id = ?';
      db.execute(
        sql + addition,
        [id],
        (err, results) => {
          if (err) console.log(err);

          console.log(results);

          if (results && results.length !== 0) return res.status(302).json({ user: results[0] });
          return res.status(404).json({ error: 'No user found.' });
        },
      );
      console.log('Successfully retrieved 1 user: case 2');

      return res.status(200);
    } catch (err) {
      console.log(err);

      return res.status(500).json({
        error: 'Failed to retrieve user.',
      });
    }
  } else {
    try {
      const addition = ' WHERE id = ? OR username = ?';
      db.execute(
        sql + addition,
        [id, username],
        (err, results) => {
          if (err) console.log(err);

          console.log(results);

          if (results && results.length !== 0) return res.status(302).json({ user: results[0] });
          return res.status(404).json({ error: 'No user found.' });
        },
      );
      console.log('Successfully retrieved 1 user: case 3');

      return res.status(200);
    } catch (err) {
      console.log(err);

      return res.status(500).json({
        error: 'Failed to retrieve user.',
      });
    }
  }
};

// verify account
const verifyUser = async (req, res) => {
  const sql = `SELECT username, password, id FROM ${process.env.DATABASE}.user WHERE username = ?`;
  let username = null;
  let password = null;

  // add de-encryption step for password
  // console.log(`${req.body.username}`);
  // console.log(`${req.body.password}`);
  if (`${req.body.username}`) username = `${req.body.username}`;
  if (`${req.body.password}`) password = `${req.body.password}`;

  if (username === null || password == null) {
    return res.status(400).send({ error: 'Either username or password is missing. You need both to login.' });
  }

  try {
    db.execute(
      sql,
      [username],
      async (err, results) => {
        if (err) console.log(err);

        // console.log(results);

        if (results && results.length !== 0) {
          const match = await bcrypt.compare(password, results[0].password);

          if (match) {
            return res.status(202).send({
              user: {
                username: results[0].username,
                id: results[0].id,
              },
            });
          } return res.status(400).send({ error: 'Username or password incorrect' });
        } return res.status(404).send({ error: 'User not found.' });
      },
    );

    console.log('Successfully retrieved user to compare.');
    return res.status(200);
  } catch (err) {
    console.log(err);

    return res.status(500).send({ error: 'Failed to log in user.' });
  }
};

const loginPage = (req, res) => {
  res.render('login');
}; // login
const buyPremiumPage = (req, res) => res.render('buy-premium'); // buy premium page
const docPage = (req, res) => res.render('docs'); // documentation page
const changePassPage = (req, res) => res.render('reset'); // change password page

// logs a user out of their account.
const logout = (req, res) => res.redirect('/');

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
    // req.session.account = Account.toAPI(account);

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

    db.query(
      `INSERT INTO ${process.env.DATABASE}.user SET ?`,
      {
        username,
        password: hash,
      },
      (err) => {
        if (err) console.log(err);

        res.end();
      },
    );

    console.log('Successfully inserted 1 user.');

    return res.redirect('/');
  } catch (err) {
    // console.log(err.errors);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already in use!' });
    }

    return res.status(500).json({ error: err });
  }
};

// uploads a profile pic to the server that the user sends
const uploadPfp = async (req, res) => {
  try {
    // before it gets here, multer middleware makes it accessible
    // through req.file

    // console.log(req.file);
    // console.log(req.body.pfpname);
    // console.log("userid: ", req.body.id);
    // console.log("req body: ", req.body);

    const uid = req.body['user-id'];

    // SHARP IMAGE COMPRESSION
    const filePath = path.resolve(path.join(req.file.destination, req.file.filename));
    const metadata = await getFileMetadata(filePath);

    // thumbnail image
    sharp(req.file.path).resize(
      Math.round(metadata.width / 2),
      Math.round(metadata.height / 2),

    ).jpeg({
      quality: 80,
      chromaSubsampling: '4:4:4',

    }).toFile(
      path.join(req.file.destination, 'testing.jpg'),
      (err, info) => {
        if (err) {
          console.log(err);
          return err;
        }
        return info;
      },
    );

    // create custom filename
    let filename = generatePfpName(uid);

    // send to minio
    const real = sendFromFileStreamBuffer(
      {
        name: req.body.pfpname,
        id: uid,
      },
      'user-pfp',
      `${filename}.jpg`,
      path.resolve(path.join(req.file.destination, 'testing.jpg')),
      (err, etag) => {
        if (err) {
          console.log(err);
          throw err;
        }

        return linkPfp(etag, uid);
      },
    );

    console.log('real: ', real);

    // await deleteFile(path.resolve(path.join(req.file.destination, "testing.jpg")));
    // await deleteFile(path.resolve(path.join(req.file.destination, req.file.filename)));

    return res.redirect('/reset');
  } catch (err) {
    console.log(err);
    return res.json({ error: err });
  }
};

const downloadPfp = async (req, res) => {
  // const uid = req.query.id;
  // try {
  //   /*generatePfpName(uid)*/
  //   const thingy = await getObjectFileDownload('user-pfp', 'pfp-test');
  //   console.log(thingy);

  //   return false;
  // } catch (err) {
  //   console.log(err);
  //   return res.status(500).json({error: err});
  // }

 //return res.download('/hosted/img/newpfp.png');
  try {
    await testGetObjectFileDownload();
    console.log(req);
    return res.download('/hosted/img/testDownload.png');
  } catch (err) {
    console.log(err);
    return res.json({ error: err });
  }
};

const getUserCrews = async (req, res) => {
  const uid = req.query.id;

  try {
    db.query(
      `SELECT * FROM ${process.env.DATABASE}.crew_member WHERE user_ref = ?`,
      [uid],
      (err, results) => {
        if (err) {
          console.log(err);
          throw err;
        }

        let response = {
          error: "didn't work"
        };

        if (results && results.length !== 0) {
          const count = results.length;
          const ids = [];

          for (let i = 0; i < results.length; i++) {
            ids.push(results[i].crew);
          }
          // console.log(ids);

          response = {
            count: count,
            ids: ids
          };
          console.log(response);
          //return res.end(response, 'json');
        } 
        return res.json(response);
      });
    return false;
  } catch (err) {
    console.log(err);
    return res.json({ error: err });
  }
};

const generatePfpName = (uid) => `pfp-${uid}.jpg`;

// allows a user to upload a new profile picture to replace their current profile picture
const changePfp = async (req, res) => {
  // upload new pic,
  // then remove old pic
  // console.log(req.body);
  const uid = req.body['user-id'];
  const filePath = path.resolve(path.join(req.file.destination, req.file.filename));
  const fileName = req.body.pfpname;

  // check for bad request
  if (!uid && !filePath) {
    res.status(400).json({ error: 'No user id, no file, and no file name provided!' });
  } else if (!filePath && uid) {
    res.status(400).json({ error: 'No file provided.' });
  } else if (!uid && filePath) {
    res.status(400).json({ error: 'No user id provided' });
  }

  // if no filename provided, make one to standard
  if (!fileName) {
    generatePfpName(uid);
  }

  // get the old etag and

  const metaData = await getFileMetadata(filePath);
  // console.log("METADATA: ", metaData);

  // thumbnail image
  sharp(req.file.path).resize(
    Math.round(metaData.width / 2),
    Math.round(metaData.height / 2),

  ).jpeg({
    quality: 80,
    chromaSubsampling: '4:4:4',

  }).toFile(
    path.join(req.file.destination, 'changeProfilePic.jpg'),
    (err, info) => {
      if (err) {
        console.log(err);
        return err;
      }
      return info;
    },
  );

  // send to minio and link pfp in sql after thats done
  /* let minioOutput = */ sendFromFileStreamBuffer(
    {
      name: req.body.pfpname,
      id: req.body.id,
    },
    'user-pfp',
    `${fileName}.jpg`,
    path.resolve(path.join(req.file.destination, 'changeProfilePic.jpg')),
    (err, etag) => {
      if (err) {
        console.log(err);
        throw err;
      }

      return linkPfp(etag, uid);
    },
  );

  // delete files
  // await deleteFile(path.resolve(path.join(req.file.destination, "testing.jpg")));
  // await deleteFile(path.resolve(pah.join(req.file.destination, req.file.filename)));
  // delete old minio file

  return res.end();
};

// allows a user to get their total amount of splat points
const getPoints = async (req, res) => {
  const uid = req.query.id;

  try {
    db.query(
      `SELECT points FROM ${process.env.DATABASE}.tag WHERE author_ref = ?`,
      [uid],
      (err, results) => {
        if(err) {
          console.log(err);
          throw err;
        }

        //console.log(results);
        let total = 0;
        for (let i = 0; i < results.length; i++) {
          total += results[i].points;
        }
        console.log(total);

        return res.json({points: total});
    });

    return false;
  } catch (err) {
    console.log(err);
    return res.status(500).json({error: err});
  }
};

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
  getUserTagCount,
  getPfpLink,
  getUserCrews,
  changePfp,
  getPoints,

};
