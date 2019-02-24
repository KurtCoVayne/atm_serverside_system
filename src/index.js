const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

// Initializations
const app = express();
require('./database');
require('./config/passport');
// Settings
// app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
  helpers: require('./helpers/Handlebars-helpers').helpers,
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs'
}));
app.set('view engine', '.hbs')
// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: 'lost-on-you',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session())


app.use(flash());
// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg')
  res.locals.fail_msg = req.flash('fail_msg');
  res.locals.error = req.flash('error')
  res.locals.user = req.user || null;
  next();
})
// routes
app.use(require('./routes/index'));
app.use('/users/', require('./routes/users'))
app.use('/services/', require('./routes/services'))
app.use(function (req, res, next) {
  const errors = [];
  errors.push({ text: 'Lo siento, pero la pagina que solicitas no existe' })
  res.status(404).render('index', { errors });
});
// static files
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;
