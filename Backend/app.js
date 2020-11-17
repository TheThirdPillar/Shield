var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var cors = require('cors')

// Passport configuration
var passport = require('passport')
require('./utils/passport/index')(passport)

// Routes
var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')
var applicationRouter = require('./routes/application')
var communityRouter = require('./routes/commnuity')

var app = express();

// Mongo Setup
var mongoUrl = require('./config/mongo')

var mongoose = require('mongoose')
var mongoDB = mongoUrl.mongoURI

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
mongoose.Promise = global.Promise
var db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error: '))

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
// app.use(cookieParser())
// app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize())

app.use('/', indexRouter)
app.use('/user', usersRouter)
app.use('/application', applicationRouter)
app.use('/community', communityRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
