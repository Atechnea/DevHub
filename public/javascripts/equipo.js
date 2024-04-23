document.getElementById('deletemember').addEventListener('click', function() {
    // Realizar la solicitud AJAX al servidor

    var usuarioId = this.getAttribute('data-usuario-id');
    var equipoId = ObtenerElIdDelEquipo();

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