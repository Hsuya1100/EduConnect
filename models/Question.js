//CAMPGROUND SCHEMA
var mongoose 	   = require('mongoose');
var QuestionSchema = new mongoose.Schema({
	subject : String,
	topic   : String,
	image   : {data: Buffer, contentType: String },
	description : {type:String,default:"No description provided"},
	isAnswered  : Boolean,
	student :
	{
		id : {
			type : mongoose.Schema.Types.ObjectId,
			ref  : "User"
		   },
		 username:String
	},
	room :
	{
		id : {
			type : mongoose.Schema.Types.ObjectId,
			ref  : "PrivateRoom"
		   }
	}
});
var Question=mongoose.model("Question",QuestionSchema);
module.exports=Question;