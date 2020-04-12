//_________home_controller_________

//importing Post Model
const Post = require('../models/post');
//importing User Model
const User = require('../models/user');

//module.exports.home = async(req,res)=>{   //async-await func

    /***______{cookies}____****
    //priniting cookies in console
    console.log(req.cookies);
    //Altering cookie value
    res.cookie('user_rk', 27); */
     
     //____________________________________________ 
    //____Displaying Posts by user on homepage_____
   //______________________________________________

    //__________Without Populating(user object)_____
    /* Model.Find({}, func(err, parameter){}) */
    //Post.find({}, function(err,posts){
        //return res.render('home',{
            //title:'HomePage',
            //posts: posts //displaying posts
        //});
    //});
    
    //__________With POPULATING(user object)__________________
    /*Displaying Post created user by name,email--> in home.ejs
      Pre-Populating reffered user object  using mongoose.populate
      Populating: used to get user object :name,email,password
      from another schema (User) in the current Schema (Post)
    Model.find({}).populate('object to get('object-from-anotherSchema').exec(callback func)*/

    /*Post.find({}).populate('user').exec(function(err, posts){
        return res.render('home', {
            title:'HomePage',
            posts: posts //displaying posts
        })
    }); */


    //_________With ** Nested Populating ** (Display Post,Comments)________________________
    /*To Display comments with --> related user : 
       use Nested Populating :We need to Populate Multiple Models ie get Comment (Comment) + user of that comment(User)
      Model.(find{}).populate(‘obj1 form model1’).populate({path:’ ‘,populate:{path:’ ’})
      Post(by user)-->Comment (by User) */

   /* Post.find({})
    .populate('user')
    .populate({path:'comments', populate:{path:'user'}}).exec(function(err, posts){*/

        //Find all users to display list of users on Homepage
        /* User Model  Model.find({}, function(err, paramenter to find){}) */
        /*User.find({},function(err,users){
            return res.render('home', {
                title:'HomePage',
                posts: posts, //displaying posts
                all_users: users //display all users
            })
        });
        
    });*/

//};




//______________________Making it a Async-Await func (try-cacth errors)________________________
/* :: Async Await ::
It tells the browser that this func contains Async statements & you need to wait with each Asynchronous statement 
Once it gets executed then move on to the next one
Once statements gets executed return something to the browser.
->used for writing cleaner code
->handles exceprions using try-catch block  

Add async to module
try{
    let returned paramerts = await func({}) remove callbacks
    return something to the browser
}catch{err}{
    console.log('Error',err); //handles error
} 
- - - - - - - - - - - - - - - - - - - -- - - - - - - */

module.exports.home = async(req,res)=>{ //add async
    
    try{
        /*ADD await + remove callbacks*/
        let posts = await Post.find({})
        .populate('user')
        .populate({path:'comments', populate:{path:'user'}});
        
        //Find all users to display list of users on Homepage
        /* User Model  Model.find({}, function(err, paramenter to find){}) */
        let users =  await User.find({});
           
        /*when both fucn have been executed finally return someting t the browser*/
        return res.render('home', {
            title:'HomePage',
            posts: posts, //displaying posts
            all_users: users //display all users
        });
    }catch(err){
        Console.log('Error',err);
        return;
    }
}

//For Exporting Function
//module.exports.actionName = funcr(req,res){}