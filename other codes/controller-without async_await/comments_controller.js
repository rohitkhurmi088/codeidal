//Comment require both Post + Comment Schema
const Comment = require('../models/comment');
const Post = require('../models/post');


//________________________________________________________________________
//creating controller to CREATE Comment for POST -->module.exports.create
//_________________________________________________________________________
/* We need to create a comment over a post
so ist we find weather the post exists with the post._id
then create a comment after it.
-->We need to create a comment
-->Add Comment to post + Array[CommentId] in the postSchema */
/*Array[commentId] gets added to Post & inside comment we need to add a postId*/

module.exports.create = (req,res)=>{
    //find post by post._id or req.body.post (created post)
    Post.findById(req.body.post, function(err,post){
        //if post not found
        if(err){
            console.log('Error! Post not found');
            return;
        }
        //if post is found
        if(post){
            //create a comment:Model.create()
            /** inside comment we need to add a postId **/
            Comment.create({
                //creating comment:Schema objects
                content:req.body.content,
                post:req.body.post, //OR:req.post._id as the post is already created
                user: req.user._id
            },function(err,comment){
                //if comment is not created
                if(err){
                    Console.log('Error in creating a new comment');
                    return;
                }
                //if comment is created
                /** Array[commentId] gets added to Post ** 
                    it will automatically fetchout the commentId
                    & push inside comments array in posts*/
                    post.comments.push(comment);
                    //whenever Updating -->call save() after it
                    post.save();
                    res.redirect('back');  //callback
            });
        }
    });
}


//________________________________________________________________________________
//creating controller to DELETE Comment for POST (TRICKY)-->module.exports.destroy
//________________________________________________________________________________
/* comments are not reference points for any other object having 1:m relationship
   Comments-->refer--> Posts(comments[id of Comments])

postId of comment: comment.post
userId of the commented user: comment.user

(Model)Comment -> id, content, post.id ,user.id
(Model)Post -> id, content, comments[id],user.id
comment: (passed variable in create comment from Comment Model)
post: (passed variable in create post from Post Model)
Suppose:comment-> id=x, content, post.id=y ,user.id
        post y -> id, content, comments[id=x],user.id

If we delete the comment 1st
This post.id also gets deleted for post y
But Post y will be there but (which post did this comment) is lost 
so we need to save the post.id of  post y from the comments in another variable 
Then find this -->post y 
find-->comments[id=x] inside Post & remove it from there also
DELETE the Comment But Save the Post.id 1ST.  

** Before Deleting the comment we need to fetch the post.id of the comment
we need to go inside that post --> find the comment & delete it 
using $pull & Post.findByIdAndUpdate() **/


module.exports.destroy = (req,res)=>{
     
    let id = req.params.id; //String params:'comments/destroy/:id' for the router
    
    //Find the comment by id --> req.params.id --> url = ‘comments/destroy/:id’
    Comment.findById(id, function(err,comment){

        //To check the user who is deleting the comment is the user who has written the post
        /* comment.user :Id of the user who created comment unless you pre-populate it  (Comment->user(User)) 
           req.user._id or req.user.id :Current signed-in user */

        //.id means converting the object id into String
        /* Instead of (req.user._id) we use (req.user.id):whenever we r comparing ids of 2 objects, 
           we need to convert them into string. Mongose gives you automatic variant of that -> .id*/

        //** if comment is found : comment.remove() + update Post **
        if(comment.user == req.user.id){
            // remove() ->remove comment
            comment.remove();

            //____Update the Post After Deleting Comment____
            let postId = comment.post;
            /*::Note::
            $pull --> kind of native MongoDb syntax
            used to pull_out(throw) the id that is matching wiht the pull from parameter
            Syntax: $pull: {pull from: pull what} */ 
            Post.findByIdAndUpdate(postId, {$pull:{comments:id}}, function(err,post){
                return res.redirect('back');
            });
            
        }else{
            //** if comment is not found **
            return res.redirect('back');
        }
    });
    
}