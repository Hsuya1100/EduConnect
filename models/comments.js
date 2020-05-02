//COMMENTS SCHEMA
var mongoose=require('mongoose');
var CommentsSchema= new mongoose.Schema({
	comment:String,
	author:
	{
		 id:{
		 	type:mongoose.Schema.Types.ObjectId,
		 	ref:"User"
		 },
		 username:String
	}
});
var Comment=mongoose.model("Comment",CommentsSchema);
module.exports=Comment;