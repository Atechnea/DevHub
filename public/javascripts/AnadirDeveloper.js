$(document).ready(function(){
    $("#staticBackdrop2").on('submit', '.formequipo', function(event) {
        event.preventDefault();

        var formData = $(this).serialize();

        //Envio form por ajax
        $.ajax({
        type: 'post',
        url: '/AnadirDeveloper',
        data: formData,
        success: function(result) {
            showToastr('success', 'Exíto', '');
            $("#staticBackdrop2").modal('hide');
            $(".modal-backdrop").hide();
        },
        error: function(xhr, status, error) {
            showToastr('error', 'Ha ocurrido un error', xhr.responseJSON.error);
        }
        })
    })
});