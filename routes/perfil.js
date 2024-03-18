const express = require('express');
const router = express.Router();

// Ruta para mostrar el perfil del usuario
// Ruta para mostrar el perfil del usuario
router.get('/:id', function(req, res) {
    const userId = req.params.id;

    // Supongamos que tienes los datos del perfil del usuario en una variable userProfile
    const userProfileData = {
        username: 'usuarioEjemplo',
        email: 'usuario@example.com',
        role: 'Desarrollador'
    };

    // Renderizar la plantilla de perfil con los datos del perfil del usuario
    res.render('perfil', { title: 'Perfil de Usuario', userProfile: userProfileData });
});


module.exports = router;
