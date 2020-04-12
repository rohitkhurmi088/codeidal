//essesntials Local -capital (as per passportjs)
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy; 

//importing model
const User = require('../models/user');


//________:::SignIn:::Authentication (USING Passport.js)____________

/* 2 fileds to authenticate: email,password
   email =unique :usernameField
   done = callback_func -inbuild to password -takes 2 Parameters */

/*Whenever user Signs in this is the func getting called
SignIn action & controller just renders a page.
:::: Create flash messages ::: here 
creating flash message requires req.flash but we dont have a req paramenter here 
so pass a req parameter in th passport-LocalStrategy to create flash messages 
passReqToCallBack: true : allows to pass the 1st argument as req */

passport.use(new LocalStrategy({
    //usernameField- unique in models(2 users cant have same email)
    usernameField: 'email',
    passReqToCallback:true //allows to pass the 1st argument as req
},function(req,email,password,done){  //pass req as 1st parameter for flash-messages
    //Find user & establish the Identity
    User.findOne({email: email} ,function(err,user){
        //if error
        if(err){
            //console.log('error in finding user -->passport');
            req.flash('error',err);
            return done(err); //done =  callback_func
        }
        //if Invalid UserName/password
        if(!user || user.password != password){
            //console.log('Invalid Username/Password');
            req.flash('error', 'Invalid Username/Password');
            //null=>no error , false=>authentication false
            return done(null, false); 
        }
        //if User found- pass the user
        //Passport returns the user to serializer
        return done(null, user);
    });
   }
));

//____________________Serializing & Deserializing ____________________
/* SERIALIZING: In manual-Authentication ur taking out user.id (to encrypt) & putting it into the cookie.
 DESERIALIZING: When cookie is sent back to the server to establish the identity of the user 
               we use that user.id to find the user. */               

// serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user, done){
    //store user.id in encrypted format in cookies
    return done(null, user.id);
});

// deserializing the user from the key(id) in the cookies
passport.deserializeUser(function(id, done){
    //find user by id
    User.findById(id, function(err,user){
        //if error
        if(err){
            console.log('Error in finding user --> Passport');
            return done(err);
        }
        //if user found
        return done(null,user);
    });
});


//________Sending Data(user) of current user to Views(EJS Files)__________________
/* passport.checkAuthentication: to check if user is authenticated (MIDDLEWARE)
   req.isAuthenticated() :  user is authenticated
   passport.setAuthenticatedUser : to pass on User data (user) to Views(EJS)(MIDDLEWARE)

Whenever user is signed-in , that user’s information is available in req.users
req.user: handled by passport : contains current signed-in user from session-cookies
res.locals.user:  passed to  locals for the views  
*/

//check if user is authencated (middleware)
passport.checkAuthentication = function(req,res,next){
     /*to find authenticated user passport puts a method on req: req.isAuthenticated() */
        
        //check if user is signed-in(Authenticated)
        if(req.isAuthenticated()){
            //if user is signed in pass-on the req. to the next function(controllers, action)
            return next();
        }
        //if user is not signed in redirect to the sign-in page
        return res.redirect('/users/sign-in');
}

//if user is Authenticated::: SET The user for the VIEWS:::
passport.setAuthenticatedUser = function(req,res,next){
    if(req.isAuthenticated()){
        //req.user: contains current signed-in user from session-cookies
        //we are just sending it to the locals for the views
        res.locals.user = req.user;
    }
    next();
}
//_________________________________________________________________________________________

//Exporting passport module
module.exports = passport;