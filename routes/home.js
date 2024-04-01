var express = require('express');
const { listenerCount } = require('../app');
var router = express.Router();

const buscar_error = "Hubo un problema al buscar.";

router.get('/', function(req, res) {
    if(res.locals.usuario != null) {
        res.render('home');
      }
      else{//NO USUARIO en sesion
        res.redirect('login');
      }
});

router.post("/busqueda", function (request, response) {
  console.log("He llegado");
  response.status(200);
  let nombre = request.body.busqueda;
  const dao=request.dao;
  if(usuario.es_empresa == 1){
    pool.getConnection(async function(err, con) {
      if(err) res.status(500).json({ error: buscar_error });
      else{
        const sql = `SELECT id, nombre, apellido, usuario 
        FROM usuarios 
        WHERE nombre LIKE ? AND es_empresa = false 
        ORDER BY nombre DESC;`;
        const query = `%${nombre}%`; // Ajusta la consulta para que funcione con 'LIKE'
        con.query(sql, [query], function (err, desarrolladores) {
          con.release();
            if (err) {
                callback(err, null);
            } else {
                callback(null, desarrolladores);
            }
        });
      }
    })
  }
  else{

  }
  
});

/* dao.buscarDesarrollador(nombre, function (err, desarrollador) {
      if (err) {
        res.status(500).json({ error: buscar_error });
      } else {
          response.render("./busqueda", {desarrolladores:desarrollador, user:request.session.user?request.session.user:0});
      }
  });*/ 


module.exports = router;