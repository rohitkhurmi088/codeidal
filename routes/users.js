//_____________ profile router______________

const express = require('express');
const router = express.Router();

//profile
const usersController = require('../controller/users_controller');
router.get('/', usersController.profile);

/*
::NOTE:: use '/' here & use '/profile' in router->index.js ie main router for '/'
*/

//exporting router
module.exports = router;


