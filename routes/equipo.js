var express = require('express');
var router = express.Router();
var pool = require('../db/db').pool;
const mysql = require('mysql2');

// Ruta para mostrar la información del equipo
router.get('/:id', function(req, res) {
    const teamId = req.params.id;

    // Consultar la base de datos para obtener los datos del equipo con el ID proporcionado
    res.render('equipo', { title: 'Información del Equipo', });
});

module.exports = router;
