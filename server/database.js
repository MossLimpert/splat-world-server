const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    database: 'splat_world',
    user: 'root',
    password: 'V-8BhthTn9vjMU$E'
});

module.exports = connection;