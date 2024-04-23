$(document).ready(function(){
    // Manejo del clic en el botón de aceptar
    $("#accept-button").click(function(event)  {
        event.preventDefault();
        var invitationId = $(this).data('invitation-id');
        
        // Envío del formulario por AJAX
        $.ajax({
            type: 'post',
            url: '/home/acceptInvitation',
            data: { invitationId: invitationId },
            success: function(result) {
                // Si la solicitud es exitosa, mostrar un mensaje de éxito
                showToastr('success', 'Se ha aceptado la invitación con éxito', '');
                tiempo_recarga();
            },
            error: function(xhr, status, error) {
                // Si hay un error, mostrar un mensaje de error
                showToastr('error', 'Ha ocurrido un error al aceptar la invitación', xhr.responseJSON.error);
                tiempo_recarga();
            }
        });
    });


});
     
    $("#reject-button").click(function(event)  {
        event.preventDefault();
        var invitationId = $(this).data('invitation-id');
        // Envío del formulario por AJAX
        
        $.ajax({
            type: 'post',
            url: '/home/rejectInvitation',
            data: { invitationId: invitationId },
            success: function(result) {
                // Si la solicitud es exitosa, mostrar un mensaje de éxito
                showToastr('success', 'Se ha rechazado la invitación con éxito', '');
                tiempo_recarga();
            },
            error: function(xhr, status, error) {
                // Si hay un error, mostrar un mensaje de error
                showToastr('error', 'Ha ocurrido un error al rechazar la invitación', xhr.responseJSON.error);
                tiempo_recarga();
            }
        });


        setTimeout(function() {
            // Este código se ejecutará después de 1 segundo
            location.reload(true);
          }, 2000); // 1000 milisegundos = 1 segundo
});


function tiempo_recarga()
{
    setTimeout(function() {
        // Este código se ejecutará después de 1 segundo
        location.reload(true);
      }, 2000); // 1000 milisegundos = 1 segundo
}