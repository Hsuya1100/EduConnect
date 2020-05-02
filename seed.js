var mongoose=require('mongoose');

//Campgrounds models
var Campgrounds=require("./models/Campground_Schema.js");

function seedDB(){
	//Removes CampGrounds
	Campgrounds.remove({},function(err){
		if(err)
			console.log(err);
		else		
			console.log("All Campgrounds Removed from DB");
	});
}
module.exports=seedDB;