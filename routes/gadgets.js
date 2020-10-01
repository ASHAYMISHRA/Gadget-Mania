var express=require("express");
var router =express.Router();
var Gadget=require("../models/gadgets");
var middleware=require("../middleware")
var multer = require('multer');
require('dotenv').config()
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


// router.get("/",function(req,res){
// 	//get all gadget from mongodb
// 	Gadget.find({},function(err,allgadgets){
// 		if(err){
// 			console.log(err);
// 		}else{
// 			res.render("gadgets/index.ejs",{gadget:allgadgets});
// 		}
// 	});
// 	// res.render("gadget",{gadget:camp});
// });
//INDEX - show all gadgets
router.get("/", function(req, res){
    // Get all gadgets from DB
    Gadget.find({}, function(err, allGadgets){
       if(err){
           console.log(err);
       } else {
          res.render("gadgets/index",{gadget: allGadgets, page: 'gadgets'});
       }
    });
});
router.get("/new",middleware.isLoggedIn,function(req,res){
	res.render("gadgets/new");
});

router.get("/:id",function(req,res){
 	Gadget.findById(req.params.id).populate("comments").exec(function(err,foundgadget){
		if(err){
			console.log(err);
		}else{
			console.log(foundgadget)
			res.render("gadgets/show",{gadget:foundgadget});
		}
	})
 });
router.put("/:id",middleware.checkGadgetOwnership ,upload.single('img') , function(req,res){
	//find ad update
	console.log(req.body);
	Gadget.findById(req.params.id,async function(err,gadget){
		if(err){
			req.flash("err",'err.message');
			res.redirect("back");
		}else{
			if(req.file){
				try{
					await cloudinary.v2.uploader.destroy(gadget.imgId);
					var result = await cloudinary.v2.uploader.upload(req.file.path);
					gadget.imgId=result.public_id;
					gadget.img=result.secure_url;
				}catch(err){
					req.flash("error",err.message);
					return res.redirect("back");
					
				}
	
					// if(err){
					// 	req.flash("err",'err.message')
					// 	return res.redirect("back")	
					// }
	
					// 	if(err){
					// 	req.flash("err",'err.message')
					// 	return res.redirect("back")	
					// }
			}
			gadget.name=req.body.gadget.name;
			gadget.desc=req.body.gadget.desc;
			gadget.price=req.body.gadget.price;
			gadget.save();
			req.flash("success","Successfully Updated");
			res.redirect("/gadget/"+req.params.id)
		}
	});
	//redirect to somewher
});

//Destroy gadget router

router.delete("/:id",middleware.checkGadgetOwnership,function(req,res){
	Gadget.findById(req.params.id,async function(err,gadget){
		if(err){
			req.flash("error",err.message)
			return res.redirect('back');
		}
		try{
			await cloudinary.v2.uploader.destroy(gadget.imgId);
			gadget.remove();
			req.flash("success",'Gadget deleted');
			res.redirect('/gadget');
			
		}catch(err){
			if(err){
				req.flash("error",err.message)
				return res.redirect('back');
			}
			
		}
		
	})
});

router.get("/:id/edit",middleware.checkGadgetOwnership,function(req,res){
//is user loggedin or not
		Gadget.findById(req.params.id,function(err,foundGadget){
			res.render("gadgets/edit",{gadget:foundGadget})
			
		});
});
	

router.post("/", middleware.isLoggedIn, upload.single('img'), function(req, res) {
	console.log(req.file)
	//get data from form and add it to gadget array
	//redirect to gadget
	// var name=req.body.name;
	// var price=req.body.price;
	// var image=req.body.img;
	// var description=req.body.description
	// var author={
	// 	id:req.user._id,
	// 	username:req.user.username
	// }
	// var newCampGround={name:name,price:price,img:image,desc:description,author:author};
	// //create a new camp and add it to db
	// Gadget.create(newCampGround,function(err,newlyCreated){
	// 	if(err){
	// 		console.log(err);
	// 	}else{
	// 		console.log(newlyCreated);
	// 		res.redirect("/gadget");
	// 	}
	// });
		cloudinary.v2.uploader.upload(req.file.path, function(err,result) {
		// add cloudinary url for the image to the gadget object under image property
		console.log("secure url---",result)
		 if(err) {
        req.flash('error', err.message);
        return res.redirect('back');
      }
		req.body.gadget.imgId=result.public_id;
		req.body.gadget.img = result.secure_url;
		// add author to gadget
		req.body.gadget.author = {
		id: req.user._id,
		username: req.user.username
		}
		Gadget.create(req.body.gadget, function(err, gadget) {
		if (err) {
		req.flash('error', err.message);
		return res.redirect('back');
		}
		res.redirect('/gadget/' + gadget.id);
		});
		});
});

// function isLoggedIn(req,res ,next){
// 	if(req.isAuthenticated()){
// 		return next();
// 	}res.redirect("/login");
// }

// function checkGadgetOwnership(req,res,next){
// 	if(req.isAuthenticated()){
// 		Gadget.findById(req.params.id,function(err,foundGadget){
// 			if(err){
// 				res.redirect("back")
// 				console.log(err)
// 				}
// 			else{
// 				if(foundGadget.author.id.equals(req.user._id)){
// 					next();
// 				}else{
// 					res.redirect("back")
// 				}
// 					//console.log(foundGadget.author.id)
// 					//console.log(req.user._id
// 			}
// 		});
// 	}else{
// 	res.redirect('back');
// 	}
// }

module.exports=router;