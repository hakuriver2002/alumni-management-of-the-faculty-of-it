const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const cors = require("cors");
const hbs = require('express-handlebars');
const Handlebars = require('handlebars')

const passport = require('passport');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')

// connect mongoose db
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './.env') });
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const flash = require('connect-flash');

const indexRouter = require('./routes/index.routes');

const connectDB = require("./configs/connectDB")
//Database connect
connectDB()


const app = express();
const PORT = process.env.PORT || 5050;

// view engine setup
app.set('views', path.join(__dirname, '/resources/views'));

app.engine('hbs', hbs.engine({
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  defaultLayout: 'main',
  extname: '.hbs',
  helpers: {
    json: function (context) { 
        return JSON.stringify(context);
    },
    eq: function (a, b, options) {
      if (a === b) {
        return options.fn(this);
      }
      return options.inverse(this);
    },
    equal: function (a, b) {
      return a === b;
    },
    roleLabel: function (role) {
      if (role === 'client') {
        return 'Cựu sinh viên';
      }
      else if (role === 'admin') {
        return 'Quản trị viên';
      }
      return role;
    },
    ifeq: function(arg1, arg2, options) {
      return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
    },
    noteq: function(arg1, arg2, options) {
      return (arg1 !== arg2) ? options.fn(this) : options.inverse(this);
    },
    no1: function (val) {
        return val + 1;
    },
    even: function(val){
      if (val % 2 == 0){
        return 'even'
      }
      else {
        return 'odd'
      }
    }
}
}))
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api', express.static('public'));
app.use('/api', express.static(path.join(__dirname, 'public')));

app.use('/api/admin', express.static('public'));
app.use('/api/admin/alu', express.static('public'));
app.use('/api/admin/events', express.static('public'));
app.use('/api/admin/jobs', express.static('public'));


// session middleware
app.use(session({
    secret: 'mysecret',
    cookie: { maxAge: 3 * 60 * 60 * 1000 },
    resave: false,
    saveUninitialized: false,
}));

// middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}))

app.use(cors())

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
require('./configs/passportConfig')(passport);

const flashMessage = require('./middlewares/flashMessage');
app.use(flashMessage);

indexRouter(app)

app.get('/error/404', function (req, res) {
  res.render('error/404', { layout: false });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log(err.message);
  res.render('error/404', { layout: false });
});



app.listen(PORT, () =>  {console.log(
    `Server running at http://localhost:${PORT}/api/; ` +
    `Press Ctrl + C to stop `);
});

module.exports = app;