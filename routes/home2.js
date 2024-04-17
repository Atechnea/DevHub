const express = require('express');
const router = express.Router();

var pool = require('../db/db').pool;
const mysql = require('mysql2');

router.get('/', function(req, res) {
    if (res.locals.usuario != null) {

        const idUsuario = res.locals.usuario.id;

        pool.getConnection(function(err, con) {
            if (err) {
                console.error('Error al obtener una conexión de la pool:', err);
                res.status(500).send('Error interno del servidor');
                return;
            }

            const sql = `
                SELECT i.*, CONCAT(u.nombre, ' ', u.apellido) AS senderName, u2.nombre AS recipient, e.nombre AS teamName
                FROM invitaciones i
                INNER JOIN usuarios u ON i.id_empresa = u.id
                INNER JOIN usuarios u2 ON i.id_desarrollador = u2.id
                INNER JOIN equipo e ON i.id_equipo = e.id
                WHERE i.id_desarrollador = ? and i.contestada = 0;`;

            con.query(sql, [idUsuario], function(err, results) {
                con.release();
                if (err) {
                    console.error('Error al ejecutar la consulta SQL:', err);
                    res.status(500).send('Error interno del servidor');
                    return;
                }

                // Procesar los resultados de la consulta y crear el arreglo de invitaciones
                const invitations = results.map(invitation => {
                    return {
                        senderName: invitation.senderName,
                        recipient: invitation.recipient,
                        teamName: invitation.teamName,
                        invitationId: invitation.id,
                        idSender: invitation.id_empresa,
                        idRecipient: invitation.id_desarrollador,
                        idTeam: invitation.id_equipo
                    };
                }); 

                // Renderizar la plantilla con las invitaciones
                res.render('homeinv', { invitations: invitations });
            });
        });
    } else {
        res.redirect('login');
    }
});


router.post('/acceptInvitation', function(req, res) {
    const invitationId = req.body.invitationId;

    // Primero, actualiza el estado de la invitación a contestada
    pool.getConnection(function(err, con) {
        if (err) {
            console.error('Error al obtener una conexión de la pool:', err);
            res.status(500).send('Error interno del servidor');
            return;
        }

        const updateInvitationQuery = `
            UPDATE invitaciones 
            SET contestada = 1 
            WHERE id = ?;
        `;

        con.query(updateInvitationQuery, [invitationId], function(err, results) {
            if (err) {
                console.error('Error al actualizar la invitación:', err);
                res.status(500).send('Error interno del servidor');
                return;
            }

            // Después, obtenemos la información del equipo al que se hizo la invitación
            const getTeamQuery = `
                SELECT id_equipo, id_desarrollador
                FROM invitaciones 
                WHERE id = ?;
            `;

            con.query(getTeamQuery, [invitationId], function(err, teamInfo) {
                if (err) {
                    console.error('Error al obtener la información del equipo:', err);
                    res.status(500).send('Error interno del servidor');
                    return;
                }

                const idEquipo = teamInfo[0].id_equipo;
                const idDesarrollador = teamInfo[0].id_desarrollador;

                // Finalmente, insertamos al desarrollador en el equipo
                const insertDeveloperQuery = `
                    INSERT INTO equipo_desarrollador (id_equipo, id_desarrollador)
                    VALUES (?, ?);
                `;

                con.query(insertDeveloperQuery, [idEquipo, idDesarrollador], function(err, results) {
                    con.release();
                    if (err) {
                        console.error('Error al agregar el desarrollador al equipo:', err);
                        res.status(500).send('Error interno del servidor');
                        return;
                    }

                    // Todo está bien, responder con éxito
                    res.sendStatus(200);
                });
            });
        });
    });
});



router.post("/busqueda", function(request, response) {
    response.status(200);
    let nombre = request.body.busqueda;
    let usuario = request.session.usuario;
    const dao = request.dao;
    if (usuario.es_empresa == 1) {
        pool.getConnection(async function(err, con) {
            if (err) res.status(500).json({ error: buscar_error });
            else {
                const sql = `SELECT id, nombre, apellido, usuario 
                FROM usuarios 
                WHERE nombre LIKE ? AND es_empresa = false 
                ORDER BY nombre DESC;`;
                const query = `%${nombre}%`; // Ajusta la consulta para que funcione con 'LIKE'
                con.query(sql, [query], function(err, desarrolladores) {
                    con.release();
                    if (err) {
                        callback(err, null);
                    } else {
                        response.render('busqueda', { desarrolladores: desarrolladores });
                    }
                });
            }
        })
    } else {
        pool.getConnection(async function(err, con) {
            if (err) res.status(500).json({ error: buscar_error });
            else {
                const sql = `SELECT id, nombre, apellido, usuario 
                FROM usuarios 
                WHERE nombre LIKE ? AND es_empresa = true 
                ORDER BY nombre DESC;`;
                const query = `%${nombre}%`; // Ajusta la consulta para que funcione con 'LIKE'
                con.query(sql, [query], function(err, empresas) {
                    con.release();
                    if (err) {
                        callback(err, null);
                    } else {
                        response.render('busquedaEmp', { empresas: empresas });
                    }
                });
            }
        })

    }

});


module.exports = router;
