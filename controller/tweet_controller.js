//_________tweet/user_controller_________

module.exports.tweet = (req,res)=>{
    return res.render('tweet',{
        title:'Tweets'
    });
};

//For Exporting Function
//module.exports.actionName = funcr(req,res){}