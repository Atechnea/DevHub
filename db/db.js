const mysql = require('mysql2');
const expressSession = require('express-session');
const MySQLStore = require('express-mysql-session')(expressSession);
require('dotenv').config();

// Database
const pool = mysql.createPool({
    host: process.env.MYSQL_ADDON_HOST,
    user: process.env.MYSQL_ADDON_USER,
    password: process.env.MYSQL_ADDON_PASSWORD,
    database: process.env.MYSQL_ADDON_DB,
    port: process.env.MYSQL_ADDON_PORT,
    connectionLimit: 15
});

<<<<<<< HEAD
=======


>>>>>>> origin/develop
// Configure express-session to use MySQLStore
const sessionStore = new MySQLStore({
    createDatabaseTable:true
}, pool);

// Configure express-session middleware
const sessionMiddleware = expressSession({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore
});

module.exports = {pool, sessionMiddleware};