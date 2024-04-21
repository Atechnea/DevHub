$(document).ready(function(){
    // Manejo del clic en el botón de aceptar
    $("#accept-button").click(function(event)  {
        event.preventDefault();
        var invitationId = $(this).data('invitation-id');
        
        // Envío del formulario por AJAX
        $.ajax({
            type: 'post',
            url: '/home/rejectInvitation',
            data: { invitationId: invitationId },
            success: function(result) {
                // Si la solicitud es exitosa, mostrar un mensaje de éxito
                showToastr('success', 'Se ha aceptado la invitación con éxito', '');
            },
            error: function(xhr, status, error) {
                // Si hay un error, mostrar un mensaje de error
                showToastr('error', 'Ha ocurrido un error al aceptar la invitación', xhr.responseJSON.error);
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
            },
            error: function(xhr, status, error) {
                // Si hay un error, mostrar un mensaje de error
                showToastr('error', 'Ha ocurrido un error al rechazar la invitación', xhr.responseJSON.error);
            }
        });

});

// Funciones para aceptar y rechazar invitaciones
function acceptInvitation(invitationId) {
    fetch('home/acceptInvitation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ invitationId: invitationId })
    })
}

function rejectInvitation(invitationId) {
    fetch('home/rejectInvitation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ invitationId: invitationId })
    })
}
