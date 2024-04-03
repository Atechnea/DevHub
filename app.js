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
