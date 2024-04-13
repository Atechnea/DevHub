$(document).ready(function() {
    // Función para obtener el ID del equipo
    function ObtenerElIdDelEquipo() {
        // Obtener la URL actual
        var url = window.location.href;
        // Buscar el patrón "/equipo/" seguido de números en la URL
        var match = url.match(/\/equipo\/(\d+)/);
        // Si se encuentra un partido, devolver el ID del equipo
        if (match) {
            return match[1];
        } else {
            // Si no se encuentra ningún partido, devolver un valor por defecto o manejar el error según sea necesario
            return null;
        }
    }

    // Manejar el evento de cambio en el campo de búsqueda
    $("#staticBackdrop2").on('input', '.busqueda_developer input[name="busqueda"]', function() {
        // Obtener el valor de búsqueda
        var busqueda = $(this).val();
        console.log("Búsqueda:", busqueda);

        // Obtener el ID del equipo
        var equipoId = ObtenerElIdDelEquipo();

        // Realizar la solicitud AJAX al servidor
        $.ajax({
            type: 'POST',
            url: '/equipo/' + equipoId,
            data: { busqueda: busqueda },
            success: function(data) {
                // Generar el HTML para los resultados
                var resultadosHTML = '';
                data.forEach(function(resultado) {
                    resultadosHTML += '<div class="resultado" data-usuario-id="' + resultado.id + '">';
                    resultadosHTML += '<div class="nombre">' + resultado.nombre + ' ' + resultado.apellido + '</div>';
                    resultadosHTML += '</div>';
                    resultadosHTML += '<hr>'; // Agregar línea horizontal
                });

                // Insertar los resultados en el contenedor
                $(".mostrar_resultados").html(resultadosHTML);

                // Manejar el clic en los resultados para dirigirse a /perfil/ddelusuaroselecconado
                $(".resultado").click(function() {
                    var usuarioId = $(this).data("usuario-id");
                    window.location.href = '/perfil/' + usuarioId;
                });
            },
            error: function(xhr, status, error) {
                // Manejar errores si la solicitud falla
                console.error(xhr.responseText); // Imprimir la respuesta del servidor en la consola
                
                alert('Error al buscar desarrolladores');
            }
        });
    });
});
