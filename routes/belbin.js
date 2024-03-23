var express = require('express');
var router = express.Router();

// Sample form data
const seccion1 = [
  { question: 'Creo que puedo detectar las oportunidades pronto y sacar provecho de ellas.' },
  { question: 'Puedo trabajar bien con diferentes tipos de personas.' },
  { question: 'Generar ideas es uno de mis recursos naturales.' },
  { question: 'Mi habilidad reside en detectar aquello de valor de cada persona que pueda contribuir a los objetivos del grupo y mostrarlos.' },
  { question: 'Pueden confiar en que acabo cualquier tarea que me encarguen.' },
  { question: 'Mis conocimientos técnicos y mi experiencia son normalmente mi mayor valor.' },
  { question: 'Siempre estoy preparado para ser franco y claro si esto ayuda a hacer las cosas bien.' },
  { question: 'Normalmente puedo decir si un plan o una idea se ajustan a una situación particular.' },
  { question: 'Puedo ofrecer una alternativa razonable para distintos caminos mientras mantengo la libertad de las ideas personales.' }
];

const seccion2 = [
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

const seccion3 = [
  { question: 'Tengo la capacidad de influir en las personas sin presionarlas.' },
  { question: 'Puedo tomar parte en la prevención de errores que, por descuido u omisión, puedan estropear el éxito de una operación.' },
  { question: 'Me gusta presionar en busca de acciones que aseguren que la reunión no es una pérdida de tiempo o se desvía del objetivo principal.' },
  { question: 'Pueden contar conmigo para contribuir con algo original.' },
  { question: 'Siempre estoy preparado para retirar una buena sugerencia en aras del interés general.' },
  { question: 'Soy rápido para ver las posibilidades de nuevas ideas y desarrollos.' },
  { question: 'Intento mantener mi sentido de profesionalidad.' },
  { question: 'Creo que mi capacidad de juicio puede ayudar a tomar la decisión correcta.' },
  { question: 'Se puede confiar en mí para comprobar que todo el trabajo esencial está organizado.' }
];

const seccion4 = [
  { question: 'Tengo interés por conocer mejor a mis compañeros.' },
  { question: 'Contribuyo cuando sé de lo que estoy hablando.' },
  { question: 'No soy reacio a desafiar los puntos de vista de otros, o a mantener una visión minoritaria yo mismo.' },
  { question: 'Normalmente encuentro una línea de argumentación para probar que son falsas las proposiciones poco sólidas.' },
  { question: 'Creo que tengo talento para hacer que las cosas funcionen cuando un plan se tiene que llevar a la práctica.' },
  { question: 'Prefiero evitar lo obvio y abrir líneas que no hayan sido exploradas.' },
  { question: 'Doy un toque de perfeccionismo a cualquier trabajo que emprendo.' },
  { question: 'Me gusta ser el que haga los contactos fuera del grupo o de la empresa.' },
  { question: 'Aunque estoy interesado en todos los puntos de vista, no dudo en cambiar mis ideas cuando se ha tomado una decisión consensuada.' }
];

const seccion5 = [
  { question: 'Me gusta analizar situaciones y valorar todas las alternativas posibles.' },
  { question: 'Me intereso por buscar soluciones prácticas a los problemas.' },
  { question: 'Me gusta sentir que estoy ayudando a que haya buenas relaciones de trabajo.' },
  { question: 'Puedo tener una fuerte influencia en las decisiones.' },
  { question: 'Tengo la oportunidad de conocer gente con diferentes ideas.' },
  { question: 'Puedo conseguir que las personas estén de acuerdo en cuales son las prioridades.' },
  { question: 'Me encuentro cómodo cuando puedo dedicar toda mi atención a una tarea.' },
  { question: 'Puedo encontrar un campo que exija mi imaginación.' },
  { question: 'Siento que estoy usando mis habilidades especiales y formación para tener ventajas.' }
];

const seccion6 = [
  { question: 'Me gusta leer todo lo que convenientemente pueda sobre el tema.' },
  { question: 'Me siento como inventando una solución sólo y después tratando de venderla al resto del grupo.' },
  { question: 'Estaré preparado para trabajar con la persona que muestre el acercamiento más positivo.' },
  { question: 'Encontraría la manera de reducir el tamaño de la tarea estableciendo cómo los diferentes individuos pueden contribuir mejor.' },
  { question: 'Mi natural sentido de urgencia ayudaría a asegurar que se cumplan los plazos.' },
  { question: 'Creo que me mostraría agradable y mantendría mi capacidad de pensar claramente.' },
  { question: 'A pesar de presiones contradictorias, empujaría sobre cualquier punto que deba ser realizado.' },
  { question: 'Tendería a evaluarme si sintiera que el grupo no hace progresos.' },
  { question: 'Abriría discusiones sobre un punto para estimular nuevos pensamientos y conseguir que se dinamice.' }
];

const seccion7 = [
  { question: 'Soy capaz de superar el problema cuando la gente no progresa.' },
  { question: 'Algunas veces veo que mi sentido de la objetividad tiene un efecto desmotivador en otros.' },
  { question: 'Mi deseo siempre de comprobar que todo es correcto, no es siempre bienvenido.' },
  { question: 'Tiendo a mostrarme aburrido a no ser que esté trabajando activamente con gente estimulante.' },
  { question: 'Encuentro difícil arrancar si las metas no están claras.' },
  { question: 'A veces soy malo expresando puntos complejos que se me ocurren.' },
  { question: 'Soy consciente de lo que no puedo hacer yo mismo y pido a los demás que lo hagan.' },
  { question: 'Suelo sentir que pierdo el tiempo y que lo haría mejor yo solo.' },
  { question: 'Dudo al expresar puntos de vista personales cuando gente difícil o poderosa está a mi alrededor.' }
];

const formData = [seccion1, seccion2, seccion3, seccion4, seccion5, seccion6, seccion7];

const titles = [
  "Lo que creo que puedo aportar a un grupo",
  "Si tengo una limitación posible en un grupo de trabajo, puede ser que…",
  "Cuando me involucro en un proyecto con otras personas…",
  "Mi acercamiento característico al trabajo del grupo se basa en que…",
  "Gano satisfacción en un trabajo porque…",
  "Si de repente estoy llevando una tarea difícil con tiempo limitado y con personas desconocidas…",
  "En relación a los problemas en los que estoy implicado cuando trabajo en equipo…"
]

// Generate the form HTML
function generateFormHTML(formData, seccion) {
  let formHTML = `<p class="fw-bold fs-5">Para cada sección, debes distribuir 10 puntos entre las frases que creas más acordes a tu comportamiento.</p> <p class="fw-bold fs-5">Sección ${seccion + 1}: ${titles[seccion]} </p><form id="testform" class="testform">`;
  formData.forEach((question, index) => {
      formHTML += `
          <p class="fw-bold fs-6 pt-2">${index + 1}. ${question.question}</p>
          <div class="btn-toolbar justify-content-center" role="toolbar" id=${seccion}-${index + 1}>
              <div class="btn-group flex-wrap" role="group">`;
      for (let i = 0; i <= 10; i++) {
          formHTML += `
                  <input type="radio" id="btn${index + 1}-${i}" class="custom-btn" name="btn${index + 1}" value=${i}>
                  <label for="btn${index + 1}-${i}" class="btn custom-label">${i}</label>`;
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
  const formHTML = generateFormHTML(formData[id-1], id-1);
  res.send(formHTML);
});

// Serve form
router.get('/', function(req, res, next) {
  res.render('belbin');
});

module.exports = router;
