document.querySelector('.datosperfil').addEventListener('click', function(event) {
    
    
    // Obtener el menú desplegable
    var menu = document.querySelector('.menu-desplegable');
    
    // Alternar la visualización
    if (menu.style.display === 'block') {
        menu.style.display = 'none';
    } else {
        menu.style.display = 'block';
    }
});
