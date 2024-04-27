$(document).ready(function(){
    $("#formregistro").on('submit', '.formregistro', function(event) {
        event.preventDefault();

        var formData = $(this).serialize();
        
        //Envio form por ajax
        $.ajax({
        type: 'post',
        url: 'registro/registrar',
        data: formData,
        success: function(result) {
            showToastr('success', 'Su cuenta ha sido creada con éxito', '');
            window.location.href = "/home";
        },
        error: function(xhr, status, error) {
            showToastr('error', 'Ha ocurrido un error', xhr.responseJSON.error);
        }
        })
    })
});