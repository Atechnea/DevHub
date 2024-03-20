$(document).ready(function() {
    // Function to load the form via AJAX
    function loadForm() {
      $.ajax({
        url: "/belbin/form/1", // Specify the URL of your form generating endpoint
        method: "GET",
        success: function(response) {
          $("#dynamicFormContainer").html(response); // Load the response into the container
        },
        error: function(xhr, status, error) {
          console.error("Error loading form:", error);
        }
      });
    }
  
    // Load the form initially
    loadForm();
  
    // Event listener for the arrow icon to dynamically load next form
    $(document).on("click", ".arrow-icon", function(e) {
      e.preventDefault();
      loadForm();
    });
  
    // Event listener for form submission (if needed)
    $(document).on("submit", ".testform", function(e) {
      e.preventDefault();
      // Perform form submission via AJAX if necessary
      // Example:
      // $.ajax({
      //   url: $(this).attr("action"),
      //   method: $(this).attr("method"),
      //   data: $(this).serialize(),
      //   success: function(response) {
      //     // Handle success
      //   },
      //   error: function(xhr, status, error) {
      //     // Handle error
      //   }
      // });
    });
  });