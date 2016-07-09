var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var device = require('./routes/device');

var app = express();

var db = require('./db/waterline');

// set up db and orm
db.client.initialize(db.config, function (err, ontology) {
  if (err) {
    console.log(err);
  }
  var Device = ontology.collections.device;
  var Session = ontology.collections.session;

  Session.create({
    }).then(function (session) { // Then we create the pet
          return Device.create({
              deviceID: 'hello',
              session: session,
          });

      }).then(function (device) { // Then we grab all users and their pets
          return Session.find().populate('devices');

      }).then(function(devices){ // Results of the previous then clause are passed to the next
           console.dir(devices);

      }).catch(function(err){ // If any errors occur execution jumps to the catch block.
          console.error(err);
      });
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/device', device);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
