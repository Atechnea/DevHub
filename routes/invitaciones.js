const express = require('express');
const router = express.Router();
const pool = require('../db/db').pool; 
const bcrypt = require('bcrypt');

router.post('/envio_invitacion', function(req,res) {
    const empId = req.body.empId;
    const equipoId = req.body.equipoId;
    const desId = req.body.desId;
    const sql = "INSERT INTO invitaciones(id_empresa, id_equipo, id_desarrollador) VALUES (?, ? ,?)";
    const sql2 = "SELECT * FROM invitaciones WHERE id_empresa = ? AND id_equipo = ? AND id_desarrollador = ? AND contestada = 0";
    pool.getConnection(function(err, con) {
        if (err) {
            return res.status(500).json({ error: "Error de conexión a la base de datos" });
        }
        con.query(sql2, [empId, equipoId, desId], function(err, result) {
            if (err) {
                return res.status(500).json({ error: "Error de conexión a la base de datos" });
            }
            if (result.length == 0) {
                con.query(sql, [empId, equipoId, desId], function(err, results) {
                    con.release();
                    if(err) {
                        return res.status(500).json({ error: "Error al insertar en la base de datos" });
                    }
                    res.send("ok");
                })
            } else {
                return res.status(422).json({ error: "Ya has enviado una invitación a esta persona"})
            }
        })
        
    })
});

router.post('/:equipoId', function(req, res) {
    const busqueda = req.body.busqueda;
    const equipoId = req.params.equipoId; // Obtener el equipoId de los parámetros de la URL

    const sql = `
        SELECT id, nombre, apellido FROM usuarios 
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
