//_________profile_controller_________

module.exports.profile = (req,res)=>{
    return res.render('profile',{
        title:'UserProfile'
    });
};

//For Exporting Function
//module.exports.actionName = funcr(req,res){}