//_______ Mongoose Config :: STEP1 :: _____

//require library
const mongoose = require('mongoose');

//connect to database
mongoose.connect('mongodb://localhost/social_connect', {useNewUrlParser: true , useUnifiedTopology: true, useCreateIndex: true});
//mongoose.set('useCreateIndex', true);

//acquire connection
const db = mongoose.connection;

//If error -db.on()
db.on('error', console.error.bind(console, 'error message'));

//if running -db.once()
db.once('open', function(){
    console.log('Sucessfully Connected to database');
});

//export database(db)
module.exports = db;