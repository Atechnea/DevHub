var express = require('express');
var router = express.Router();

// Sample form data
const seccion1 = [
  { question: 'No estoy a gusto al menos que la reunión esté bien estructurada, controlada y generalmente bien conducida.' },
  { question: 'Suelo ser muy generoso con los que tienen un punto de vista válido que no ha sido expresado correctamente.' },
  { question: 'Soy reacio a contribuir a menos que el tema esté relacionado con un campo que conozca bien.' },
  { question: 'Tengo tendencia a hablar mucho cuando el grupo inicia un nuevo tema.' },
  { question: 'Mi objetividad me dificulta unirme rápidamente al entusiasmo de mis compañeros.' },
  { question: 'Algunas veces me muestro poderoso y autoritario cuando trato sobre temas importantes.' },
  { question: 'Encuentro difícil liderar, quizá porque me influye fácilmente el ambiente del grupo.' },
  { question: 'Soy capaz de dar vueltas a ideas que se me ocurren y perder el hilo de lo que está pasando.' },
  { question: 'Me preocupo cuando al finalizar una reunión se quedan problemas sin resolver.' }
];

const formData = [{seccion1: seccion1}];

// Generate the form HTML
function generateFormHTML(formData) {
  let formHTML = '<form class="testform">';
  formData.forEach((question, index) => {
      formHTML += `
          <p class="fw-bold fs-6 pt-2">${index + 1}. ${question.question}</p>
          <div class="btn-toolbar justify-content-center" role="toolbar">
              <div class="btn-group flex-wrap" role="group">`;
      for (let i = 0; i <= 10; i++) {
          formHTML += `
                  <input type="radio" id="btn${i}" class="custom-btn" name="number_${index}" value="${i}">
                  <label for="btn${i}" class="btn custom-label">${i}</label>`;
      }
      formHTML += `
              </div>
          </div>`;
  });

  // Add the arrow icon for navigation
  formHTML += `
      <div class="row p-3">
          <div class="col text-center">
              <a href="#" class="fas fa-arrow-right arrow-icon"></a>
          </div>
      </div>
  </form>`;
  
  return formHTML;
}

// Serve the form HTML
router.get('/form/:id', (req, res) => {
  var id = req.params.id;
  const formHTML = generateFormHTML(seccion1);
  res.send(formHTML);
});

/* GET users listing. */
router.get('/:id', function(req, res, next) {
  var id = req.params.id;
  res.render('belbin'+id);
});

module.exports = router;
