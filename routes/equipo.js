var express = require('express');
var router = express.Router();
var pool = require('../db/db').pool;
const mysql = require('mysql2');

// Ruta para mostrar la información del equipo
router.get('/:id', function(req, res) {
    const teamId = req.params.id;

    // Consultar la base de datos para obtener los datos del equipo con el ID proporcionado
    pool.getConnection(function(err, con) {
        if (err) {
            res.status(500).json({ error: "No se pudo conectar a la base de datos" });
        } else {
            var sql = "SELECT nombre, dueno, objetivo FROM equipo WHERE id = ?";
            con.query(sql, [teamId], function(err, result) {
                if (err) {
                    con.release();
                    res.status(500).json({ error: "Error al consultar la base de datos" });
                } else {
                    if (result.length === 0) {
                        con.release();
                        res.status(404).json({ error: "Equipo no encontrado" });
                    } else {
                        const teamData = {
                            name: result[0].nombre,
                            owner: result[0].dueno,
                            objective: result[0].objetivo,
                            members: [] // Inicializamos la lista de miembros
                        };

                        // Consultar la base de datos para obtener los miembros del equipo
                        var sqlMembers = "SELECT id_desarrollador FROM pertenece_equipo WHERE id_equipo = ?";
                        con.query(sqlMembers, [teamId], function(err, resultMembers) {
                            if (err) {
                                con.release();
                                res.status(500).json({ error: "Error al consultar la base de datos" });
                            } else {
                                const memberIds = resultMembers.map(member => member.id_desarrollador);
                                
                                // Consultar la base de datos para obtener los nombres de los miembros
                                var sqlUserNames = "SELECT id, CONCAT(nombre, ' ', apellido) AS nombre_completo FROM usuarios WHERE id IN (?)";
                                con.query(sqlUserNames, [memberIds], function(err, resultUserNames) {
                                    con.release(); // Liberar la conexión a la base de datos

                                    if (err) {
                                        res.status(500).json({ error: "Error al consultar la base de datos" });
                                    } else {
                                        // Agregar los miembros al objeto teamData
                                        resultUserNames.forEach(function(member) {
                                            teamData.members.push({ id: member.id, name: member.nombre_completo });
                                        });

                                        // Renderizar la plantilla con los datos del equipo
                                        res.render('equipo', { title: 'Información del Equipo', teamInfo: teamData });
                                    }
                                });
                            }
                        });
                    }
                }
            });
        }
    });
});

module.exports = router;
