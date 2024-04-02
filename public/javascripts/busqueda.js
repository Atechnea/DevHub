document.addEventListener('DOMContentLoaded', function() {
    
    var linkElements = document.querySelectorAll('.link');
    
    if (linkElements.length > 0) {
      linkElements.forEach(function(linkElement) {
        linkElement.addEventListener('click', function(event) {
            event.preventDefault(); 
            var dataId = this.getAttribute('data-id');
            window.location.href = '/perfil/' + dataId;
        });
      });
    }
});