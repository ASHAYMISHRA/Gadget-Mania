var mongoose=require("mongoose");
var passportLocalMongoose= require("passport-local-mongoose");

var UserSchema=mongoose.Schema({
	username:{type:String,unique:true,require:true},
	password:String,
	firstname:String,
	lastname:String,
	avatar:String,
	avatarid:String,
	instaId:{ type:String, default:'' },
	twitterId:{ type:String, default:'' },
	contactNo:{ type: String, default:''},
	createdAt:{type:Date, default:Date.now},
	email:{type:String,unique:true,require:true},
	resetPasswordToken: String,
	resetPasswordExpires: Date,
	isAdmin: { type: Boolean, default: false }
});

UserSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model("User",UserSchema);