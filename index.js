const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const PORT = process.env.PORT || 8800;

const expressLayouts = require('express-ejs-layouts');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const uuid = require('uuid');

//__________MONGOdb setup___________________
const db = require('./config/mongoose'); //mongoose
const User = require('./models/user'); //user Model



//__________EXPRESS setup___________________
const app = express();
require('events').EventEmitter.prototype._MaxListeners=100;

//__________Middleware_______________________

//main-middleware

//ejs template engine
app.set('view engine', 'ejs');
//app.set('views', path.join(__dirname,'views'));
app.set('views', './views');

//body parser
app.use(express.json());
app.use(express.urlencoded({ extended:false }));

//cookie-parser
app.use(cookieParser());

//including css-static files(assets)
app.use(express.static('assets'));

//for layouts -put before routes
app.use(expressLayouts)
//extract style +script from subpages into layout
//Eg: including home.ejs-css file in layout
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);

//__________RENDER EJS templates___________________













//_________________ROUTES_____________________________

//router for routes/index.js
const routes = require('./routes/index');
app.use('/',routes);
//console.log('router loaded');










//________________PORT calling_________________________
app.listen(PORT, (err)=>{
    if(err){
        console.log(err);
        return;
    }
    console.log('SERVER is Running on PORT:',PORT);
});

