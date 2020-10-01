var express=require("express");
var router =express.Router({mergeParams:true});
var Gadget=require("../models/gadgets");
var Comment=require("../models/comment");
var middleware=require("../middleware")
require('dotenv').config()

router.get("/new",middleware.isLoggedIn,function(req,res){
	//find gadget by id
	Gadget.findById(req.params.id,function(err,gadget){
		if(err){
			console.log(err)
		}else{
		res.render("comments/new",{gadget:gadget})
		}
	})
})

router.post("/",middleware.isLoggedIn,function(req,res){
	//loockup comments using id
	Gadget.findById(req.params.id,function(err,gadget){
		if(err){
			console.log(err);
			res.redirect("/gadget")
		}else{
			Comment.create(req.body.comment,function(err,comment){
				if(err){
					req.flash("error","Something went wrong")
					console.log(err);
				}else{
					//add username and id to the comment
					comment.author.id=req.user.id;
					comment.author.username=req.user.username;
					//save comment
					comment.save()
					console.log("Usernam ewill be "+req.user.username)
					gadget.comments.push(comment);
					gadget.save()
					req.flash("success","Succesfully added comment")
					res.redirect("/gadget/"+gadget._id);
				}
			})
		}
	})
	//create comments
	//add cooments to gadget
	//redirect to gadget show page
});
//comment edit route
router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
	Comment.findById(req.params.comment_id,function(err,foundComment){
		if(err){
			res.redirect("back")
		}else{
				req.params.id
				res.render("comments/edit",{gadget_id:req.params.id,comment:foundComment});
		}
	})
});
//comment update
router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
		if(err){
			res.redirect("back");
		}else{
			res.redirect("/gadget/"+req.params.id);
		}
		
		
	})
	
});

//delete commen button will be a form that will submit a reques

//gadget delete ===/gadget/:id
//comment delete ====/gadget/:id/comment/:comment_id

//comments destroy
router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id,function(err){
		if(err){
			res.redirect("back");
		}else{
			req.flash("success","Comment Deleted")
			res.redirect("/gadget/"+req.params.id);
		}
	})
})




// function isLoggedIn(req,res ,next){
// 	if(req.isAuthenticated()){
// 		return next();
// 	}res.redirect("/login");
// }


// function checkCommentOwnership(req,res,next){
// 	if(req.isAuthenticated()){
// 		Comment.findById(req.params.comment_id,function(err,foundComment){
// 			if(err){
// 				res.redirect("back")
// 				console.log(err)
// 				}
// 			else{
// 				if(foundComment.author.id.equals(req.user._id)){
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