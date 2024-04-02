document.getElementById('buscador').addEventListener('click', function() {
    var buscador = document.querySelector('.buscador');
    var logo = document.querySelector('.logo');
    var logoimg = document.querySelector('.logo img');
    var perfil = document.querySelector('.perfil');
    if (window.innerWidth <= 560) { // Cambia el valor según el ancho de tu diseño móvil
        buscador.style.display = 'flex'; // Mostrar el buscador al hacer clic en el botón
        buscador.style.marginRight = '10px'; // Establecer el margen izquierdo
        buscador.style.width = '70%'; // Establecer el ancho al 100%

        logo.style.width = '30%';
        logoimg.style.marginLeft = '20px';

        perfil.style.width = '0%';
        perfil.style.display = 'none';


    }
});