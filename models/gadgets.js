var mongoose=require('mongoose')

var gadgetSchema= new mongoose.Schema({
				name:String,
				price:String,
				img:String,
				imgId:String,
				desc:String,
				createdAt:{type:Date, default:Date.now},
				author:{
					id:{
						type:mongoose.Schema.Types.ObjectId,
						ref:"User"
					},
					username: String
				},
				comments:[{
					type: mongoose.Schema.Types.ObjectId,
					ref : "Comment"}
					]
				
});

module.exports=mongoose.model("gadget",gadgetSchema);