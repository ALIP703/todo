var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const db=require('./config/connection/connection')
var indexRouter = require('./routes/index');
const cors=  require('cors');
require('dotenv').config();
var app = express();

var corsOptions = {
  origin: '*', // Replace with the appropriate origin
  credentials: true // Allow credentials (cookies, authorization headers, etc.)
};

// Use the cors middleware with the specified options
app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets/images', express.static(path.join(__dirname, 'assets/images')));

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
    console.log(`Server is running on port ${process.env.PORT}`);
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
