var express = require('express');
var router = express.Router();
var pool = require('../db/db').pool;
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const user_regex = /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
const name_regex = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/;
const email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const pw_regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

const user_error = "Usuario no tiene un formato válido, debe estar formado solo de letras, numeros, _ y . , los caracteres especiales no pueden estar ni al principio ni al final y debe tener entre 8 y 20 caracteres.";
const email_error = "El correo no tiene un formato válido, por favor, introduzca un correo válido.";
const name_error = "Nombre o Apellido no tiene un formato válido, debe estar formado solo de letras.";
const pw_error = "La contraseña debe estar formada por al menos 8 caracteres, con una letra y un numero.";
const db_error = "No se pudo conectar a la base de datos, por favor, inténtelo de nuevo más tarde.";
const exists_error = "Este usuario o correo ya existe.";


router.get('/', function(req, res) {
    res.render('register');
});

router.post('/registrar', function(req, res) {
    //Recoger todos los fields del request body
    var { usuario, nombre, apellido, email, contrasena, empresa } = req.body;
    //Parsear es_empresa
    empresa = !!empresa;
    //Validar datos
    if(!user_regex.test(usuario)) 
        res.status(422).json({ error: user_error });
    else if (!name_regex.test(nombre) || !name_regex.test(apellido))
        res.status(422).json({ error: name_error });
    else if (!email_regex.test(email))
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