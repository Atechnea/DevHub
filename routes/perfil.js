const express = require('express');
const pool = require('../db/db');
const router = express.Router();

// Ruta para mostrar el perfil del usuario

router.get('/:id', function(req, res) {
    const userId = req.params.id;

    // Consultar la base de datos para obtener los datos del perfil del usuario con el ID proporcionado
    pool.getConnection(async function(err, con) {
        if (err) {
            // Manejar el error de conexión a la base de datos
            return res.status(500).json({ error: "Error al conectar a la base de datos" });
        }

        // Consultar la base de datos para obtener los datos del perfil del usuario con el ID proporcionado
        const sql = "SELECT username, email, role FROM users WHERE id = ?";
        con.query(sql, [userId], function(err, result) {
            con.release(); // Liberar la conexión a la base de datos

            if (err) {
                // Manejar el error de consulta a la base de datos
                return res.status(500).json({ error: "Error al consultar la base de datos" });
            }

            if (result.length === 0) {
                // El usuario con el ID proporcionado no existe
                return res.status(404).json({ error: "Usuario no encontrado" });
            }

            // Devolver los datos del perfil del usuario encontrado
            const userProfile = {
                username: result[0].username,
                email: result[0].email,
                role: result[0].role
            };
            
            // Renderizar la plantilla de perfil con los datos del perfil del usuario
            res.render('perfil', { title: 'Perfil de Usuario', userProfile: userProfile });
        });
    });
});

module.exports = router;