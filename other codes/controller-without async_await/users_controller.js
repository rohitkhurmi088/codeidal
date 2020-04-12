//_________USER_controller_________
//Importing User Model
const User = require('../models/user');

//_____________________________________
// Display Profile :GET
//_____________________________________
module.exports.profile = (req, res) => {
	let id = req.params.id; // String params
	//find user by id & send to frontend
	User.findById(id, function(err, user) {
		return res.render('profile', {
			title: 'UserProfile',
			profile_user: user,
			/* user:user -->locals.user current signed in user
               profile_users (Find user by id): user --> displays profile of the clicked userById */

			//we cannot use user:user as it is already in the 'locals'
			//now Update: user.name/email ->profile_user.name/email in profile.ejs
		});
	});
};

//_____________________________________
//  UPDATE Profile :POST
//_____________________________________
/* Edit/update user by a form
To avoid fead-dealing with the system :any logged in user will be able to edit any user’s profile
We need to check if current user id = id of requested user edit by form
Then only allow to edit
Model.findByIdAndUpdate(id=req.params.id, updatedfileds, func(err, ‘modelObject’)
*/
module.exports.update = (req, res) => {
	// check if current user id = id of requested user edit by form
	if (req.user.id == req.params.id) {
		//only allow to edit
		//Model.findByIdAndUpdate(id=req.params.id, updatedfileds, func(err, ‘modelObject’)
		User.findByIdAndUpdate(req.params.id, { name: req.body.name, email: req.body.email }, function(err, user) {
			return res.redirect('back');
		});
	} else {
		//return http-status-code
		return res.status(401).send('Unauthorized');
	}
};

//__________Render the SignIn | SignUp pages___________

//sign_in ACTION + make route for this
module.exports.signIn = (req, res) => {
	//Authorization
	//if user is signed-up always redirect to profile page
	//using req.isAuthenticated()
	if (req.isAuthenticated()) {
		return res.redirect('/users/profile');
	}
	return res.render('user_sign_in', {
		title: 'Social | Login',
	});
};

//sign_Up Action + make route for this
module.exports.signUp = (req, res) => {
	//Authorization
	//if user is signed-In always redirect to profile page
	//using req.isAuthenticated()
	if (req.isAuthenticated()) {
		return res.redirect('/users/profile');
	}
	return res.render('user_sign_up', {
		title: 'Social | Register',
	});
};

//________________________________________________________________________
//_____________ SIGN UP (Register) ________________________________________
/*Create New User -Get signUp data (Register)
/users/create = action rom signUp form */
module.exports.create = (req, res) => {
	//If password & confirm password dont matches redirect back-signUp page
	if (req.body.password != req.body.confirm_password) {
		console.log('Password does not matches');
		return res.redirect('back');
	}

	//check email -has to be unique for each user
	//findOne()- find user by email
	User.findOne({ email: req.body.email }, (err, user) => {
		if (err) {
			console.log('error in finding user(by email) in signUp');
			return;
		}

		//if user is not found -create() user using User Model
		//if user is already present - redirect back to signUp page
		//req.body = name,email,password
		if (!user) {
			User.create(req.body, (err, user) => {
				//if error
				if (err) {
					console.log('error in creating user while signUp');
				}
				//if not error = user is created --> then redirect to signIn page
				return res.redirect('/users/sign-in');
			});
		} else {
			//if user is already present -redirect back to signUp page
			return res.redirect('back');
		}
	});
};
//_____________________________________________________________________________

//________________________________________________________________________
//signIn existing user + create-session (Login)
//________________________________________________________________________
module.exports.createSession = (req, res) => {
	//redirect to Homepage
	return res.redirect('/');
};

//________________________________________________________________________
//SignOut user + destroySession() (Logout)
//________________________________________________________________________
module.exports.destroySession = (req, res) => {
	//passport func req.logout();
	//Removing user session cookie to remove user’s identity
	req.logout();
	//response: when user logout -->goto homePage
	return res.redirect('/');
};

//For Exporting Function
//module.exports.actionName = func(req,res){}

/* signup manual Auth
   sign-in passportjs
   sign-out passportjs
*/
