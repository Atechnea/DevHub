var express = require('express');
var router = express.Router();
var pool = require('../db/db').pool;
const mysql = require('mysql2');

// Ruta para mostrar la información del equipo
router.get('/:id', function(req, res) {
    const teamId = req.params.id;

    // Consultar la base de datos para obtener los datos del equipo con el ID proporcionado
    pool.getConnection(function(err, con) {
        if(err) res.status(500).json({ error: "No se pudo conectar a la base de datos" });
        else {
            // Consultar la base de datos para obtener los datos del equipo con el ID proporcionado
            var sql = "SELECT nombre, objetivo FROM equipos WHERE id = ?";
            con.query(sql, [teamId], function(err, result) {
                con.release(); // Liberar la conexión a la base de datos
                
                if (err) {
                    // Manejar el error de consulta a la base de datos
                    return res.status(500).json({ error: "Error al consultar la base de datos" });
                }

                if (result.length === 0) {
                    // El equipo con el ID proporcionado no existe
                    return res.status(404).json({ error: "Equipo no encontrado" });
                }

                // Devolver los datos del equipo encontrado
                const teamInfo = {
                    name: result[0].nombre,
                    objective: result[0].objetivo
                };

                // Consultar la base de datos para obtener los miembros del equipo
                sql = "SELECT nombre_completo, antiguedad FROM miembros_equipo WHERE equipo_id = ? ORDER BY antiguedad ASC";
                con.query(sql, [teamId], function(err, result) {
                    if (err) {
                        // Manejar el error de consulta a la base de datos
                        return res.status(500).json({ error: "Error al consultar la base de datos" });
                    }

                    // Si hay miembros en el equipo, agregarlos a teamInfo
                    if (result.length > 0) {
                        teamInfo.members = result.map(member => {
                            return {
                                name: member.nombre_completo,
                                joinDate: member.antiguedad
                            };
                        });
                    } else {
                        // Si no hay miembros en el equipo, agregar un mensaje indicando esto
                        teamInfo.members = [];
                    }

                    // Renderizar la plantilla de información del equipo con los datos obtenidos
                    res.render('equipo', { title: 'Información del Equipo', teamInfo: teamInfo });
                });
            });
        }
    });
});

module.exports = router;
