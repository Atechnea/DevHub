var express = require('express');
var router = express.Router();
const console = require('console')
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
                        const ownerId = result[0].dueno; // Obtener el ID del dueño del equipo
                        const teamData = {
                            name: result[0].nombre,
                            owner: '', // Inicializar el propietario del equipo
                            owner_id: ownerId,
                            objective: result[0].objetivo,
                            members: [] // Inicializamos la lista de miembros
                        };

                        // Consultar la base de datos para obtener el nombre del dueño del equipo
                        var sqlOwner = "SELECT CONCAT(nombre, ' ', apellido) AS nombre_completo FROM usuarios WHERE id = ?";
                        con.query(sqlOwner, [ownerId], function(err, resultOwner) {
                            if (err) {
                                con.release();
                                res.status(500).json({ error: "Error al consultar la base de datos" });
                            } else {
                                teamData.owner = resultOwner[0].nombre_completo; // Establecer el nombre del dueño

                                // Consultar la base de datos para obtener los miembros del equipo
                                var sqlMembers = "SELECT id_desarrollador FROM pertenece_equipo WHERE id_equipo = ?";
                                con.query(sqlMembers, [teamId], function(err, resultMembers) {
                                    if (err) {
                                        con.release();
                                        res.status(500).json({ error: "Error al consultar la base de datos" });
                                    } else {
                                        if (resultMembers.length === 0) {
                                            con.release();
                                            // Renderizar la plantilla con los datos del equipo sin miembros
                                            res.render('equipo', { title: 'Información del Equipo', teamInfo: teamData });
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

// Ruta para manejar la búsqueda de desarrolladores en un equipo específico
router.post('/:id', function(req, res) {
    const busqueda = req.body.busqueda;
    const equipoId = req.params.id; // Obtener el equipoId de los parámetros de la URL

    const sql = `
        SELECT id, nombre, apellido FROM usuarios 
        WHERE (nombre LIKE ? OR apellido LIKE ?) AND es_empresa = 0 AND id NOT IN (
            SELECT id_desarrollador FROM pertenece_equipo WHERE id_equipo = ?
        )
    `;

    pool.getConnection(function(err, connection) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error de conexión a la base de datos" });
        }

        connection.query(sql, [`%${busqueda.split(" ")[0] || busqueda.split(" ")[1] || ""}%`, `%${busqueda.split(" ")[0] || busqueda.split(" ")[1] || ""}%`, equipoId], function(err, resultados) {
            connection.release();
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Error al consultar la base de datos", details: err });
            }
            res.json(resultados); // Enviar resultados como JSON
        });
    });
});

router.post('/:id/deleteMember', function(req, res) {
    const equipoId = req.body.equipoId;
    const usuarioId = req.body.usuarioId;
    console.log(equipoId);
    console.log(usuarioId);
    const sql = `DELETE FROM pertenece_equipo WHERE id_equipo = ? AND id_desarrollador = ?;`;

    pool.getConnection(function(err, connection) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error de conexión a la base de datos" });
        }

       

        connection.query(sql, [`${equipoId}`, `${usuarioId}`], function(err, resultados) {
            connection.release();
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Error al consultar la base de datos", details: err });
            }
            console.log(resultados)
            res.json(resultados);
        });
    });
});

module.exports = router;