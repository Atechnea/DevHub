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


router.post('/', function(req, res) {
    //Recoger todos los fields del request body
    var { nombre, objetivo} = req.body;
    //Validar datos
    if (nombre.length > 30)
        res.status(422).json({ error: "El nombre debe tener menos de 30 caracteres" });
    else if (objetivo.length > 120)
        res.status(422).json({ error: "El objetivo debe tener menos de 120 caracteres" });

});

module.exports = router;