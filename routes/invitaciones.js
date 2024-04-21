const express = require('express');
const console = require('console')
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



module.exports = router;
