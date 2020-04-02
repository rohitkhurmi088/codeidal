//_________home_controller_________

module.exports.home = (req,res)=>{
    return res.render('home',{
        title:'HomePage'
    });
};

//For Exporting Function
//module.exports.actionName = funcr(req,res){}