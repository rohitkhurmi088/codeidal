//_______Router for Posts_________
const express = require('express');
const router = express.Router();
//using passport
const passport = require('passport');

//importing Post controller
const postsController = require('../controller/posts_controller');


//______CREATE Post(POST:form-->home.ejs)_______________________________
//call this router in main:router->index.js action:'/posts/create'
/* 2nd at Action level --> in creating post using passport.checkAuthentication
   Creating Post for only Authenticated users 
   using checkAuthenticate func- config-->passport-local-strategy.js
Now even if someone tries to create form using inspect->page
 & tries to submit it that person won’t be able to submit that form.
ie NOT-to-let the user penetrate into action without passing a check of Authentication
Identity (_id) needs to be established before creting a Post */

router.post('/create', passport.checkAuthentication,postsController.create);


//______DELETE Post(GET:<a href="/posts/destroy/<%= post.id%>">-->home.ejs)__________
router.get('/destroy/:id', passport.checkAuthentication,postsController.destroy);





//exporting router
module.exports = router;
