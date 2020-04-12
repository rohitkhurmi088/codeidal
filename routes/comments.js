//_______Router for Posts_________
const express = require('express');
const router = express.Router();
//using passport
const passport = require('passport');

//importing Comment controller
const commentsController = require('../controller/comments_controller');


//______CREATE Comment(POST:form-->home.ejs)_______________________________
/* 2nd at Action level --> in creating post using passport.checkAuthentication
   Creating comment for only Authenticated users */
router.post('/create',passport.checkAuthentication ,commentsController.create);


//______DELETE Comment(GET:<a href="/posts/destroy/<%= post.id%>">-->home.ejs)____
/* Deleting comments by using post.id */
router.get('/destroy/:id',passport.checkAuthentication ,commentsController.destroy);




//exporting router
module.exports = router;
