var express=require("express");
var router =express.Router();
var passport=require("passport");
var User=require("../models/user");
var Gadget=require("../models/gadgets")
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");
var middleware=require("../middleware")
require('dotenv').config();

//for profile image

var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
	// api_key: '843864198355499',
	// api_secret :'ixk3bhZIhwP7c6j7NElpf8xqMGM'
});

//--------------------------------------------------

router.get('/',function(req,res){
	res.render('landing');
});
//Auth routes.................
router.get("/register",function(req,res){
	res.render("register")
});


router.post("/register", upload.single('displaypic') ,function(req,res){
	console.log(req.file)
	console.log(req.path)
	
	cloudinary.v2.uploader.upload(req.file.path, function(err,result) {
	// add cloudinary url for the image to the gadget object under image property
		console.log("secure url---",result)
			if(err) {
			req.flash('error', err.message);
			return res.redirect('back');
			}
				req.body.avatarid=result.public_id;
				req.body.avatar = result.secure_url;

	// var newUser=new User({username: req.body.username, firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email,avatar:req.body.avatar});
	// eval(require('locus'))
	// console.log(typeof(req.body.adminCode))
	// console.log(typeof('1234'))
	var newUser=new User({username: req.body.username, firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email,avatar:req.body.avatar,avatarid:req.body.avatarid});

			if (req.body.adminCode ===process.env.ADMINCODE) {
				newUser.isAdmin = true;
			}
			User.register(newUser,req.body.password,function(err,user){
				if(err){
					console.log(err.message)
					req.flash("error", err.message);
				// return res.render("register");
					res.redirect("/register");
				}
				passport.authenticate("local")(req,res,function(){
				req.flash("success","Welcome to Yelcamo"+user.username);
				res.redirect("/gadget");
				});
			});		

	});
});


///=============show login form
router.get("/login",function(req,res){
	res.render("login");
});


router.post("/login",passport.authenticate("local",{
	successRedirect: "/gadget",
	failureRedirect: "/login"
}),function(req,res){
});


//=================

router.get("/logout",function(req,res){
	req.logout();
	req.flash("error","Logged You Out")
	res.redirect("/gadget");
})

//user profiles-----------

router.get('/users/:id',function(req,res){
	User.findById(req.params.id,function(err,foundUser){
		if(err){
			req.flash("error","Something went wrong")
			res.redirect("/")
		}
		Gadget.find().where('author.id').equals(foundUser._id).exec(function(err,gadget){
			if(err){
			req.flash("error","Something went wrong")
			res.redirect("/")
		}
			res.render("users/show",{user:foundUser,gadget:gadget ,logedinuser:req.user,profileuser:req.params.id});
		})

	});
});
router.get('/users/:id/edit', middleware.isLoggedIn, function(req,res){
	// console.log("log in user id",req.user._id);
	// console.log("profile id",req.params.id)
	if(req.user && req.user._id.equals(req.params.id)){
		res.render("users/edit",{logedinuser:req.user,profileuser:req.params.id})
	}else{
		req.flash("error","You dont own this profile");
		res.redirect("/gadget");
	}
});

router.put('/users/:id',middleware.isLoggedIn,upload.single('dpp'), function(req,res){
	//find a user with the id logged find
	User.findById(req.params.id, async function(err,foundUser){
		console.log("user found",foundUser)
		console.log(req.file);
		if(err){
			req.flash("error","something went wrong")
			res.redirect("back");
		}else{
			if(req.file){
				console.log("reqfile",req.file);
				console.log("avid",foundUser.avatarid);
				try{
					await cloudinary.v2.uploader.destroy(foundUser.avatarid);
					var result = await cloudinary.v2.uploader.upload(req.file.path);
					console.log("result",result);
					foundUser.avatarid=result.public_id;
					foundUser.avatar=result.secure_url;
					console.log(".secure_url",result.secure_url)
					console.log("public_id",result.public_id)
				}catch(err){
					req.flash("error",err.message);
					return res.redirect("back");
					
				}	
			}
			// console.log("User found",founduser);
			foundUser.firstname=req.body.firstname;
			foundUser.lastname=req.body.lastname;
			foundUser.email=req.body.email;
			foundUser.instaId=req.body.instaId;
			foundUser.twitterId=req.body.twitterId;
			foundUser.contactNo=req.body.contactNo
			foundUser.save();
			req.flash("success","Successfully Updated");
			res.redirect("/users/"+req.params.id)
			
			// console.log("founduser firtname",founduser.firstname);
			// console.log("body username",req.body.firstname);
			// founduser.save();
			
		}
	});
	
});


