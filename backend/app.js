var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const db=require('./config/connection/connection')
var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// Handle database connection errors
db.on('error', function(err) {
  console.log('Database error: ' + err);
});

// Connect to the database
db.connect(function(err) {
  if (err) {
    console.log('Connection error: ' + err);
  } else {
    console.log('Connected to the database!');
    console.log('Server Start On http://localhost:3000/');


    // Perform database operations here
    // For example:
    // db.query('SELECT * FROM users', function(err, results) {
    //   if (err) {
    //     console.log('Error executing query: ' + err);
    //   } else {
    //     console.log('Query results: ', results);
    //   }
    // });

    // Don't forget to close the connection when done
    // db.end(function(err) {
    //   if (err) {
    //     console.log('Error closing the connection: ' + err);
    //   } else {
    //     console.log('Connection closed successfully.');
    //   }
    // });
  }
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
