const mongoose = require('mongoose');

//__________________________________________________
/** SETTING up Multer: fileUpload **/
//___________________________________________________
//Importing multer individually for each model
const multer = require('multer');
const path = require('path'); //converts string->path
//path where file will be store : which path?
const AVATAR_PATH = path.join('/uploads/users/avatars');
//______________________________________________________


//Creating a User Model for form -name,email,password required to login/signup
//creating Schema
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type: String,
        required:true
    },
    avatar:{
        type:String //file.fieldname
    }
},{
        timestamps:true //created-at/updated-at
});

//_______________________________________
//Setting up + using storage for multer
//________________________________________
//setting up storage:
/* cb(null,uploadpath): current directory where this file is stored & relative to that we find the uplaods path/folder
   path.join(_dirname):gives current directory + .. + AVATAR_PATH :
   so we will be getting uploadpath relative to current file as: models/../uploads/users/avatars 
   filename : name of the file
   file.fieldname: here fieldname = name stored in schema(avatar)
   file.fieldname + '-' + Date.now(): 
   Every file you upload will be stored as avatar-valueofDate.now()
   req. : here is used i user_controller.update for forms data instead of body parser
   cb: callback function */
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'..',AVATAR_PATH)); //models/../uploads/users/avatars 
    },
    filename: function (req, file, cb) {  
      cb(null, file.fieldname + '-' + Date.now());
    }
});

//using storage:
/* static(called anywhere) :schemaName.statics
   var uploads = multer({storage:storage}):attaches the 'diskStorage' on multer to the 'storage' property
   you have attached different properties to diskStorage now we have to assign it to multer
   .single(filename(defined in schema)): only single file will be uploaded for the fieldname:avatar*/
userSchema.statics.uploadedAvatar = multer({storage:storage}).single('avatar');

//Enable avtarpath to be availabe publicly for the Model(User):
userSchema.statics.avatarPath = AVATAR_PATH; 

/*Now goto user_controller.js:where you added uploads in form(Update Proifle)*/
//_________________________________________________ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 

//creating model
const User = mongoose.model('User',userSchema);

//exporting model
module.exports = User;



