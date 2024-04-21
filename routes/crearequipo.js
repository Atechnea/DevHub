var express = require('express');
var router = express.Router();
var pool = require('../db/db').pool;
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

router.post('/', function(req, res) {
    //Recoger todos los fields del request body
    var {nombre, objetivo} = req.body;
    var idEmpresa=req.session.usuario.id;//id de usuario unico para cada empresa
  // Validación de los datos

 
    // Verificar si el nombre del equipo ya está en uso por la misma empresa
    pool.getConnection(function(err, connection) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "No se pudo conectar a la base de datos, por favor, inténtelo de nuevo más tarde." });
        }
        
        const sqlNombreEnUso = "SELECT COUNT(*) AS count FROM equipo WHERE nombre = ? AND dueno = ?";
        connection.query(sqlNombreEnUso, [nombre, idEmpresa], function(err, results) {
            if (err) {
                console.error(err);
                connection.release();
                return res.status(500).json({ error: "Error al consultar la base de datos" });
            }

            if (results[0].count > 0) {
                connection.release();
                return res.status(422).json({ error: "El nombre ya está en uso por otro equipo de esta empresa" });
            } else {
                // Insertar el nuevo equipo
                const sqlInsertarEquipo = "INSERT INTO equipo (nombre, objetivo, dueno) VALUES (?, ?, ?)";
                connection.query(sqlInsertarEquipo, [nombre, objetivo, idEmpresa], function(err, results) {
                    connection.release();
                    
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ error: "Error al insertar el equipo en la base de datos" });
                    }

                    return res.status(200).json({ message: "Equipo creado exitosamente" });
                });
            }
        });
    });
    
});

module.exports = router;

