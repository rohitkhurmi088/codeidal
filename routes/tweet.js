//_____________ tweet router______________

const express = require('express');
const router = express.Router();

//tweet
const tweetController = require('../controller/tweet_controller');
router.get('/', tweetController.tweet);

/*
::NOTE:: use '/' here & use '/tweet' in router->index.js ie main router for '/'
*/

//exporting router
module.exports = router;




