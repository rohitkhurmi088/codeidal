//_________home_controller_________

module.exports.home = (req,res)=>{

    /***______{cookies}____****
    //priniting cookies in console
    console.log(req.cookies);
    //Altering cookie value
    res.cookie('user_rk', 27); */

    return res.render('home',{
        title:'HomePage'
    });
};

//For Exporting Function
//module.exports.actionName = funcr(req,res){}