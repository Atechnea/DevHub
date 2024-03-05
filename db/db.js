const mysql = require('mysql');

const pool = mysql.createPool({
    host: "db.devhub.diskobolo.org",
    user: "atechnea",
    password: "2StkpKE3B9JDP",
    database: "app_db",
    port: 3306,
    connectionLimit: 50
});

module.exports = pool;