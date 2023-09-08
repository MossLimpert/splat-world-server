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
    let id = null;
    let title = null;
    console.log(req.params);
    if (req.params.tid) id = req.params.tid;
    if (req.params.title) title = req.params.title;

    if (id === null && title === null) {
        return res.status(400).json({ error: 'No id or title provided.'})
    }

    let sql = 'SELECT title, crew_ref, active, author_ref FROM tag LIMIT 1';
    if (id === null) {
        try {
            db.query(sql, {
                title: title,
            }, (err, data) => {
                if (err) {
                    console.log(err);
                    res.end();
                }
                // https://www.youtube.com/watch?v=SnncAvMYxgY
                res.render('login', {
                    title: 'tag data retrieval',
                    action: 'list',
                    tag: data,
                });
                return res.json(data);
            });
            console.log('Successfully retrieved 1 tag');

            return res.redirect('/home');
        } catch (err) {
            console.log(err);

            return res.status(500).json({
                error: 'Failed to retrieve tag.'
            });
        }
    } else if (title === null) {
        try {
            db.query(sql, {
                id: id,
            }, (err) => {
                if (err) console.log(err);

                res.end();
            });
            console.log('Successfully retrieved 1 tag');

            return res.redirect('/home');
        } catch (err) {
            console.log(err);

            return res.status(500).json({
                error: 'Failed to retrieve tag.'
            });
        }
    } else {
        try {
            db.query(sql, {
                id: id,
                title: title,
            }, (err) => {
                if (err) console.log(err);

                res.end();
            });
            console.log('Successfully retrieved 1 tag');

            return res.redirect('/home');
        } catch (err) {
            console.log(err);

            return res.status(500).json({
                error: 'Failed to retrieve tag.'
            });
        }
    }
};

module.exports = {
    home,
    addTag,
    getTag
};