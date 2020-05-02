//Private Room SCHEMA
var mongoose=require('mongoose');
var RoomSchema= new mongoose.Schema({
    subject  : String, 
    topic    : String, 
    isActive : Boolean,
    student  : {
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    } ,
	tutor  : {
        id : {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    } ,
	question : {
		 id  : {
		 	type:mongoose.Schema.Types.ObjectId,
		 	ref:"Question"
		 }
	}
});
var Room=mongoose.model("Room",RoomSchema);
module.exports=Room;