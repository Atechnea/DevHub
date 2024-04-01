var express = require('express');
var router = express.Router();
var pool = require('../db/db').pool;
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

const email_error = "El correo no tiene un formato válido, por favor, introduzca un correo válido.";
const pw_error = "Por favor, escriba la contrasena";
const db_error = "No se pudo conectar a la base de datos, por favor, inténtelo de nuevo más tarde.";
const no_exists_error = "Este correo no existe en nuestra base de datos.";
const wrong_pw_error = "La contrasena no es correcta."


router.get('/', function(req, res) {
    res.render('login');
});

router.post('/login', function(req, res) {
    //Recoger todos los fields del request body
    var { email, contrasena} = req.body;
    //Validar datos
    if (!email_regex.test(email))
        res.status(422).json({ error: email_error });
    else if (contrasena=='')
        res.status(422).json({ error: pw_error });
    else {
        //Anaidir a base de datos
        pool.getConnection(async function(err, con) {
            if(err) res.status(500).json({ error: db_error });
            else {
                var sql = "SELECT * FROM usuarios WHERE email = ?";
                con.query(sql, [email], async function(err, result) { //Comprobar si el usuario existe
                    con.release();
                    if(err) res.status(500).json({ error: db_error });
                    else if (result.length == 0) { //Usuario no existe
                        res.status(422).json({ error: no_exists_error });
                    } else {
                        //Comparar contrasena
                        const match = await bcrypt.compare(contrasena, result[0].contrasena);
                        if (match) { //Contrasena correcta
                            req.session.usuario=result[0];
                            req.session.auth = true;
                            res.send("");
                        } else { //Contrasena incorrecta
                            res.status(401).json({ error: wrong_pw_error });
                        }
                    }
                })
            }
        })
    }
});

router.get('/userid', function(req, res) {
    res.send(req.session.usuario.id);
})

module.exports = router;