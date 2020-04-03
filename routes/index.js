const express = require('express');
const router = express.Router();

//home
const homeController = require('../controller/home_controller');
router.get('/', homeController.home);

/**** :::: NOTE ::::: *****
IF we are creating Seprate files for each Router***
USE this file for HomeRouter + seprate files for Other Routers
in routes folder .js files

For any further Routes from here use:
No need of doing router.get('./routeName, require'./routerfile);
./routerName = name after ./ => after homeRoute
routerfile = ,js-file for router in router folder

For other routers following homeRouter '/':
router.use('/routerName', require('./routerfile))
****/

//profile
router.use('/users', require('./users'));

//tweet
router.use('/tweet', require('./tweet'));

//exporting router
module.exports = router;


