const mongoose = require('mongoose');

//:::: Creating a model for Post ::::
/* Post is going to refer to user --> linked to --> user Schema using mongoose.Schema.Types.ObjectId
One user can create multiple post  (1:m) relation
One post cant be related to multipe users */

//creating schema
const postSchema = new mongoose.Schema({
    content:{
        type:String,
        required: true //content must be in a post
    },   
    user:{
        //post linked to user(userSchema)
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' //refering to User (Model)-->Schema
    },
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
},{
    timestamps:true,
});


//creating model
const Post = mongoose.model('Post', postSchema);

//Exporting Schema
module.exports = Post;


//_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ __ _ _ _ _ _ __ _ _ 
/*Creating Array of comments(Id's) inside Posts
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 
Post Schema -> include Array of  comments -> [refer(Comment)]
whenever we load a post, we also load all the comments inside that post
this can be done in 2 ways:
one way- creating a seprate schema for comments
another way- create schema for comments inside post

We have creating a separate schema for comments to reference Comments Object Independently.
But for Post Schema: loading comments for every user from that schema is time consuming 
so We included an Array of Comment Id's --> Post Schema for frequently accessing query.

Put Array of associated comment ids inside the Post for faster query operations.
Instead of going to each comment -> comment Schema 
& finding out which post id for current post.
*/