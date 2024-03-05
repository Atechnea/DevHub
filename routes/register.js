var express = require('express');
var router = express.Router();
var pool = require('../db/db');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

router.get('/', function(req, res) {
    res.render('register');
});

router.post('/registrar', function(req, res) {
    const { nombre, apellido, email, contrasena } = req.body;
    pool.getconnection(function(err, con) {
        if(err) next(createError(err));
        else {
            try {
                var hashedpw = bcrypt.hash(contrasena, 10);
                var sql = "INSERT INTO usuarios (nombre, apellido, email, contrasena) VALUES (?, ?, ?, ?)";
                con.query(sql, [nombre, apellido, email, hashedpw], function(err, result) {
                    con.release();
                    if(err) 
                        res.send("El email ya esta registrado");
                    else
                        res.send("");
                })
            } catch(error) {
                res.send("Error al cifrar");
            }
        }
    })
});

module.exports = router;