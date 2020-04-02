//_____________ profile router______________

const express = require('express');
const router = express.Router();

//profile
const profileController = require('../controller/profile_controller');
router.get('/', profileController.profile);

/*
::NOTE:: use '/' here & use '/profile' in router->index.js ie main router for '/'
*/

//exporting router
module.exports = router;


