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
const getTag = (req, res) => {
    let id = null;
    let title = null;
    
    if (req.query.id) id = req.query.id;
    if (req.query.title) title = req.query.title;

    if (id === null && title === null) {
        return res.status(400).json({ error: 'No id or title provided.'})
    }

    let sql = 'SELECT title, crew_ref, active, author_ref FROM tag';
    if (id === null) {
        try {
            let addition = ` WHERE title = ? LIMIT 1`;

            db.execute(
                sql+addition,
                [title],
                (err, results, fields) => {
                    if (err) {
                        console.log(err);
                        res.end();
                    }

                    // https://www.youtube.com/watch?v=SnncAvMYxgY
                    res.render('app', {
                        title: 'tag data retrieval',
                        action: 'list',
                        tag: results,
                    });

                    //if (fields) console.log(fields);
                    console.log("aaaaaaaaaaaaaaaaaaaaaa", results);
                    return res.status(200);
            });
            console.log('Successfully retrieved 1 tag case 1');

            return res.redirect('/home');
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
                (err, results, fields) => {
                    if (err) console.log(err);

                    // res.render('app', {
                    //     title: 'tag data retrieval',
                    //     action: 'list',
                    //     tag: JSON.stringify(results),
                    // });
                    console.log('aaaaaaaaaaaaaaaaaaaa', results);
                    //if (fields) console.log(fields);
                    
                    return res.json(results);
            });
            console.log('Successfully retrieved 1 tag case 2');

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
                (err, results, fields) => {
                    if (err) console.log(err);

                    res.render('app', {
                        title: 'tag data retrieval',
                        action: 'list',
                        tag: results,
                    });
                    
                    //if (fields) console.log(fields);
                    
                    return res.status(200);
            });
            console.log('Successfully retrieved 1 tag case 3');

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