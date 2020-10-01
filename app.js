var express = require('express');
var bodyParser=require("body-parser");
var mongoose = require("mongoose");
var app=express();
var gadget=require('./models/gadgets')
var seedDB=require('./seeds')
var methodOverride=require("method-override")
var Comment= require("./models/comment")
var passport=require("passport");
var LocalStrategy =require("passport-local");
var User= require("./models/user");
var flash =require("connect-flash")
require('dotenv').config()
//var passportLocalMongoose= require("passport-local-mongoose");

var commentRoutes=require("./routes/comments"),
	gadgetRoutes=require("./routes/gadgets"),
	indexRoutes=require("./routes/index");

mongoose.connect("mongodb://localhost:27017/gadet_db_v16_1",{useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine','ejs');
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());

// app.use(gadgetRoutes);
// app.use(commentRoutes);
// app.use(indexRoutes);

//seedDB();  Seeed the database
///passport configuration
app.use(require("express-session")({
	secret:"rusty is dog best",
	resave:false,
	saveUninitialized: false
	
}));


app.use(passport.initialize());
app.use(passport.session());
app.locals.moment=require('moment');

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
});


app.use("/",indexRoutes);
app.use("/gadget",gadgetRoutes);
app.use("/gadget/:id/comments",commentRoutes);


// var camp=[
// 		{name:"Van cmap",img:"https://cdn.pixabay.com/photo/2017/09/26/13/50/rv-2788677__480.jpg"},
// 		{name:"ice camp",img:"https://cdn.pixabay.com/photo/2018/05/16/15/49/camper-3406137__480.jpg"},
// 		{name:"hill camp",img:"https://cdn.pixabay.com/photo/2020/07/14/12/35/elfin-lakes-5404021__480.jpg"},
// 	{name:"Van cmap",img:"https://cdn.pixabay.com/photo/2017/09/26/13/50/rv-2788677__480.jpg"},
// 		{name:"ice camp",img:"https://cdn.pixabay.com/photo/2018/05/16/15/49/camper-3406137__480.jpg"},
// 		{name:"hill camp",img:"https://cdn.pixabay.com/photo/2020/07/14/12/35/elfin-lakes-5404021__480.jpg"},
// 	{name:"Van cmap",img:"https://cdn.pixabay.com/photo/2017/09/26/13/50/rv-2788677__480.jpg"},
// 		{name:"ice camp",img:"https://cdn.pixabay.com/photo/2018/05/16/15/49/camper-3406137__480.jpg"},
// 		{name:"hill camp",img:"https://cdn.pixabay.com/photo/2020/07/14/12/35/elfin-lakes-5404021__480.jpg"}
		
// 	];

//creating database:


// gadget.create({
// 	name:"ice camp",
// 	img:"https://cdn.pixabay.com/photo/2018/05/16/15/49/camper-3406137__480.jpg",
// 	desc:"This is a ice camp covered with lots of ice"
	
// },function(err,gadget){
// 	if(err){
// 		console.log(err);
		
// 	}else{
// 		console.log(gadget);
// 	}
// })




app.listen(process.env.PORT || 3000,process.env.IP,function(){
	console.log("YelCamp Application has Started");
});

// NAME 		URL 			VERB		DESC
// // ========================================
// INDEX		/dogs			get			displaylist of  dogs
// NEW 		/dogs/new		get			display form for dogs
// CREATE		/dogs			post		add new dog to db
// SHOW		/dogs/:id		get			show info about dogs
