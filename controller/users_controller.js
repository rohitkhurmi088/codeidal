//_________USER_controller_________
//Importing User Model 
const User = require('../models/user');

module.exports.profile = (req,res)=>{
    return res.render('profile',{
        title:'UserProfile'
    });
};


//__________Render the SignIn | SignUp pages___________

//sign_in ACTION + make route for this
module.exports.signIn = (req,res)=>{
    return res.render('user_sign_in',{
        title:'Social | Login'
    });
};

//sign_Up Action + make route for this
module.exports.signUp = (req,res)=>{
    return res.render('user_sign_up',{
        title:'Social | Register'
    });
};

//________________________________________________________________________
//_____________ SIGN UP (STEPS TO Create New User)________________________
/*Create New User -Get signUp data (Register)
/users/create = action rom signUp form */
module.exports.create = (req,res)=>{

    //If password & confirm password dont matches redirect back-signUp page
    if(req.body.password != req.body.confirm_password ){
        console.log('Password does not matches');
        return res.redirect('back');
    }

    //check email -has to be unique for each user
    //findOne()- find user by email
    User.findOne({email:req.body.email}, (err,user)=>{
        if(err){
            console.log('error in finding user(by email) in signUp');
            return
        }

        //if user is not found -create() user using User Model
        //if user is already present - redirect back to signUp page
        //req.body = name,email,password
        if(!user){
            User.create(req.body, (err,user)=>{
                //if error
                if(err){
                    console.log('error in creating user while signUp');
                }
                //if not error = user is created --> then redirect to signIn page
                return res.redirect('/users/sign-in');
            });
        }else{
            //if user is already present -redirect back to signUp page
            return res.redirect('back');
        }
    });
};
//_____________________________________________________________________________


//________________________________________________________________________
//_____________SIGN IN (STEPS TO Authenticate User)______________________
//signIn existing user + create-session (Login)
module.exports.createSession = (req,res)=>{
    
    //find the user -by email
    User.findOne({email:req.body.email}, (err,user)=>{
        //if error
        if(err){
            console.log('error in finding user while signIn');
            return
        }
        //if user found
        if(user){
            //handle if password not match to that in database(user.password)
            if(user.password != req.body.password){
                return res.redirect('back');
            }
            //:::LOGIN Successful:::
            //handle session-creation + send login user to profile page
            res.cookie('user_id', user.id); //set the cookie with user.id
            return res.redirect('/users/profile'); //redirect to profile
        }else{
            // user not found ->handle user not found
            //return back to signIn page
            return res.redirect('back');
        }
    });
};
  
      
       
       







//LOGOUT
module.exports.destroySession = (req,res)=>{

};










//For Exporting Function
//module.exports.actionName = funcr(req,res){}