var mysql = require('mysql2');
require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'development'}` });


const db = mysql.createConnection({
    host: process.env.host,
    user: process.env.dbUserName,
    password: process.env.dbPassword,
    database: process.env.db,
    // debug: true, // Enable connection debugging
});

module.exports = db;