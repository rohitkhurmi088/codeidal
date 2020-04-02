const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 8800;

const ejs = require('ejs');
const bodyParser = require('body-parser');
const uuid = require('uuid');

//__________MONGOdb setup___________________
 const db = require('./config/mongoose');

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


//including css-static files(assets)
app.use(express.static('assets'));


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

