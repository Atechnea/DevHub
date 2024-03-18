var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  if(res.locals.usuario != null) {
    //aniadir home empresa/usuario
    res.render('index', { title: 'DevHub' });
  }
  else{//NO USUARIO en sesion
    res.redirect('login');
  }
});

module.exports = router;
