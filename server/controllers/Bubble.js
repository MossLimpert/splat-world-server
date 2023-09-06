// Author: Moss Limpert

//const models = require('../models');
const db = require('../database.js');

//const { Bubble, Account, Status } = models;

// splat world
// add crew
const addCrew = async (req, res) => {
    const crewName = `${req.body.name}`;
    const password = `${req.body.pass}`;
    const owner = req.body.owner;
    const color_r = req.body.color_r;
    const color_g = req.body.color_g;
    const color_b = req.body.color_b;

    try {
        db.query('INSERT INTO crew SET ?', {
            name: crewName,
            joincode: password,
            owner: owner,
            color_r: color_r,
            color_g: color_g,
            color_b: color_b
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
        return res.status(500).json({ error: 'Failed to create new crew'});
      }
  
      return res.status(500).json({ error: 'An error occured!' });
    }
}

// const addCrewMember = () => {

// }

module.exports = {
    addCrew
}