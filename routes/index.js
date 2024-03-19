var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(res.locals.usuario != null) {
    if(res.locals.usuario.es_empresa == 1)
      res.render('homeemp');
    else
      res.render('homedev');
  }
  else{//NO USUARIO en sesion
    res.redirect('login');
  }
});

module.exports = router;
