const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
    if (res.locals.usuario != null) {
        const invitations = [
            {
                senderName: "Empresa ABC",
                recipient: "Juan Pérez",
                teamName: "Equipo 1",
                invitationId: "123",
            },
            {
                senderName: "Empresa XYZ",
                recipient: "Ana García",
                teamName: "Equipo 2",
                invitationId: "456",
            },
            {
                senderName: "Empresa 123",
                recipient: "2",
                teamName: "Equipo 3",
                invitationId: "789",
            },
            
            {
                senderName: "Empresa AAAA",
                recipient: "2",
                teamName: "Equipo 3",
                invitationId: "729",
            }
        ];

        res.render('homeinv', { invitations: invitations });
    } else {
        res.redirect('login');
    }
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
