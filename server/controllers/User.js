// Author: Moss Limpert

const bcrypt = require('bcrypt');
const path = require('path');
const sharp = require('sharp');
// const fs = require('fs');  // these will get used later when I figure out
// const fsPromises = fs.promises;  // how to delete the temporary files i download
// MySQL
const db = require('../database.js');
// MIN.IO
const minio = require('../objectstorage.js');
const { sendFromFileStreamBuffer, removeObject, getObjectFileDownload } = minio;
// models
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

// standardize pfp names
const generatePfpName = (uid) => `pfp-${uid}.jpg`;

// standardize header names
const generateHeaderName = (uid) => `header-${uid}.jpg`;

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
          return err;
        }

        //console.log(results);
        return { results };
    });

    return true;
  } catch (err) {
    return { error: err };
  }
};

// links a user and its header image
const linkHeader = (etag, uid) => {
  console.log(`etag: ${etag} uid: ${uid}`);
  try {
    db.query(
      `UPDATE ${process.env.DATABASE}.user SET header_link = ? WHERE id = ?`,
      [etag, uid],
      (err, results) => {
        if (err) {
          console.log(err);
          return err;
        }

        return { results };
    });

    return true;
  } catch (err) {
    return err;
  }
}

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
    console.log(hash);
    db.query(
      `INSERT INTO ${process.env.DATABASE}.user SET ?`,
      {
        username: username,
        password: hash
      },
      (err, results) => {
        if (err) {
          console.log(err);
          throw err;
        }

        //console.log(results);
        return results;
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

  const sql = `SELECT username, id, pfp_link, header_link FROM ${process.env.DATABASE}.user`;
  if (id === null) {
    try {
      const addition = ' WHERE username = ?';
      db.execute(
        sql + addition,
        [username],
        (err, results) => {
          if (err) console.log(err);

          console.log(results);

          if (results.length !== 0) return res.status(302).json({ 
              username: results[0].username,
              id: results[0].id,
              pfp_link: results[0].pfp_link,
              header_link: results[0].header_link
          });
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

          if (results && results.length !== 0) return res.status(302).json({
              username: results[0].username,
              id: results[0].id,
              pfp_link: results[0].pfp_link,
              header_link: results[0].header_link
            });
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

          if (results && results.length !== 0) return res.status(302).json({ 
              username: results[0].username,
              id: results[0].id,
              pfp_link: results[0].pfp_link,
              header_link: results[0].header_link
          });
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

// verify account LOGIN
const verifyUser = async (req, res) => {
  const sql = `SELECT username, password, id, pfp_link, header_link FROM ${process.env.DATABASE}.user WHERE username = ?`;
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

          console.log(results);

          if (match) {
            return res.status(202).send({
              user: {
                username: results[0].username,
                id: results[0].id,
                pfp_link: results[0].pfp_link,
                header_link: results[0].header_link
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
};  // login page

// allows a user to sign up for Bubbles
const signup = async (req, res) => {
  let username = null;
  let pass = null;
  let pass2 = null;

  if (req.body.username) username = req.body.username;
  if (req.body.pass) pass = req.body.pass;
  if (req.body.pass2) pass2 = req.body.pass2;

  console.log(req.body);
  console.log(username, pass, pass2);

  if (username === null || pass === null || pass2 === null) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  try {
    const hash = Account.generateHash(pass);

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

    return res.status(200).json({
      username: username,
    });
  } catch (err) {
    // console.log(err.errors);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already in use!' });
    }
    console.log("error: ", err);
    return res.status(500).json({ error: err });
  }
};

// uploads a profile pic to the server that the user sends
const uploadPfp = async (req, res) => {
  try {
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
    //console.log(filename);

    // send to minio
    const result = sendFromFileStreamBuffer(
      {
        name: req.body.pfpname,
        id: uid,
      },
      'user-pfp',
      filename,
      path.resolve(path.join(req.file.destination, 'testing.jpg')),
      (err, etag) => {
        if (err) {
          console.log(err);
          return err;
        }

        return linkPfp(etag, uid);
      },
    );

    console.log(result);
    // await deleteFile(path.resolve(path.join(req.file.destination, "testing.jpg")));
    // await deleteFile(path.resolve(path.join(req.file.destination, req.file.filename)));

    return res.redirect('/reset');
  } catch (err) {
    console.log(err);
    return res.json({ error: err });
  }
};

// downloads profile pic to the client
const downloadPfp = async (req, res) => {
  const uid = req.query.id;
  let name = req.query['download-name'];
  console.log('download pfp: uid: ', uid, 'name: ', name);
  //console.log("name: ", req.query["download-name"]);
  if (name === undefined) {
    name = generatePfpName(uid);
  } else if (uid === undefined) {
    name = 'no pfp';
  }

  try {
    /*generatePfpName(uid)*/
    await getObjectFileDownload('user-pfp', name);

    return res.download(path.resolve('hosted/downloads/pfp.jpg'));
  } catch (err) {
    console.log("error in downloadpfp catch", err);
    return res.status(500).json({error: err});
  }
};

// uploads a header pic to minio
const uploadHeader = async (req, res) => {
  try {
    const uid = req.body['user-id'];

    // sharp
    const filePath = path.resolve(path.join(req.file.destination, req.file.filename));
    const metadata = await getFileMetadata(filePath);
    console.log(metadata);


    // thumbnailing
    sharp(req.file.path).resize({
      width: 1080,
      fit: 'cover',
      withoutEnlargement: true,
      position: 'centre'
    }).jpeg({
      quality: 80,
      chromaSubsampling: '4:4:4',
    }).toFile(
      path.resolve(path.join(req.file.destination, 'header.jpg')),
      (err, info) => {
        if (err) {
          console.log(err);
          return err;
        }
        return info;
      }
    );

    // make filename
    let filename = generateHeaderName(uid);

    // send to minio
    sendFromFileStreamBuffer(
      {
        name: filename,
        id: uid,
      },
      'user-header',
      filename,
      path.resolve(path.join(req.file.destination, 'header.jpg')),
      (err, etag) => {
        if (err) {
          console.log(err);
          return err;
        }

        return linkHeader(etag, uid);
      }
    );

    //console.log('result:', result);

    // delete temp files here

    return res.json({message: 'Successfully uploaded header.'});

  } catch (err) {
    console.log(err);
    return res.json({error: err});
  }
}

// downloads a header pic to the client
const downloadHeader = async (req, res) => {
  //const uid = 
  const name = req.query['download-name'];

  if (name === undefined) {
    return res.status(400)
    .json({error: 'No filename provided to download header!'});
  }

  try {
    const results = await getObjectFileDownload('user-header', name);
    console.log(results);
    
    return res.download(path.resolve(`hosted/downloads/${name}.jpg`));
  } catch (err) {
    console.log(err);
    return res.status(500).json({error: err});
  }
}

// get names of crews from an array of crew ids
const getCrewNamesById = async (res, responseObj) => {
  try {
    const ids = responseObj.ids;

    db.query(
      `SELECT name FROM ${process.env.DATABASE}.crew WHERE id IN (?)`,
      [ids],
      (err, results) => {
        if (err) throw err;

        //console.log(results);

        let names = [];
        for (let i = 0; i < results.length; i++) {
          names.push(results[i].name);
        }

        let response = {};
        Object.assign(response, responseObj);
        response.names = names;

        console.log(response);
        return res.json({
          count: response.count,
          ids: response.ids,
          names: response.names,
        });
      }
    );

    return false;
  } catch (err) {
    console.log(err);
    return res.json({error: err});
  }
}

// gets list of crew ids and returns to user
// TODO: get crew names and include that too
const getUserCrews = async (req, res) => {
  const uid = req.query.id;

  try {
    db.query(
      `SELECT * FROM ${process.env.DATABASE}.crew_member WHERE user_ref = ?`,
      [uid],
      async (err, results) => {
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

          //console.log(crewNames);
          // console.log(ids);

          response = {
            count: count,
            ids: ids,
          };
          console.log(response);
          //return res.end(response, 'json');
        }
        else {
          response = {
            error: "no results found"
          }
          return res.json(response);
        } 
        return getCrewNamesById(res, response);
      });
    return false;
  } catch (err) {
    console.log(err);
    return res.json({ error: err });
  }
};

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
const changePassword = async (req, res) => {
  const uid = parseInt(req.body.id, 10);
  const oldPass = `${req.body.oldPass}`;
  const pass2 = `${req.body.pass2}`;
  const pass3 = `${req.body.pass3}`;
  //console.log("in change password ");

  //console.log(req.body);
  if ( !uid || !oldPass || !pass2 || !pass3) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (pass2 !== pass3) {
    return res.status(400).json({ error: 'New passwords do not match!' });
  }

  try {
    db.query(
      `SELECT password FROM ${process.env.DATABASE}.user WHERE id = ?`,
      [uid],
      async (err, results) => {
        if (err) {
          console.log(err);
          return err;
        }
        //console.log(results);
        
        if (results && results.length !== 0) {
          const match = bcrypt.compare(oldPass, results[0].password);
          if (match) {
            const newHash = await Account.generateHash(pass2);

            db.query(
              `UPDATE ${process.env.DATABASE}.user SET password = ? WHERE id = ?`,
              [newHash, uid],
              (error, results2) => {
                if (error) {
                  console.log(error);
                  throw error;
                }
                console.log('Successfully changed password')
                return res.json({results: results2});
            });
          } else return res.status(400).json({error: 'Old password provided does not match the one we have on file.'});
        } else return res.status(404).json({error: 'No password found! Please retry.'});

        return false;
      });

    return false;
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
};

// allows a user to remove their current pfp
const removePfp = async (req, res) => {
  const uid = req.query.id;
  console.log("in remove pfp user js");
  try {
    db.query(
      `UPDATE ${process.env.DATABASE}.user SET pfp_link = NULL WHERE id = ?`,
      [uid],
      (err, results) => {
        if (err) {
          console.log(err);
          throw err;
        }
        console.log("remove profile pic: ", results);
        return {results: results};
    });

    // remove img from minio here
    let results = await removeObject('user-pfp', `pfp-${uid}`);

    console.log(results);

    return res.json({message: 'Successfully removed profile pic'});

  } catch (err) {
    console.log(err);
    return res.json({error: err});
  }
};

// remove current user header
const removeHeader = async (req, res) => {
  const uid = req.query.id;
  console.log("in remove header user js");
  try {
    db.query(
      `UPDATE ${process.env.DATABASE}.user SET header_link = NULL WHERE id = ?`,
      [uid],
      (err, results) => {
        if (err) {
          console.log(err);
          return err;
        }

        return {results: results};
    });

    // remove img from minio here
    let results = removeObject('user-header', `header-${uid}`);

    console.log(results);

    return res.json({message: 'Successfully removed header image'});

  } catch (err) {
    console.log(err);
    return res.json({error: err});
  }
};

module.exports = {
  loginPage,
  signup,
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
  uploadHeader,
  downloadHeader,
  changePassword,
  removePfp,
  removeHeader,
};
