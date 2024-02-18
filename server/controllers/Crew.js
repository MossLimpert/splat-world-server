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
      (err, results) => {
        if (err) {
          console.log(err);
          throw err;
        }

        // console.log(results);

        //return res.end();
        if (results.length !== 0) {

          return res.json({
            message: 'successfully added crew and associated owner with crew'
          });
        } 
        //return res.end();
        else return res.json({error: 'An error returning crew info! Crew Successfully added.'});
      },
    );

    //return res.end();
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

    //return res.redirect('/');
    
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

  const sql = `SELECT name, joincode, owner, color_r, color_g, color_b FROM ${process.env.DATABASE}.crew WHERE name = ?`;
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

// returns a list of crew member names using the search query of name or crew id
// const getCrewMembers = (req, res) => {
//   let name = null;
//   let crew = null;

//   if (req.query.name) name = req.query.name;
//   if (req.query.cid) crew = req.query.cid;

//   let sql = `SELECT * FROM ${process.env.DATABASE}.crew_member `;
//   if (name === null && crew != null) {
//     let addition = 'WHERE crew = ?';

//     try {
//       db.execute(
//         sql + addition,
//         [crew],
//         (err, results) => {
//           if (err) throw err;

//           if (results.length !== 0 && results.length === 1) {
//             return res.status(302).json({ crewMembers: results[0]});
//           } else if (results.length !== 0 && results.length > 1) {
//             return res.status(302).json({ crewMembers: results});
//           } else return res.status(404).json({error: 'No crew members found.'});
//         }
//       )
//     } catch (err) {
//       console.log(err);
//       return res.status(500).json({error: err});
//     }
//   } else if (crew === null && name != null) {
//     let addition = 'WHERE name = ?';

//     try {
//       db.execute(
//         sql + addition,
//         [name],
//         (err, results) => {
//           if (err) throw err;

//           if (results.length !== 0 && results.length === 1) {
//             return res.status(302).json({ crewMembers: results[0]});
//           } else if (results.length !== 0 && results.length > 1) {
//             return res.status(302).json({ crewMembers: results});
//           } else return res.status(404).json({error: 'No crew members found.'});
//         }
//       )
//     } catch (err) {
//       console.log(err);
//       return res.status(500).json({error: err});
//     }
//   } else if (name === null && crew === null) {
//      return res.status(400).json({error: 'No crew name or id provided.'});
//   } else return res.status(500).end();
// }

module.exports = {
  addCrew,
  getCrew,
  addCrewMember,
  associateCrewMember,

};
