var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var index = require('./routes/index');
var login = require('./routes/login');
var logout = require('./routes/logout');

var auth = require('./auth/credentials.json');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// session handler
app.use(session({
  secret            : '9f5c6e6e-bbb0-11e6-a4a6-cec0c932ce01',
  resave            : true,
  saveUninitialized : true
}));

app.use(function(req, res, next) {

  var protocol = req.protocol,
      host = req.get('host'),
      originalUrl = req.originalUrl;

  var url = protocol + '://' + host + '/' + originalUrl;

  if(originalUrl.startsWith('/'))
    originalUrl = originalUrl.substr(1);

  var exceptionalPaths = originalUrl.match("^login|^logout");
  var isAdmin = req.session && req.session.user == auth.username && req.session.admin;

  if(isAdmin || exceptionalPaths){

    return next();

  }

  return res.redirect('/login');

});

app.use('/', index);
app.use('/login', login);
app.use('/logout', logout);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
