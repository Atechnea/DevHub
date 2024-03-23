var seccion = 1;
var resultados = {"Coordinador": 0, "Impulsor": 0, "Cerebro": 0, "Monitor Evaluador": 0, "Implementador" : 0, "Cohesionador": 0, "Investigador de Recursos": 0, "Finalizador": 0, "Especialista": 0};

$(document).ready(function() {
    // Function to load the form via AJAX
    function loadForm(id) {
      $.ajax({
        url: "/belbin/form/"+id, // Specify the URL of your form generating endpoint
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
    loadForm(seccion);
  
    // Event listener for the arrow icon to dynamically load next form
    $(document).on("click", ".arrow-icon", function(e) {
      e.preventDefault();
      const formData = $("#testform").serializeArray();
      if (Object.keys(formData).length < 9) {
        showToastr('error', 'Debe rellenar todas las preguntas', 'Si en alguna pregunta no le has asignado ningún punto, recuerda marcar el botón 0');
        return;
      }
      const sum = formData.reduce(
        (accumulator, currentValue) => accumulator + parseInt(currentValue.value),
        0,
      );
      if(sum != 10) {
        showToastr('error', '¡Recuerda!', 'La suma de todas las preguntas de esta sección debe ser 10.');
        return;
      }
      if (seccion == 1) {
        resultados["Investigador de Recursos"] += parseInt(formData.find((e) => {return e.name == "btn1"}).value);
        resultados["Cohesionador"] += parseInt(formData.find((e) => {return e.name == "btn2"}).value);
        resultados["Cerebro"] += parseInt(formData.find((e) => {return e.name == "btn3"}).value);
        resultados["Coordinador"] += parseInt(formData.find((e) => {return e.name == "btn4"}).value);
        resultados["Finalizador"] += parseInt(formData.find((e) => {return e.name == "btn5"}).value);
        resultados["Especialista"] += parseInt(formData.find((e) => {return e.name == "btn6"}).value);
        resultados["Impulsor"] += parseInt(formData.find((e) => {return e.name == "btn7"}).value);
        resultados["Implementador"] += parseInt(formData.find((e) => {return e.name == "btn8"}).value);
        resultados["Monitor Evaluador"] += parseInt(formData.find((e) => {return e.name == "btn9"}).value);
      } else if (seccion == 2) {
        resultados["Implementador"] += parseInt(formData.find((e) => {return e.name == "btn1"}).value);
        resultados["Coordinador"] += parseInt(formData.find((e) => {return e.name == "btn2"}).value);
        resultados["Especialista"] += parseInt(formData.find((e) => {return e.name == "btn3"}).value);
        resultados["Investigador de Recursos"] += parseInt(formData.find((e) => {return e.name == "btn4"}).value);
        resultados["Monitor Evaluador"] += parseInt(formData.find((e) => {return e.name == "btn5"}).value);
        resultados["Impulsor"] += parseInt(formData.find((e) => {return e.name == "btn6"}).value);
        resultados["Cohesionador"] += parseInt(formData.find((e) => {return e.name == "btn7"}).value);
        resultados["Cerebro"] += parseInt(formData.find((e) => {return e.name == "btn8"}).value);
        resultados["Finalizador"] += parseInt(formData.find((e) => {return e.name == "btn9"}).value);
      } else if (seccion == 3) {
        resultados["Coordinador"] += parseInt(formData.find((e) => {return e.name == "btn1"}).value);
        resultados["Finalizador"] += parseInt(formData.find((e) => {return e.name == "btn2"}).value);
        resultados["Impulsor"] += parseInt(formData.find((e) => {return e.name == "btn3"}).value);
        resultados["Cerebro"] += parseInt(formData.find((e) => {return e.name == "btn4"}).value);
        resultados["Cohesionador"] += parseInt(formData.find((e) => {return e.name == "btn5"}).value);
        resultados["Investigador de Recursos"] += parseInt(formData.find((e) => {return e.name == "btn6"}).value);
        resultados["Especialista"] += parseInt(formData.find((e) => {return e.name == "btn7"}).value);
        resultados["Monitor Evaluador"] += parseInt(formData.find((e) => {return e.name == "btn8"}).value);
        resultados["Implementador"] += parseInt(formData.find((e) => {return e.name == "btn9"}).value);
      } else if (seccion == 4) {
        resultados["Cohesionador"] += parseInt(formData.find((e) => {return e.name == "btn1"}).value);
        resultados["Especialista"] += parseInt(formData.find((e) => {return e.name == "btn2"}).value);
        resultados["Impulsor"] += parseInt(formData.find((e) => {return e.name == "btn3"}).value);
        resultados["Monitor Evaluador"] += parseInt(formData.find((e) => {return e.name == "btn4"}).value);
        resultados["Implementador"] += parseInt(formData.find((e) => {return e.name == "btn5"}).value);
        resultados["Cerebro"] += parseInt(formData.find((e) => {return e.name == "btn6"}).value);
        resultados["Finalizador"] += parseInt(formData.find((e) => {return e.name == "btn7"}).value);
        resultados["Investigador de Recursos"] += parseInt(formData.find((e) => {return e.name == "btn8"}).value);
        resultados["Coordinador"] += parseInt(formData.find((e) => {return e.name == "btn9"}).value);
      } else if (seccion == 5) {
        resultados["Monitor Evaluador"] += parseInt(formData.find((e) => {return e.name == "btn1"}).value);
        resultados["Implementador"] += parseInt(formData.find((e) => {return e.name == "btn2"}).value);
        resultados["Cohesionador"] += parseInt(formData.find((e) => {return e.name == "btn3"}).value);
        resultados["Impulsor"] += parseInt(formData.find((e) => {return e.name == "btn4"}).value);
        resultados["Investigador de Recursos"] += parseInt(formData.find((e) => {return e.name == "btn5"}).value);
        resultados["Coordinador"] += parseInt(formData.find((e) => {return e.name == "btn6"}).value);
        resultados["Finalizador"] += parseInt(formData.find((e) => {return e.name == "btn7"}).value);
        resultados["Cerebro"] += parseInt(formData.find((e) => {return e.name == "btn8"}).value);
        resultados["Especialista"] += parseInt(formData.find((e) => {return e.name == "btn9"}).value);
      } else if (seccion == 6) {
        resultados["Especialista"] += parseInt(formData.find((e) => {return e.name == "btn1"}).value);
        resultados["Cerebro"] += parseInt(formData.find((e) => {return e.name == "btn2"}).value);
        resultados["Cohesionador"] += parseInt(formData.find((e) => {return e.name == "btn3"}).value);
        resultados["Coordinador"] += parseInt(formData.find((e) => {return e.name == "btn4"}).value);
        resultados["Finalizador"] += parseInt(formData.find((e) => {return e.name == "btn5"}).value);
        resultados["Monitor Evaluador"] += parseInt(formData.find((e) => {return e.name == "btn6"}).value);
        resultados["Implementador"] += parseInt(formData.find((e) => {return e.name == "btn7"}).value);
        resultados["Impulsor"] += parseInt(formData.find((e) => {return e.name == "btn8"}).value);
        resultados["Investigador de Recursos"] += parseInt(formData.find((e) => {return e.name == "btn9"}).value);
      } else if (seccion == 7) {
        resultados["Impulsor"] += parseInt(formData.find((e) => {return e.name == "btn1"}).value);
        resultados["Monitor Evaluador"] += parseInt(formData.find((e) => {return e.name == "btn2"}).value);
        resultados["Finalizador"] += parseInt(formData.find((e) => {return e.name == "btn3"}).value);
        resultados["Investigador de Recursos"] += parseInt(formData.find((e) => {return e.name == "btn4"}).value);
        resultados["Monitor Evaluador"] += parseInt(formData.find((e) => {return e.name == "btn5"}).value);
        resultados["Cerebro"] += parseInt(formData.find((e) => {return e.name == "btn6"}).value);
        resultados["Coordinador"] += parseInt(formData.find((e) => {return e.name == "btn7"}).value);
        resultados["Especialista"] += parseInt(formData.find((e) => {return e.name == "btn8"}).value);
        resultados["Cohesionador"] += parseInt(formData.find((e) => {return e.name == "btn9"}).value);
      } 
      //seccion = seccion + 1;
      //loadForm(seccion);
    });
  });