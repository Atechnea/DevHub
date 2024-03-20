var express = require('express');
var router = express.Router();
var pool = require('../db/db').pool;
const mysql = require('mysql2');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/logout', (req, res, next) => {
  console.log("He llegado al router");
  pool.getConnection(function(err, con){
    if (err) next(createError(err));
    else{
      console.log("He podido conectarme");
      req.session.destroy(err => {
        con.release();
        if(err){
          console.log("He llegado al error");
          next(createError(err));
        }else{
          console.log("He llegado al redirect");
          res.redirect('/');
        }
      });
    }
  });
});

module.exports = router;