// router.delete('/users/:id',middleware.isLoggedIn,function(req,res){
// 	userimageid="";
// 	User.findById(req.params.id,async function(err,foundUser){
// 		if(err){
// 			req.flash("error",err.message);
// 			req.redirect("back");
// 		}try{
// 			console.log("user found",foundUser);
// 			userimageid=foundUser.avatarid;
// 			console.log(userimageid);
// 			//find all campgrounds of this user
// 			Gadget.find({"author.id":foundUser._id},function(err,allgadgets){
// 				if(err){
// 					console.log(err);
// 				}
// 				try{
// 					console.log("gadets found",allgadgets)
// 					allgadgets.forEach(async function(gadget){
// 						await cloudinary.v2.uploader.destroy(gadget.imgId)
// 						gadget.remove();
// 						console.log("gadgets removed")
// 					});
// 				}catch(err){
// 					if(err){
// 						req.flash("error",err.message)
// 						return res.redirect('back');
// 					}
// 				}
// 				if(foundUser){
// 					cloudinary.v2.uploader.destroy(foundUser.imgId);
// 					foundUser.remove();
// 					req.flash("success",'User deleted');
// 					res.redirect('/');
// 				}
// 			})
// 		}catch(err){
// 			if(err){
// 				req.flash("error",err.message)
// 				return res.redirect('back');
// 			}
// 		}
		
// 		try{await cloudinary.v2.uploader.destroy(userimageid);
// 		console.log("image deleted")
// 		   }catch(err){
// 			   if(err){
// 				  req.flash("error",err.message)
// 					return res.redirect('back');
// 			   }
// 		   }
// 	})
// });

 router.delete('/users/:id',middleware.isLoggedIn,async function(req,res){
	 User.findById(req.params.id,async function(err,foundUser){
		 await Gadget.find({"author.id":foundUser._id},function(err,allgadgets){
				if(err){
					console.log(err);
				}try{
					console.log("gadets found",allgadgets)
					allgadgets.forEach(async function(gadget){
						await cloudinary.v2.uploader.destroy(gadget.imgId)
						gadget.remove();
						console.log("gadgets removed")
					});
				}catch(err){
					if(err){
						req.flash("error",err.message)
						return res.redirect('back');
					}
				}
				})
		 
	 })
	 		
	User.findById(req.params.id,async function(err,user){
		 if(err){
			 req.flash("error",err.message)
			return res.redirect('back');
		 }try{
			 await cloudinary.v2.uploader.destroy(user.avatarid);
			 user.remove()
			req.flash("success",'user deleted');
			res.redirect('/gadget');
		 }catch(err){
			 if(err){
				req.flash("error",err.message)
				return res.redirect('back');
			 }
		 }
	 });
	 
	
 })



//forget pass routes

router.get('/forgot', function(req, res) {
  res.render('forgot');
});

router.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
		console.log("token",token)
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }
		  
		user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
		  
		 user.save(function(err) {
         done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: process.env.GMAILID,
          pass: process.env.GMAILPW
        }
      });
		var mailOptions = {
        to: user.email,
        from: 'ashaymishra30111998@gmail.com',
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
		console.log(req.params.token)
		 console.log(Date.now())
        req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
});

router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
		console.log(req.params.token)
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('reset', {token: req.params.token});
  });
});

router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
          user.setPassword(req.body.password, function(err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
          })
        } else {
            req.flash("error", "Passwords do not match.");
            return res.redirect('back');
        }
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: process.env.GMAILID,
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: process.env.GMAILID,
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/gadget');
  });
});





// function isLoggedIn(req,res ,next){
// 	if(req.isAuthenticated()){
// 		return next();
// 	}res.redirect("/login");
// }

module.exports=router;
