var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    if(res.locals.usuario != null) {
        res.render('home');
      }
      else{//NO USUARIO en sesion
        res.redirect('login');
      }
});


module.exports = router;