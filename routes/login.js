var express = require('express');
var router = express.Router();
var pool = require('../db/db');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const user_regex = /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
const name_regex = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/;
const email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const pw_regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

const email_error = "El correo no tiene un formato válido, por favor, introduzca un correo válido.";
const pw_error = "La contraseña debe estar formada por al menos 8 caracteres, con una letra y un numero.";
const db_error = "No se pudo conectar a la base de datos, por favor, inténtelo de nuevo más tarde.";


router.get('/', function(req, res) {
    res.render('login');
});

router.post('/login', function(req, res) {
    //Recoger todos los fields del request body
    var { email, contrasena} = req.body;
    //Validar datos
   if (!email_regex.test(email))
        res.status(422).json({ error: email_error });
    else if (!pw_regex.test(contrasena))
        res.status(422).json({ error: pw_error });
    else {
        //Anaidir a base de datos
        pool.getConnection(async function(err, con) {
            if(err) res.status(500).json({ error: db_error });
            else {
                try {
                    //Crear hash password
                    var hashedpw = await bcrypt.hash(contrasena, 10);
                    var sql = "INSERT INTO usuarios (usuario, nombre, apellido, email, contrasena, es_empresa) VALUES (?, ?, ?, ?, ?, ?)";
                    con.query(sql, [usuario, nombre, apellido, email, hashedpw, empresa], function(err, result) {
                        con.release();
                        if(err)
                            res.status(422).json({ error: exists_error });
                        else
                            res.send("");
                    })
                } catch(error) {
                    res.send("Error al cifrar");
                }
            }
        })
    }
});

module.exports = router;