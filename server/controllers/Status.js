// Author: Moss Limpert

const db = require('../database.js');

// render homepage
const home = async (req, res) => res.render('app');

// add a test tag
const addTag = async (req, res) => {
    const author_ref = req.body.author_ref;
    const crew = req.body.crew;
    const title = req.body.title;

    try {
        db.query('INSERT INTO tag SET ?', {
            author_ref: author_ref,
            crew_ref: crew,
            title: title,
        }, (err) => {
            if (err) console.log(err);

            res.end();
        });

        console.log('Successfully inserted 1 tag.');

        return res.redirect('/home');
    } catch (err) {
        console.log(err);

        // failed to create/update
        if (err.code === 1004) {
        return res.status(500).jso({       error: 'Failed to create new tag'});
      }
  
      return res.status(500).json({ error: 'An error occured!' });
    }
}

// get a tag
const getTag = async (req, res) => {
    const id = null;
    const title = null;
    if (req.body.id) id = req.body.id;
    if (req.body.title) title = req.body.title;

    if (id === null && title === null) {
        return res.status(400).json({ error: 'No id or title provided.'})
    }

    if (id === null) {
        let sql = 'SELECT title, crew_ref, active, author_ref FROM tag LIMIT 1';
        try {
            
        } catch (err) {

        }
    } else if (title === null) {
        let sql = '';
        try {

        } catch (err) {

        }
    } else {
        let sql = '';
        try {

        } catch (err) {

        }
    }
}

module.exports = {
    home,
    addTag,
    getTag
};