$(document).ready(function(){
    $("#formlogin").on('submit', '.formlogin', function(event) {
        event.preventDefault();

        var formData = $(this).serialize();
        
        //Envio form por ajax
        $.ajax({
        type: 'post',
        url: 'login/home',
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

function showToastr(type, title, message) {
    let body;
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-bottom-right",
        "preventDuplicates": true,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": 0,
        "onclick": null,
        "onCloseClick": null,
        "extendedTimeOut": 0,
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut",
        "tapToDismiss": false
    };
    switch(type){
        case "info": body = "<span> <i class='fa fa-spinner fa-pulse'></i></span>";
            break;
        default: body = '';
    }
    const content = message + body;
    toastr[type](content, title)
}
