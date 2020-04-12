//__________________________________________________
//  Creating & Deleting Comments Using AJAX
//__________________________________________________
/*Let's implement this via classes
--> this class would be initialized for every post on the page
 1. When the page loads
 2. Creation of every post dynamically via AJAX 
--> Comments will be called inside the Post */

//____ Method to submit the form data for new post using AJAX (Sending)______
//creating class
class PostComments{

    // constructor is used to initialize the instance of the class whenever a new instance is created
    //**whenever new post is created an instance for comment is also created**
    constructor(postId){

        //Id of the currentPost for which comment is created::
        //Now postId:<%=post._id%> or ${post._id}
        this.postId = postId; //passed to home_posts.js using: new ClassName('pass prameter')

        //post Container by->postId: <li id="post-<%=post._id%>"> ->_posts.ejs:Posting Content
        this.postContainer = $(`#post-${postId}`);

        //comments form ->by postId : <form id="post-<%=post._id%>-comments-form"> ->_posts.ejs:Create Comments
        this.newCommentForm = $(`#post-${postId}-comments-form`);

        this.createComment(postId); //calling createComment Method using this=>postId form home_posts.js

        let self = this;
        // call for all the existing comments
        $(' .delete-comment-button', this.postContainer).each(function(){
            self.deleteComment($(this));
        });
    }

    
    //___________________________________
    //    Creating a Comement by postId
    //____________________________________

    //____ Method to submit the form data for new post using AJAX (Sending)______

    //Disable to Submit Form Manually (using html)
    createComment(postId){
        let pSelf = this; //Disable to Submit Form Manually (using html)
        this.newCommentForm.submit(function(e){
            e.preventDefault();
            let self = this; //local scope

            $.ajax({
                type: 'post',
                url: '/comments/create', //form action
                data: $(self).serialize(),
                success: function(data){
                    //console.log(data); //JSON data
                    
                    //Creating comment
                    let newComment = pSelf.newCommentDom(data.data.comment);
                    //add comment to posts
                    //_posts.ejs-> <ul id="post-comments-<%= post._id %>">:showing comments+username
                    //with $ always use `` backticks
                    $(`#post-comments-${postId}`).prepend(newComment);
                
                    //NOTE:: now your comment will be added to the ul but will not display until yout refresh page
                    /* So, to display comments in ul without refresh --> call comments inside createPost
                       :::call the create comment class--> new PostComments(data.data.post._id); in home_post.js*/

                    //Delete comment
                    //*deletecomment button <a class="delete-comment-button">X<a> is inside the newComment
                    //To use obj2 inside obj1: $('obj2 class/id',obj1) ->jquery
                    pSelf.deleteComment($(' .delete-comment-button', newComment));

                    //FLASH MESSAGE(placed in .js file)
                    new Noty({
                        theme: 'relax',
                        text: "Comment published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();

                }, error: function(error){
                    //responseText -->error
                    console.log(error.responseText);
                }
            });


        });
    }

    //_______Method to create a post in DOM (Receiving)_______
    newCommentDom(comment){
        // I've added a class 'delete-comment-button' to the delete comment link and also id to the comment's li
        return $(`<li id="comment-${ comment._id }">
                        <p>
                            <!--___________________-->
                            <!--Deleting the Comment-->
                            <!--___________________-->
                            <!-- If user is there (signed-in) 
                            & to check the user who has created the comment is same as the user who is signed-in
                            then only show DELTE button (X) 
                            locals.user.id : id of signedIn user 
                            comment.user.id : id of create comment user -->                            
                            <small>
                                <!-- use comment._id or comment.id -->
                                <!--Add a class to delete button<a class="delete-comment-button">:
                                Event Listners + style-->
                                <a class="delete-comment-button" href="/comments/destroy/${comment._id}">X</a>
                            </small>
                            
                            <!--_____________________________________-->
                            <!--Showing Comment + UserName-->
                            <!--____________________________________-->
                            ${comment.content}
                            <!--with NESTED Populating 'user','comments'-->
                            <br>
                            <small>
                                ${comment.user.name}
                            </small>
                        </p>    

                </li>`);
    }

    //_______Method to DELETE a comment in DOM __________
    /* deleteLink to pass <a> DELTE button (X)+ stimulate a click()
    or you can pass on the whole post also -->home.ejs
    ->jQuery (deleteLink) plugin :$(deleteLink).prop('href') : to get the value of href/link in <a> */

    deleteComment(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){

                //to handle ajax we need to get this comment_id:req.params.id from the server(comments_controller.destroy)
                //we will be getting data: has id of comment to be deleted + remove the comment
                //Delete comment button ->li:id="comment-<%comment._id%>" :_comment.ejs
                    $(`#comment-${data.data.comment_id}`).remove();

                    //FLASH MESSAGE(placed in .js file)
                    new Noty({
                        theme: 'relax',
                        text: "Comment Deleted",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();

                },error: function(error){
                    //responseText -->error
                    console.log(error.responseText);
                }
            });

        });
    }


}//closing class: PostComments