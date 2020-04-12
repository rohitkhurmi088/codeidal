const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const PORT = process.env.PORT || 5001;

const expressLayouts = require('express-ejs-layouts');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const uuid = require('uuid');


//__________MONGOdb setup___________________
const db = require('./config/mongoose'); //mongoose
const User = require('./models/user'); //user Model

//Passport Authentication used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');

//MongoStore :: uses connect-mongo to save session-info into database
const MongoStore = require('connect-mongo')(session);

//______ (Flash + Flash Middleware )_____________
//For Flash Messages via session cookie & cleared on middleware next()
/*Use flash middleware just below session*/
const flash = require('connect-flash');
//flash middleware
const customMware = require('./Middleware/middleware');

//__________EXPRESS setup___________________
const app = express();
// turn off limits by default (BE CAREFUL)
require('events').EventEmitter.prototype._MaxListeners=0;

//__________Middleware_______________________

//:::::::: SASS MIDDLEWARE :::::::
//Adding SASS: node-sass-middleware & use it just before server starts
const sassMiddleware = require('node-sass-middleware');
//Precompiling Scss-->Css
app.use(sassMiddleware({
    src:'./assets/scss',         //take file from
    dest:'./assets/css',        //compile to destination
    debug: true,              //information in terminal
    outputStyle: 'extended', //miltiple-lines
    prefix: '/css'          //converted-file prefix:.css
}));

//main-middleware

//body parser
app.use(express.json());
app.use(express.urlencoded({ extended:false }));


//----------COOKIE-PARSER-----------------------//

//::: cookie-parser :::
/*The cookie parser parses cookies and
 puts the cookie information on req object in the middleware.
 It will also decrypt signed cookies provided you know the secret.*/
app.use(cookieParser());


//------------TEMPELATE ENGINE:: EJS--------------------//
//including css-static files(assets)
app.use(express.static('./assets'));

//setting the directory for uploads folder
/** MAKE THE UPLOADS PATH AVAILBLE TO THE Browser **/
/* directory of index.js joined with uploads
'm1/uploads' is available on this path now */
app.use('/uploads', express.static(__dirname + '/uploads'));

//for layouts -put before routes
app.use(expressLayouts);
//extract style +script from subpages into layout
//Eg: including home.ejs-css file in layout
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);

//ejs template engine + directory path
app.set('view engine', 'ejs');
//app.set('views', path.join(__dirname,'views'));
app.set('views', './views');

//----------------MONGOSTORE + Express-session-----------------//
//MongoStore is used to store the session cookie in the db

//::: express-session :::
app.use(session({
    name:'social',
    // TO-DO change the secret before deployment in production mode
   //encryption key-code/decode
    secret:'social_web',
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:(1000 * 60* 100) //in millisec
    },
    store: new MongoStore(
        {
            //connect MongoStore with db
            mongooseConnection: db,
            autoRemove: 'disabled'
        }, 
        function(err){
            console.log(err || 'connect-mongo setup was ok');
        } 
    )
}));

//maintaining sessions using passport
//passport :: also helps in maintaining sessions
app.use(passport.initialize());
app.use(passport.session());

/*setup current user usage
:: Middleware in config-->passport-local-strategy.js 
sets current user in the locals - acccessible in views */
app.use(passport.setAuthenticatedUser);

//**Flash Messages : connectFlash + Middlware **/
app.use(flash()); //connect-flash
app.use(customMware.setFlash); //using flash middleware+setFlash func



//__________RENDER EJS templates___________________
/* templates renderd using controllers via router
   conntrollers --> fileName.js */

//_________________ROUTES_____________________________

//router for routes/index.js - ohter routes follow main route
const routes = require('./routes/index');
app.use('/',routes);
//console.log('router loaded');


//________________PORT calling_________________________
app.listen(PORT, (err)=>{
    if(err){
        console.log(`Error in running the server: ${err}`);
        return;
    }
    console.log(`Express_Server running on port: ${PORT}`);
});

