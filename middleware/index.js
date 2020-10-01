var Gadget=require("../models/gadgets")
var Comment=require("../models/comment")

var middlewareObj={};

middlewareObj.checkGadgetOwnership=function(req,res,next){
	if(req.isAuthenticated()){
		Gadget.findById(req.params.id,function(err,foundGadget){
			if(err){
				req.flash("error","Gadget Not found")
				res.redirect("back")
				console.log(err)
				}
			else{
				if(foundGadget.author.id.equals(req.user._id) || req.user.isAdmin){
					next();
				}else{
					req.flash("error","You dont have permission")
					res.redirect("back")
				}
					//console.log(foundGadget.author.id)
					//console.log(req.user._id
			}
		});
	}else{
		req.flash("error","You need to be logged in to do that.")
		res.redirect('back');
	}
}

middlewareObj.checkCommentOwnership=function(req,res,next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id,function(err,foundComment){
			if(err){
				res.redirect("back")
				console.log(err)
				}
			else{
				if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
					next();
				}else{
					req.flash("error","You dont have permission");
					res.redirect("back")
				}
					//console.log(foundGadget.author.id)
					//console.log(req.user._id
			}
		});
	}else{
	req.flash("error","You need to be logged in to do that");
	res.redirect('back');
	}
}

middlewareObj.isLoggedIn=function(req,res ,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","You need to be logged in to do that");
	res.redirect("/login");
}

middlewareObj.isProfileOwner=function(req,res,next){

}


module.exports=middlewareObj
	