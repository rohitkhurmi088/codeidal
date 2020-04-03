//_________USER_controller_________

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

//________________________________________________________

//For Exporting Function
//module.exports.actionName = funcr(req,res){}