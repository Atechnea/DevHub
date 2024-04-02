//Despliegue del boton logout
var menu = document.querySelector('.dropdown-menu');
var datosPerfil = document.querySelector('.datosperfil');
// Variable para rastrear el estado del menú
var menuIsVisible = false;

datosPerfil.addEventListener('click', function(event) {
    // Alternar la visibilidad basado en la variable de estado
    menuIsVisible = !menuIsVisible;
    menu.style.display = menuIsVisible ? 'block' : 'none';
    event.stopPropagation(); // Previene que el evento de clic se propague al documento
});

menu.addEventListener('mouseleave', function(event) {
    // Ocultar el menú y actualizar la variable de estado
    menu.style.display = 'none';
    menuIsVisible = false;
});

document.addEventListener('click', function(event) {
    // Comprobar si el clic fue fuera del menú y de .datosperfil
    var target = event.target;
    if (!menu.contains(target) && !datosPerfil.contains(target) && menuIsVisible) {
        menu.style.display = 'none';
        menuIsVisible = false;
    }
});

//Recarga de la pagina al pulsar en el logo
document.getElementById("logo-img").addEventListener("click", function() {
    window.location.href = "/home";
});

document.getElementById("logo-h1").addEventListener("click", function() {
    window.location.href = "/home";
});