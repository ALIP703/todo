var mysql = require('mysql2');


const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "MySql@123",
    database: 'task',
});

module.exports = db;