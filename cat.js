var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/cat_app",{
	useNewUrlParser: true,
      useUnifiedTopology: true
}).then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

var catschema=new mongoose.Schema({
	name:String,
	age:Number,
	temprament:String
});

var cat = mongoose.model("cat",catschema);

var george=new cat({
	
	name:"George2",
	age:111,
	temprament:"Grouchy2"
});

george.save(function(err,cat){
	if(err){
		console.log('Error occured');
		console.log(err);
	}else{
		console.log("Saved");
		console.log(cat);
	}
});


cat.find({},function(err,cat){
	if(err){
		console.log("oooooo");
		console.log(err);
	}else{
		console.log("all the cats");
		console.log(cat);
	}
});