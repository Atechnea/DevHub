//Despliegue del boton logout
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

//Recarga de la pagina al pulsar en el logo
document.getElementById("logo-img").addEventListener("click", function() {
    window.location.href = "/home";
});

document.getElementById("logo-h1").addEventListener("click", function() {
    window.location.href = "/home";
});