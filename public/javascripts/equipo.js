var deleteButtons = document.getElementsByClassName('deletemember');

// Iterar sobre cada botón de eliminación
Array.from(deleteButtons).forEach(function(button) {
    // Agregar un event listener para el clic en cada botón
    button.addEventListener('click', function(event) {
        // Obtener el ID del usuario asociado al botón
        var usuarioId = button.getAttribute('id');
        // Obtener el ID del equipo
        var equipoId = ObtenerElIdDelEquipo();

        console.log(usuarioId);

        // Realizar la solicitud AJAX al servidor
        $.ajax({
            type: 'POST',
            url: '/equipo/' + equipoId + '/deleteMember',
            data: { equipoId: equipoId, usuarioId: usuarioId},
            success: function(data) {
                showToastr('success', 'Usuario eliminado correctamente', '');
                tiempo_recarga()
            },
            error: function(xhr, status, error) {
                showToastr('error', 'Ha ocurrido un error', xhr.responseJSON.error);
                tiempo_recarga()
            }
        });
    });
});


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

function tiempo_recarga()
{
    setTimeout(function() {
        // Este código se ejecutará después de 1 segundo
        location.reload(true);
      }, 2000); // 1000 milisegundos = 1 segundo
}