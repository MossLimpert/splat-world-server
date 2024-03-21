// Author: Thomas Martinez
// Very similar to User.js, seperated out so that further development will hopefully be easier.

const models = require('../models');

const { Admin } = models;

// MySQL
const db = require('../database.js');

const loginPage = (req, res) => {
    res.render('admin-login');
}; // admin login page

const adminManagementPage = (req, res) => {
    res.render('admin-management');
}

// verify admin LOGIN
const verifyAdmin = async (req, res) => {
    const sql = `SELECT username, password, id FROM ${process.env.DATABASE}.admin WHERE username = ?`;
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
                return res.status(202).json({
                user: {
                    id: results[0].id,
                    username: results[0].username,
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
        const hash = pass;//await Admin.generateHash(pass);
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

        return res.redirect('/admin-management');
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
    adminManagementPage,
    verifyAdmin,
    addAdmin,
};