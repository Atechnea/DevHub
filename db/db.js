const mysql = require('mysql2');

const pool = mysql.createPool({
    host: "188.127.184.221",
    user: "devhub_admin",
    password: "HelloThere123",
    database: "devhub1",
    port:3306,
    connectionLimit: 50
});

module.exports = pool;