// Author: Moss Limpert

// const models = require('../models');
const db = require('../database.js');

// const { Bubble, Account, Status } = models;

// splat world
// add crew
const addCrew = async (req, res) => {
  const crewName = `${req.body.name}`;
  const password = `${req.body.pass}`;
  const { owner } = req.body;
  const { color_r } = req.body;
  const { color_g } = req.body;
  const { color_b } = req.body;

  try {
    db.query('INSERT INTO splatworld.crew SET ?', {
      name: crewName,
      joincode: password,
      owner,
      color_r,
      color_g,
      color_b,
    }, (err) => {
      if (err) console.log(err);

      res.end();
    });

    console.log('Successfully inserted 1 crew');

    // query to add owner as crewmember datatype

    return res.redirect('/');
  } catch (err) {
    console.log(err);

    // failed to create/update
    if (err.code === 1004) {
      return res.status(500).json({ error: 'Failed to create new crew' });
    }

    return res.status(500).json({ error: 'An error occured!' });
  }
};

// get crew
const getCrew = (req, res) => {
  let name = null;

  if (req.query.name) name = req.query.name;

  if (name === null) return res.status(400).json({ error: 'No name provided.' });

  const sql = 'SELECT name, joincode, owner FROM splatworld.crew WHERE name = ?';
  try {
    db.execute(
      sql,
      [name],
      (err, results) => {
        if (err) {
          console.log(err);
          res.end();
        }

        if (results.length !== 0 && results.length === 1) {
          return res.status(302).json({ crew: results[0] });
        } if (results.length !== 0 && results.length > 1) {
          return res.status(302).json({ crews: results });
        } return res.status(404).json({ error: 'No crew found.' });
      },
    );
    console.log('Successfully retrieved crew(s)');

    return res.status(200);
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      error: 'Failed to retrieve crew.',
    });
  }
};

// const addCrewMember = () => {

// }

module.exports = {
  addCrew,
  getCrew,
};
