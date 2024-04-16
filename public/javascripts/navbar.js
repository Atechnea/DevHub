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

$(document).ready(function() {
    // Función para actualizar el número de notificaciones

    console.log('aka');
    function actualizarNotificaciones() {
        $.ajax({
            url: "/home", // Ajusta esta URL a tu backend
            method: "GET",
            success: function(data) {
                // Suponemos que el servidor retorna un objeto JSON con el número de notificaciones
                $('#num_notificaciones').text(data.num_notificaciones);
            },
            error: function() {
                console.log("Error al obtener las notificaciones.");
            }
        });
    }

    // Establecer intervalo para actualizar las notificaciones cada 10 segundos
    setInterval(actualizarNotificaciones, 10000); // 10000 milisegundos = 10 segundos

    // También podrías llamar a actualizarNotificaciones() al cargar la página
    actualizarNotificaciones();
});


