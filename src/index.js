const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const multer = require('multer');

//INITIALIZATIONS
const app = express();
require('./database');
require('./config/passport');

//SETTINGS
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs',exphbs({
     defaultLayout: 'main',
     layoutsDir: path.join(app.get('views'), 'layouts'),
     partialsDir: path.join(app.get('views'), 'partials'),
     extname: '.hbs'
}));
app.set('view engine', '.hbs');

//MIDDLEWARE
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(session({
     secret: 'miappsecreta',
     resave: true,
     saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(multer({dest:path.join(__dirname, '/public/upload/temp')}).single('image'));

//GLOBAL VARIABLES
app.use((req, res, next) =>{
     res.locals.success_msj=req.flash('success_msj');
     res.locals.errors_msj=req.flash('errors_msj');
     res.locals.error=req.flash('error');
     res.locals.user=req.user || null;
     next();
});

//ROUTES
app.use(require('./routes/index'));
app.use(require('./routes/notes'));
app.use(require('./routes/users'));
app.use(require('./routes/pedidos'));

//STATIC FILES
app.use(express.static(path.join(__dirname,'public')));

//SERVER IS LISTENNING
app.listen(app.get('port'),() =>
{
     console.log('Server on port', app.get('port'));
});