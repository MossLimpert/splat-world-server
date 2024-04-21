// Author: Thomas Martinez
// Very similar to User.js, seperated out so that further development will hopefully be easier.

const models = require('../models');
const bcrypt = require('bcrypt');

const { AdminAccount } = models;

// MySQL
const db = require('../database.js');

const loginPage = (req, res) => {
    res.render('admin-login');
}; // admin login page

const adminPage = (req, res) => {
    res.render('admin');
}

// verify admin LOGIN
const verifyAdmin = async (req, res) => {
    console.log(req);
    const sql = `SELECT username, password, id FROM ${process.env.DATABASE}.admin WHERE username = ?`;
    let user = null;
    let pass = null;

    console.log(req.body.user);
    console.log(req.body.pass);

    // add de-encryption step for password
    // console.log(`${req.body.username}`);
    // console.log(`${req.body.password}`);
    if (`${req.body.user}`) user = `${req.body.user}`;
    if (`${req.body.pass}`) pass = `${req.body.pass}`;

    console.log(`username: ${user}, password: ${pass}`);

    if (!user || !pass) {
        console.log("Missing username or password.");
        return res.status(400).send({ error: 'Missing username or password.' });
    }

    try {
        db.execute(
            sql,
            [user],
            async (err, results) => {
                if (err) console.log(err);

                //console.log(JSON.stringify(results));

                if (results && results.length !== 0) {
                    //const match = await bcrypt.compare(pass, results[0].password);
                    const match = await AdminAccount.authenticatePassword(pass, results[0].password);
                    console.log(`password match: ${match}`);

                    if (match) {
                        return res.status(202).json({
                            user: {
                                id: results[0].id,
                                username: results[0].username,
                            },
                        });
                    } 

                    return res.status(400).send({ error: 'Username or password incorrect' });
                } 
                
                return res.status(404).send({ error: 'User not found.' });
            },
        );

        console.log('Successfully retrieved user to compare.');

        //return res.redirect('/login');
    } catch (err) {
        console.log(err);

        return res.status(500).send({ error: 'Failed to log in user.' });
    }
};

const addAdmin = async (req, res) => {
    console.log(req);
    const user = `${req.body.user}`;
    const pass = `${req.body.pass}`;
    const pass2 = `${req.body.pass2}`;

    if ( !user || !pass || !pass2 ) {
        return res.status(400).json({ error: 'Not all fields have been inputed.' });
    }

    if (pass !== pass2) {
        return res.status(400).json({ error: 'Passwords do not match.' });
    }

    console.log(req.body);
    // try catch w pass hash
    try {
        const hash = await AdminAccount.generateHash(pass);
        console.log(user);
        console.log(hash);
        db.query(
        `INSERT INTO ${process.env.DATABASE}.admin SET ?`,
        {
            username: user,
            password: hash,
        },
        (err, results) => {
            if (err) {
            console.log(err);
            throw err;
            }

             console.log(results);
            return results;
        },
        );

        console.log('Successfully inserted 1 user.');

        return res.redirect('/admin');
    } catch (err) {
        console.log(err);
        // failed to create/update
        if (err.code === 1004) {
        return res.status(500).json({ error: 'Failed to create new user' });
        }

        return res.status(500).json({ error: 'An error occured!' });
    }
}

module.exports = {
    loginPage,
    adminPage,
    verifyAdmin,
    addAdmin,
};