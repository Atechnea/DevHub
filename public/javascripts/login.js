$(document).ready(function(){
    $("#formlogin").on('submit', '.formlogin', function(event) {
        event.preventDefault();

        var formData = $(this).serialize();

        //Envio form por ajax
        $.ajax({
        type: 'post',
        url: 'login/login',
        data: formData,
        success: function(result) {
            showToastr('success', 'Se ha introducido correctamente los datos', '');
        },
        error: function(xhr, status, error) {
            showToastr('error', 'Ha ocurrido un error', xhr.responseJSON.error);
        }
        })
    })
});