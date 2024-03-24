document.querySelector('.datosperfil').addEventListener('click', function(event) {
    
    
    // Obtener el menú desplegable
    var menu = document.querySelector('dropdown-menu');
    
    // Alternar la visualización
    if (menu.style.display === 'block') {
        menu.style.display = 'none';
    } else {
        menu.style.display = 'block';
    }
});
