//___________________________________________________________________________________
//  Creating & Deleting Posts Using AJAX
//___________________________________________________________________________________
/*
Steps: 
{    ::::::::: CREATE POST :::::::::::(submit()->event)
    let createPost= function(){
        ::Method to submit the form data for new post using AJAX (Sending)::_____
            Step1: Disable to Submit Form Manually (using html) using Jquery+posting(form:id)
            Step2: Submit the form using AJAX
            Step3: Receive data:send using AJAX in the posts_controller.js as:post (create)  
            step5: After post created + send data using DOM->append/prepend it to jquery             
    }
    step4::Method to create a post in DOM (Receiving)::_______
    let newPostDom = function(variable){  
        //``:used for string interpolation: to use values
        //return $(`your html file code`); //_posts.ejs
        //decide which part to keep which part not to keep (Avoid Comment part)
        //change ejs(<%= %>) to $: <%=post._id%> --> ${post.id} 

    ::::::::: DELETE POST :::::::::::(cilck()->event)
    Step1: Disable <a>:delete_link_Button to delete Manually (using html) using Jquery :deleteLink
    Step2: Submit the click request using AJAX
    Step3: Receive data:send using AJAX in the posts_controller.js as:post_id (destroy)
    Step4: Link/delete button already displayed using DOM   
    step5: After send data + receiving data using DOM->show it in createPost using jquery
    (show the delet button in createPost as delete button is seen only after Post is created)    
     
    ::call functions at the end::
    createPost();
}
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

{   
    //___________________________
    //    Creating a Post
    //___________________________ 
    let createPost = function(){
        //____ Method to submit the form data for new post using AJAX (Sending)______

        //Step1: Disable to Submit Form Manually (using html)
        /* FORM to create Posts: id="new-post-form" */
        $('#new-post-form').submit(function(e){
            e.preventDefault();

        //Step2: Submit the form using AJAX
         /* Now we will submit the form using AJAX:$.ajax
	        data :$(eventId).serialize() --> converts the received form data -> JSON
            content-Key:Value-what you fill in the form */
            $.ajax({
                type: 'POST',
                url: '/posts/create', 
                data: $('#new-post-form').serialize(),
                success: function(data){
                    //console.log(data); 
                    /*json Data:this data{ has a key {data-->post}} pass as -> data.data.post*/
                     
                    //___________Adding Created Post DOM to Jquery_________________

                    //*CREATING THE POST*/
                    /*After creating a Dom Send Data using DOM FUNCTION: newPostDom 
                    POST CREATED:::Append/prepend:jquery func(putting at 1st place) 
                    it to the list(home.ejs:<li id="posts-list-container"> 
                    used for Posting content from _post.ejs*/
                    let newPost = newPostDom(data.data.post);
                    $('#posts-list-container>ul').prepend(newPost);

                    //**DELETING THE POST**/
                    //*deletepost button <a class="delete-post-button">X<a> is inside the new post
                    //To use obj2 inside obj1: $('obj2 class/id',obj1) ->jquery
                    deletePost($(' .delete-post-button', newPost)); // .space when using class with jquery
                   
                    //---------------------------------
                    //NOTE:: Your comment will be added to the ul but will not display until yout refresh page
                    /* So, to display comments in ul without refresh --> call comments 
                    from home_comments.js by postId:post._id
                    :::call the create comment class--> new PostComments(data.data.post._id); in home_post.js*/
                    new PostComments(data.data.post._id);  // call the create comment class
                    //-----------------------------------

                    //FLASH MESSAGE(placed in .js file)
                    new Noty({
                        theme: 'relax',
                        text: "Post published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();

                },error:function(error){
                    //responseText -->error
                    console.log(error.responseText);
                }
            });
        });
    }    

    //_______Method to create a post in DOM (Receiving)_______
    /*Receiving Data using AJAX will not let the page refresh each time you create a post
    but all the created posts gets stored as JSON: inspect->network->preview
    & gets added on refreshing the page. Dont Show in list until you refresh the page.
    For creating a post in DOM we need a function that will help in converting the text of html-->jquery object
    Pass the post data to it :variable : _post.ejs (showing post list) */

    let newPostDom = function(post){

        //note::post-->data form posts_controller
        /* :::::Creating a Post:::::
        Show the delete button to only logged in user & only logged in user is able to create the post
        the person who is creating the post will be getting it added in realtime so remove if(locals.user) line
        :::::Creating a Comment:::::
        if the user is signed in then only he will be able to make the comment
        Is the user is already signed in before making the comment? yes-- you created a Post,so remove if(locals.user) line
        ::Including comments/loops added only when we will append comments to AJAX  */
        
        return $(`<li id="post-${post._id}">
                    <p>
                        <!--___________________-->
                        <!--Deleting the Post-->
                        <!--___________________-->
                        <!-- If user is there (signed-in) 
                        & to check the user who has created the post is same as the user who is signed-in
                        then only show DELTE button (X) 
                        locals.user.id : id of signedIn user 
                        post.user.id : id of create post user -->
                        
                        <small>
                            <!-- use post._id or post.id-->
                            <a class="delete-post-button" href="/posts/destroy/${post._id}">X</a>
                        </small>
                        
                        <!--_____________________________________-->
                        <!--Showing Posts + UserName-->
                        <!--____________________________________-->
                        ${post.content}
                        <!--Without Populating--> 
                        <!--Note:: <%=post.user%> : shows user _id :not name-->
                        <!--with Populating 'user' object-->
                        <br>
                        <Small> ${post.user.name} </Small> 
                    </p>
                    
                    <!--_____________________________________-->
                    <!--FORM to create Comments-->
                    <!--____________________________________-->
                    <div class="post-comments">
                    <!-- Making Form to create Comment: visibe to only Signed-in Users-->
                    <!--1st at local level -> locals.user (only signed in user should be able to see the Form to Comment)-->
                    <!--Note:FORM action="router action"-->
                        <form id="post-${post._id}-comments-form" action="/comments/create" method="POST">
                            <input type="text" name="content" placeholder="Add comment" required>
    
                            <!--::::::::NOTE::::::::::-->
                            <!--We need to send the post._id of the post to which comment need to be added
                            Either we can allow user to send that
                            Or we can place it in a hidden input-->
                            <input type="hidden" name="post" value="${post._id}">
                
                            <input type="submit" value="Add Comment">
                        </form>
                    
                        <!--_____________________________________-->
                        <!--Showing Comments + UserName-->
                        <!--____________________________________-->
                        <div class="post-comments-list">
                            <ul id="post-comments-${post._id}">
                            <!-- post->Array(comments)-->
                                <!--NOTE::
                                including comments/loops added only when we will append comments to AJAX -->
                            </ul>
                        </div>
                    </div>
                </li>`);
        
    }


    //_______Method to DELETE a post in DOM __________
    /* deleteLink to pass <a> DELTE button (X)+ stimulate a click()
    or you can pass on the whole post also -->home.ejs
    ->jQuery (deleteLink) plugin :$(deleteLink).prop('href') : to get the value of href/link in <a> */

    let deletePost = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type:'GET',
                url: $(deleteLink).prop('href'),
                success: function(data){
    
                //to handle ajax we need to get this post_id:req.params.id from the server(post_controller.destroy)
                //we will be getting data: has id of post to be deleted + remove the post
                //Delete Post button ->li:id="post-<%post._id%>" :_post.ejs
                    $(`#post-${data.data.post_id}`).remove();

                    //FLASH MESSAGE(placed in .js file)
                    new Noty({
                        theme: 'relax',
                        text: "Post Deleted",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                    
                },error:function(error) {
                    // A handy error message, just in case anything goes pear-shaped.
                    //window.alert("An error occurred while sending the delete request.");
                    //responseText -->error
                    console.log(error.responseText); //to display the error
                }
            });
        });



   
    }
    
    /**:::Call for Existing Posts:::*/
    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    /*Now whenever we load a page only current created post gets deleted using AJAX
      All the previously created posts gets delete by form method*/
    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    // loop over all the existing posts on the page 
    /*(when the window loads for the first time) and ::::call the delete post method on delete link of each::::, 
    also ::::add AJAX (using the class we've created - in assets->js->home_comments.js)::::
    to the delete button of each*/
    let convertPostsToAjax = function(){
        $('#posts-list-container>ul>li').each(function(){

            /*this is an actual JavaScript keyword that refers to the current scope, 
            while self is a traditional variable name not a JavaScript keyword,
             often used to store the previous “this” scope before entering a new one. 
            The this keyword in JavaScript refers to the object it belongs to.*/
            let self = $(this);
            let deleteButton = $(' .delete-post-button', self);
            deletePost(deleteButton);
            
            //::::get the post's id by splitting the id attribute::::
            /*split("-")[1] returns an array, [1] acceses the second element of the returned array.*/
            let postId = self.prop('id').split("-")[1];

            /* new keyword:
            ->Creates a blank, plain JavaScript object;
            ->Links (sets the constructor of) this object to another object;*/
            //CREATE COMMENTS BY postId passed in PostComments->class in home_comments.js
            new PostComments(postId); //new PostComments(data.data.post._id);passed in createPost()            
        });
    }




    


    //calling functions at the end
    /*delete post called inside it*/
    createPost(); 
    convertPostsToAjax();

}