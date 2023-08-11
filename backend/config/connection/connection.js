var mysql = require('mysql2');
require('dotenv').config();


const db = mysql.createConnection({
    host: process.env.host,
    user: process.env.dbUserName,
    password: process.env.dbPassword,
    database: process.env.db,
});

module.exports = db;