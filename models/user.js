const mongoose = require('mongoose');

//Creating a User Model for form -name,email,password required to login/signup

//creating Schema
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type: String,
        required:true
    }
},{
        timestamps:true //created-at/updated-at
});

//creating model
const User = mongoose.model('User',userSchema);

//exporting model
module.exports = User;



