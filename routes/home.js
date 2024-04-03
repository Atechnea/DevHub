const { render } = require('ejs');
var express = require('express');
var pool = require('../db/db').pool;
var router = express.Router();

router.get('/', function(req, res) {
    if(res.locals.usuario != null) {
        res.render('home');
      }
      else{//NO USUARIO en sesion
        res.redirect('login');
      }
});

router.post("/busqueda", function (request, response) {
  response.status(200);
  let nombre = request.body.busqueda;
  let usuario = request.session.usuario;
  const dao = request.dao;
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
                response.render('busqueda', {desarrolladores: desarrolladores});
            }
        });
      }
    })
  }
  else{
    pool.getConnection(async function(err, con) {
      if(err) res.status(500).json({ error: buscar_error });
      else{
        const sql = `SELECT id, nombre, apellido, usuario 
        FROM usuarios 
        WHERE nombre LIKE ? AND es_empresa = true 
        ORDER BY nombre DESC;`;
        const query = `%${nombre}%`; // Ajusta la consulta para que funcione con 'LIKE'
        con.query(sql, [query], function (err, empresas) {
          con.release();
            if (err) {
                callback(err, null);
            } else {
                response.render('busquedaEmp', {empresas: empresas});
            }
        });
      }
    })

  }
  
});


module.exports = router;