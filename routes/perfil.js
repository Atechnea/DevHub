var express = require('express');
var router = express.Router();
var pool = require('../db/db').pool;
const mysql = require('mysql2');

// Ruta para mostrar el perfil del usuario
router.get('/:id', function(req, res) {
    const userId = req.params.id;

    // Consultar la base de datos para obtener los datos del perfil del usuario con el ID proporcionado
    pool.getConnection(function(err, con) {
        if(err) res.status(500).json({ error: "No se pudo conectar a la base de datos" });
        else {
            // Consultar la base de datos para obtener los datos del perfil del usuario con el ID proporcionado
            var sql = "SELECT usuario, nombre, apellido, email, es_empresa FROM usuarios WHERE id = ?";
            con.query(sql, [userId], function(err, result) {
                if (err) {
                    con.release(); // Liberar la conexión a la base de datos
                    // Manejar el error de consulta a la base de datos
                    return res.status(500).json({ error: "Error al consultar la base de datos" });
                }

                if (result.length === 0) {
                    con.release(); // Liberar la conexión a la base de datos
                    // El usuario con el ID proporcionado no existe
                    return res.status(404).json({ error: "Usuario no encontrado" });
                }

                // Devolver los datos del perfil del usuario encontrado
                const userProfile = {
                    usuario: result[0].usuario,
                    nombre: result[0].nombre,
                    apellido: result[0].apellido,
                    email: result[0].email,
                    es_empresa: result[0].es_empresa
                };

                // Consultar la base de datos para obtener los resultados de Belbin del usuario
                var belbinSql = "SELECT res1, res2, res3 FROM belbin WHERE id_usuario = ?";
                con.query(belbinSql, [userId], function(err, belbinResult) {
                    con.release(); // Liberar la conexión a la base de datos

                    if (err) {
                        // Manejar el error de consulta a la base de datos
                        return res.status(500).json({ error: "Error al consultar la base de datos" });
                    }

                    if (belbinResult.length > 0) {
                        // Si hay resultados de Belbin para el usuario, agregarlos al objeto userProfile
                        userProfile.res1 = belbinResult[0].res1;
                        userProfile.res2 = belbinResult[0].res2;
                        userProfile.res3 = belbinResult[0].res3;
                    }

                    // Renderizar la plantilla de perfil con los datos del perfil del usuario
                    res.render('perfil', { title: 'Perfil de Usuario', userProfile: userProfile });
                });
            });
        }
    });
});

module.exports = router;
