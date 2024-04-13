const express = require('express');
const router = express.Router();
const pool = require('../db/db').pool; 
const bcrypt = require('bcrypt');

router.post('/:equipoId', function(req, res) {
    const busqueda = req.body.busqueda;
    const equipoId = req.params.equipoId; // Obtener el equipoId de los parámetros de la URL

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

        connection.query(sql, [`%${busqueda}%`, `%${busqueda}%`, equipoId], function(err, resultados) {
            connection.release();
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Error al consultar la base de datos" });
            }
            res.json(resultados); // Enviar resultados como JSON
        });
    });
});

module.exports = router;
