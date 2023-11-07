// Author: Moss Limpert

const db = require('../database.js');

// splat world
// add user to crew (through crew_member)
const associateCrewMember = async (uid, cid, res) => {
  try {
    db.query(
      `INSERT INTO ${process.env.DATABASE}.crew_member SET ?`,
      {
        user_ref: uid,
        crew: cid,
      },
      (err) => {
        if (err) {
          console.log(err);
          throw err;
        }

        // console.log(results);

        return res.end();
        // if (results.length !== 0) {
        //   let count = results.length;
        //   let names;

        //   console.log(results);

        //   return res.json({
        //     count: count,
        //     names: names
        //   });
        // } else return res.json({error: 'An error getting user crews!'});
      },
    );

    return res.end();
  } catch (err) {
    console.log(err);
    return res.json({ error: err });
  }
};

// add crew member
const addCrewMember = async (req, res) => {
  const uid = req.query.id;
  const cid = req.query.crewid;

  return associateCrewMember(uid, cid, res);
};

// add crew
const addCrew = async (req, res) => {
  const crewName = `${req.body.name}`;
  const password = `${req.body.pass}`;
  const { owner } = req.body;
  const { color_r } = req.body;
  const { color_g } = req.body;
  const { color_b } = req.body;

  try {
    db.query(`INSERT INTO ${process.env.DATABASE}.crew SET ?`, {
      name: crewName,
      joincode: password,
      owner,
      color_r,
      color_g,
      color_b,
    }, (err, results) => {
      if (err) {
        console.log(err);
        throw err;
      }

      // console.log("results insert crew: ", results['insertId']);
      // query to add owner as crewmember datatype
      return associateCrewMember(owner, results.insertId, res);
    });

    console.log('Successfully inserted 1 crew');

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

  const sql = `SELECT name, joincode, owner FROM ${process.env.DATABASE}.crew WHERE name = ?`;
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
  addCrewMember,
  associateCrewMember,

};
