//_________USER_controller_________
//Importing User Model
const User = require('../models/user');

//____file module_______
const fs = require('fs');
const path = require('path');

//_____________________________________
// Display Profile :GET
//_____________________________________
/*Lets keep it same as there is only 1 callback */
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

/*Lets keep it same as there is only 1 callback */
//Converting to async-await since we will be using file upload now
//bodyPaser: req.body :does not works directly when enctype="multipart/form is set"
module.exports.update = async(req, res) => {

	//_____Code without async-await +fileUpload________
	// check if current user id = id of requested user edit by form
	/*if (req.user.id == req.params.id) {
		//only allow to edit
		//Model.findByIdAndUpdate(id=req.params.id, updatedfileds, func(err, ‘modelObject’)
		User.findByIdAndUpdate(req.params.id, { name: req.body.name, email: req.body.email }, function(err, user){
			req.flash('success', 'Updated!');
			return res.redirect('back');
		});
	} else {
		//return http-status-code
		req.flash('error', 'Unauthorized!');
		return res.status(401).send('Unauthorized');
	}*/
	
	//_____Code with async_await & fileUpload______
	/*Converting to async-await since we will be using file upload now*/

	// check if current user id = id of requested user edit by form
	if (req.user.id == req.params.id) {

		try{
			//only allow to edit
			//Model.findByIdAndUpdate(id=req.params.id, updatedfileds, func(err, ‘modelObject’)

			/*bodyPaser: req.body.name/email :does not reads formData directly when enctype="multipart/form is set"
			so we cannot update body params directly
			find the user first, then update the user using multer(.uploadedAvatar) */

			//finding user
			let user = await User.findById(req.params.id);
			
			//multer has already processed the req when you call uploadedAvatar
			//uploadedAvatar(req,res, function(){}): req. is used for bodyParams now
			User.uploadedAvatar(req, res, function(err){
				if(err){console.log('****Multer Error:', err);}
				console.log(req.file); //req contains the file from form
				
				//UPDATING::user Details::
				user.name = req.body.name; //user is finded above
				user.email = req.body.email;

				//if req. has a file: not everytime someone will upload a file
				/*if there is a file then uplaod it*/
				if(req.file){
					
					//if user avatar already exists
					//if(user.avatar){
						
						//:::::REMOVE THE EXISTING Avatar:::::
						/*user.avatar: stores: /uploads/users/avatars/filename
						.. is used to goto puplic(MP1 here) folder from users_controllers.js
						to remove file we use fs module + unlinkSync(path to remove)*/
						//fs.unlinkSync(path.join(__dirname , '..' , user.avatar)); //remove file
						
						//But for this user needs to have an avatar store before in the uploads
					//}
					//else:::::UPDATE NEW user Avatar:::::
					//save the path of the uploaded file into the avatar field in userSchema
					/* user.avatar: current user for which your saving file 
					   User.avatarPath: static varible making AVATAR_PATH public (Model.avatarPath)*/
					  user.avatar = User.avatarPath + '/' + req.file.filename;
					  //<%=user.avatar%> will be used in profile.ejs
					  //gives req.url:localhost:/uploads/users/avatars/avatar-timestamp
				}
				//save the user
				user.save();  /*now file will be stored in  Avatar_PATH:uploads/users/avatars as avatar-timestamp */
		
				//return something
				req.flash('success', 'Updated!');
				return res.redirect('back');
			});		
		}catch(err){
			req.flash('error',err);
			return res.redirect('back');
		}
	} else {
		//return http-status-code
		req.flash('error', 'Unauthorized!');
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
		//console.log('Password does not matches');
		req.flash('error', 'Passwords do not match');
		return res.redirect('back');
	}

	//check email -has to be unique for each user
	//findOne()- find user by email
	User.findOne({ email: req.body.email }, (err, user) => {
		if (err) {
			//console.log('error in finding user(by email) in signUp');
			req.flash('error', err);
			return;
		}

		//if user is not found -create() user using User Model
		//if user is already present - redirect back to signUp page
		//req.body = name,email,password
		if (!user) {
			User.create(req.body, (err, user) => {
				//if error
				if (err) {
					//console.log('error in creating user while signUp');
					req.flash('error', err);
				}
				//if not error = user is created --> then redirect to signIn page
				return res.redirect('/users/sign-in');
			});
		} else {
			//if user is already present -redirect back to signUp page
			req.flash('success', 'You have signed up, login to continue!');
			return res.redirect('back');
		}
	});
};
//_____________________________________________________________________________

//________________________________________________________________________
//signIn existing user + create-session (Login)
//________________________________________________________________________
module.exports.createSession = (req, res) => {
	//::flash message::
	req.flash('success', 'Logged in Successfully');
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
	//::flash message::
	req.flash('success', 'Logged out Successfully');
	//response: when user logout -->goto homePage
	return res.redirect('/');
};

//For Exporting Function
//module.exports.actionName = func(req,res){}

/* signup manual Auth
   sign-in passportjs
   sign-out passportjs
*/
