const mysql = require('mysql2');

const pool = mysql.createPool({
    host: "dbconndevhub.diskobolo.org",
    user: "admin_gps",
    password: "1234",
    database: "devhub1",
    port: 3306,
    connectionLimit: 50
});

module.exports = pool;