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
            if (result = "") {
                $("#msg").text("Exito!");
            } else {
                $("#msg").text("Fallo!");
            }
        },
        error: function(error) {
            window.location.href = "/error.ejs";
        }
        })
    })
});