var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bd = require('./db/db');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var equipoRouter = require('./routes/equipo');
var registerRouter = require('./routes/register');
var loginRouter = require('./routes/login');
var belbinRouter = require('./routes/belbin');
var homeRouter = require('./routes/home');
var userRouter = require('./routes/users');
var perfilRouter = require('./routes/perfil');
var crearEquipoRouter = require('./routes/crearequipo');

var homeRouter2 = require('./routes/home2');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))

app.use(express.static(path.join(__dirname, 'public')));

app.use(bd.sessionMiddleware);
// Middleware para USER
app.use((req, res, next) => {
  // Obtén la información del usuario si está autenticado
  if(req.session && req.session.auth) {
    res.locals.usuario = req.session.usuario;
  }
  next();
});

app.use((req, res, next) => {
  // Obtén la información del usuario si está autenticado
  if(req.session && req.session.auth) {
    res.locals.usuario = req.session.usuario;
    res.locals.num_invitaciones = 0;
    bd.pool.getConnection(async function(err, con) {
      if(err) 
        res.status(500).json({ error: numero_invitaciones });
      else{
        const sql = `SELECT COUNT (*) AS num_invitaciones
        FROM invitaciones 
        WHERE id_desarrollador LIKE ? OR id_empresa LIKE ?`;
        const query = `%${res.locals.usuario.id}%`; // Ajusta la consulta para que funcione con 'LIKE'
        con.query(sql, [query, query], function (err, numero) {
          con.release();
            if (err) {
              console.error("Error al ejecutar la consulta SQL:", err);
            } else {
              res.locals.num_invitaciones = numero[0].num_invitaciones;
              next();
            }
        });
      }
    })
  }
  else {
    next();
  }
});

// Routers
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/equipo', equipoRouter);
app.use('/registro', registerRouter);
app.use('/login', loginRouter);
app.use('/home', homeRouter);
app.use('/users', userRouter);
app.use('/belbin', belbinRouter);
app.use('/perfil', perfilRouter);
app.use('/crearequipo', crearEquipoRouter);

app.use('/home2', homeRouter2);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
