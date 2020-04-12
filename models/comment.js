const mongoose = require('mongoose');

//creating Schema
const commentSchema = new mongoose.Schema({
    //creating Content for comments
    content:{
        type:String,
        required: true
    },
    user:{
        //requiring User Model:comment belongs to a user
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    posts:{
        //requiring Post Model:comments created in posts
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }
},{
    timestamps:true
})

//creating model
const Comment = mongoose.model('Comment', commentSchema);

//exporting model
module.exports = Comment;

