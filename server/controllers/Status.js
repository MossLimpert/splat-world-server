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
        return res.status(500).json({ error: 'Failed to create new tag'});
      }
  
      return res.status(500).json({ error: 'An error occured!' });
    }
};

// get a tag
const getTag = (req, res) => {
    let id = null;
    let title = null;
    
    //console.log(req.query);

    if (req.query.id) id = req.query.id;
    if (req.query.title) title = req.query.title;

    if (id === null && title === null) {
        return res.status(400).json({ error: 'No id or title provided.'});
    }

    let sql = 'SELECT title, crew_ref, active, author_ref FROM tag';
    if (id === null) {
        try {
            let addition = ` WHERE title = ? LIMIT 1`;

            db.execute(
                sql+addition,
                [title],
                (err, results) => {
                    if (err) {
                        console.log(err);
                        res.end();
                    }

                    //console.log(results);

                    //res.redirect('/home');
                    if (results && results.length !== 0) return res.status(302).json({tag: results[0]});
                    else return res.status(404).json({error: 'No tag found.'});
            });
            console.log('Successfully retrieved 1 tag case 1');

            //return res.redirect('/home');
            return res.status(200);
        } catch (err) {
            console.log(err);

            return res.status(500).json({
                error: 'Failed to retrieve tag.'
            });
        }
    } else if (title === null) {
        try {
            let addition = ` WHERE id = ? LIMIT 1`;
            db.execute(
                sql+addition,
                [id], 
                (err, results) => {
                    if (err) console.log(err);
                    
                    //console.log(results);

                    //res.redirect('/home');
                    if (results && results.length !== 0) return res.status(302).json({tag: results[0]});
                    else return res.status(404).json({error: 'No tag found.'});
            });
            console.log('Successfully retrieved 1 tag case 2');

            //return res.redirect('/home');
            return res.status(200);
        } catch (err) {
            console.log(err);

            return res.status(500).json({
                error: 'Failed to retrieve tag.'
            });
        }
    } else {
        try {
            let addition = ` WHERE id = ? OR title = ? LIMIT 1`;
            db.execute(
                sql+addition,
                [id, title], 
                (err, results) => {
                    if (err) console.log(err);

                    //console.log(results);

                    //res.redirect('/home');
                    if (results && results.length !== 0) return res.status(302).json({tag: results[0]});
                    else return res.status(404).json({error: 'No tag found.'});
            });
            console.log('Successfully retrieved 1 tag case 3');

            //return res.redirect('/home');
            return res.status(200);
        } catch (err) {
            console.log(err);

            return res.status(500).json({
                error: 'Failed to retrieve tag.'
            });
        }
    }
};

// get multiple tags
const getTags = (req, res) => {
    let cid = null;
    let id = null;

    if (req.query.cid) cid = req.query.cid;
    if (req.query.id) id = req.query.id;

    if (id === null && cid === null) {
        return res.status(400).json({error: 'No user id or crew id provided'});
    }

    let sql = 'SELECT * FROM tag'
    if (id === null) {
        try {
            let addition = ' WHERE crew_ref = ?';
            db.execute(
                sql+addition,
                [cid],
                (err, results) => {
                    if (err) console.log(err);

                    if (results && results.length !== 0) return res.status(302).json({tags: results});
                    else return res.status(404).json({error: 'No tags found.'});
            });
            console.log('Successfully retrieved tags: case 1');

            return res.status(200);
        } catch (err) {
            console.log(err);

            return res.status(500).json({
                error: 'Failed to retrieve tags.'
            });
        }
    } else if (cid === null) {
        try {
            let addition = ' WHERE author_ref = ?';
            db.execute(
                sql+addition,
                [id],
                (err, results) => {
                    if (err) console.log(err);

                    if (results && results.length !== 0) return res.status(302).json({tags: results});
                    else return res.status(404).json({error: 'No tags found.'});
            });
            console.log('Successfully retrieved tags: case 2');

            return res.status(200);
        } catch (err) {
            console.log(err);

            return res.status(500).json({
                error: 'Failed to retrieve tags.'
            });
        }
    } else {
        try {
            let addition = 'WHERE crew_ref = ? OR author_ref = ?';
            db.execute(
                sql+addition,
                [cid, id],
                (err, results) => {
                    if (err) console.log(err);

                    if (results && results.length !== 0) return res.status(302).json({tags: results});
                    else return res.status(404).json({error: 'No tags found.'});
            });
            console.log('Successfully retrieved tags: case 3');

            return res.status(200);
        } catch (err) {
            console.log(err);

            return res.status(500).json({
                error: 'Failed to retrieve tags.'
            });
        }
    } 
};

// save a tag (add to saved tags)
const saveTag = (req, res) => {
    let id = null;
    let title = null;

    if (req.body.id) id = req.body.id;
    if (req.body.title) title = req.body.title;

    if (id === null && title === null) {
        return res.status(400).json({error: 'No id or title.'});
    }

    let sql = 'UPDATE tag SET saved = 1'
    if (id === null) {
        try {
            let addition = ' WHERE title = ?';
            db.execute(
                sql+addition,
                [title],
                (err, results) => {
                  if (err) console.log(err);
        
                  //console.log(results);
        
                  if (results.length !== 0) return res.status(302).json(results);
                  else return res.status(404).json({ error: 'No tag found.'});
                });
                console.log('Successfully updated 1 tag: case 1');
        
                return res.status(200);
        } catch (err) {
            console.log(err);

            return res.status(500).json({
                error: 'Failed to update tag.'
            });
        }
    } else if (title === null) {
        try {
            let addition = ' WHERE id = ?'
            db.execute(
                sql+addition,
                [id],
                (err, results) => {
                  if (err) console.log(err);
        
                  //console.log(results);
        
                  if (results.length !== 0) return res.status(302).json(results);
                  else return res.status(404).json({ error: 'No tag found.'});
                });
                console.log('Successfully updated 1 tag: case 2');
        
                return res.status(200);
        } catch (err) {
            console.log(err);

            return res.status(500).json({
                error: 'Failed to update tag.'
            });
        }
    } else {
        try {
            let addition = ' WHERE id = ? OR title = ?'
            db.execute(
                sql+addition,
                [id,title],
                (err, results) => {
                  if (err) console.log(err);
        
                  //console.log(results);
        
                  if (results.length !== 0) return res.status(302).json(results);
                  else return res.status(404).json({ error: 'No tag found.'});
                });
                console.log('Successfully updated 1 tag: case 3');
        
                return res.status(200);
        } catch (err) {
            console.log(err);

            return res.status(500).json({
                error: 'Failed to update tag.'
            });
        }
    }
};

module.exports = {
    home,
    addTag,
    getTag,
    getTags,
    saveTag
};