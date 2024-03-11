const mysql = require('mysql2');

const pool = mysql.createPool({
    host: "bfqppaygzcluc4e57nao-mysql.services.clever-cloud.com",
    user: "ubcexosvcdagof9l",
    password: "WYChuJ7MK4Swg8oJiFYl",
    database: "bfqppaygzcluc4e57nao",
    port:3306,
    connectionLimit: 50
});

module.exports = pool;