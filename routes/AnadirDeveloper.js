var express = require('express');
var router = express.Router();
var pool = require('../db/db').pool;
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

router.post('/', function(req, res) {
    const busqueda = req.body.busqueda;

    // Realizar consulta para obtener desarrolladores que no estén en el equipo
    const sql = `
        SELECT id, nombre, apellido FROM desarrolladores 
        WHERE (nombre LIKE ? OR apellido LIKE ?) AND id NOT IN (
            SELECT id_desarrollador FROM pertenece_equipo WHERE id_equipo = ?
        )
    `;

    pool.getConnection(function(err, connection) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error de conexión a la base de datos" });
        }

        connection.query(sql, [`%${busqueda}%`, `%${busqueda}%`, equipoId], function(err, results) {
            connection.release();
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Error al consultar la base de datos" });
            }
            return res.status(200).json(results);
        });
    });
});


module.exports = router;


