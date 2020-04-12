//importing Post model
const Post = require('../models/post');
//importing Comment Model
const Comment = require('../models/comment');

//________________________________________________________________________
//creating controller to CREATE POST -->module.exports.create
//_________________________________________________________________________
/* content form the FORM :req.body.content (content => present in Schema)
    <textarea name="content" > passed in form to create post
   User form the database using id: req.user.id
   user/locals.user -->available using passport authentication */

module.exports.create = async(req,res)=>{

    try{
        //creating post ->Asign to a variable Post
        await Post.create({
            //content,user: schema object
            content:req.body.content, 
            user:req.user._id //._id = userID in database
        });

        //if post is created -->redirect back to same page
        req.flash('success', 'Post published');
        return res.redirect('back');

    }catch(err){
        //console.log('Error',err);
        req.flash('error', err);
        return res.redirect('back');
    }
    
   
}


//________________________________________________________________________
//creating controller to DELETE POST -->module.exports.destroy
//_________________________________________________________________________

module.exports.destroy = async(req,res)=>{ 

    try{
        /*Note:: here post variable is being used in callback
        use let post = await function({})*/
        let id = req.params.id;  //String params

        //Find the post by id --> req.params.id --> url = ‘posts/destroy/:id’
        let post = await Post.findById( id ); //1st await
           
        //To check the user who is deleting the post is the user who has written the post
        /* post.user :Id of the user who created Post unless u pre-populate it  (Post->user(User)) 
           req.user._id or req.user.id :Current signed-in user */
    
        //.id means converting the object id into String
        /* Instead of (req.user._id) we use (req.user.id):whenever we r comparing ids of 2 objects, 
           we need to convert them into string. Mongose gives you automatic variant of that -> .id*/
            
        //** if post is found **
        if(post.user == req.user.id){
            // remove() ->remove post (post- object passed to display post & in create.post_controller)
            post.remove();

            //delete all-comment by postId of current post:req.params.id
            /* Model.deleteMany() ->delete all the comments based on some query passed */
            await Comment.deleteMany({post:id}); //2nd await
            req.flash('success', 'Post and associated comments deleted');
            return res.redirect('back');
        }else{
            //** if post is not found **
            req.flash('error','You cannot delete this post!');
            return res.redirect('back');
        }        

    }catch(err){
        //console.log('Error',err);
        req.flash('error', err);
        return res.redirect('back');
    }
        
}

