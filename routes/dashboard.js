var express=require('express');
var router=express.Router({mergeParams: true});;
var methodOverride=require("method-override");
var flash=require('connect-flash');
router.use(flash());
router.use(methodOverride("_method"));
var Question=require('../models/Question.js');
var User=require('../models/user.js');
var middleware=require("../middleware");
var multer = require('multer');
var fs = require('fs');
var PrivateRoom=require("../models/PrivateRoom.js");
var mongoose=require('mongoose');



// for storing dropped images
// const storage = multer.diskStorage({
// 	destination:function(req,file,cb){
// 		cb(null, './uploads');
// 	},
// 	filename: function(req,file,cb){
// 		cb(null, new Date().toISOString() + file.originalname);
// 	}
// });
const fileFilter = (req,file,cb) => {
	if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg')
	cb(null, true);
	else
	cb(null, false);
}
// const upload = multer(
// 	{
// 		storage: storage,
// 		limits: {
// 			fileSize: 1024*1024*5
// 		},
// 		fileFilter:fileFilter
// 	}); 
// ==========================================
// const crypto = require();
var storage2 = multer.memoryStorage();
var upload2 = multer({storage:storage2, limits: {fileSize: 1024*1024*5}, fileFilter:fileFilter});
// ==========================================
	
	// ASK QUESTION
	router.post("/ask/:id",middleware.isLoggedIn,upload2.single('productImage'),function(req,res){
		//console.log("=======================================");
		//console.log(req.file);
		// //console.log(req.file.buffer);
		//console.log("=======================================");
		if(req.file == null || req.file == "undefined"){
			req.flash("error","Image upload error: constraint jpeg/png (5 MB)");
		//console.log("error format");
		res.redirect("/dash/"+req.params.id);
	}
	else{
		User.findById(req.params.id,function(err,user_data){
			if(err)
			console.log(err);
			else{
				
				// QUESTION CREATE
				var ques_id = "A";
				var data_of_ques={};
				function createQues() {
					return new Promise(function(resolve, reject) {
						var question_data = {
							"subject"     : req.body.subject,
							"topic"       : req.body.topic,
							"description" : req.body.description,
							"image"       :{
									   "data" : req.file.buffer,
								"contentType" : req.file.mimetype
							},							"isAnswered"  : false,
							"student" : {
									"id"       : req.params.id,
									"username" :user_data.username
							}
						};
						//console.log(question_data);
						Question.create(question_data,function(err,data){
							if(err)
								console.log("Couldnt Create Ques in DB\n"+err);
							else
							{
								//console.log("CREATED QUES : "+data);
								ques_id = data._id;
								data_of_ques = data;
								resolve(data);
							}
						});
					})
				}
				// ROOM CREATE
				function createRoom(data_of_ques) {
					return new Promise( function(resolve, reject) {
						data2 =	{
							"subject"  : data_of_ques.subject, 
							"topic"    : data_of_ques.topic, 
							"isActive" : true,
							"student"  : {
								"id":data_of_ques.student.id,
								"username":data_of_ques.student.username
							},
							"question" : {
								"id"   : data_of_ques._id
							}
						};
						//console.log("QUESTION ID============= : "+data_of_ques._id);
						PrivateRoom.create(data2,function(err,room_data){
							if(err)
							console.log("Couldnt Create ROOM in DB");
							else
							{
								//console.log("CREATED ROOM : "+room_data);
								resolve(room_data);
							}
						});
					})
				}
				async function createQuesRoom() {
					ques_data = await createQues();
					room_data = await createRoom(ques_data);
					//console.log("CREATING ROOM FOR "+ques_data);
					//console.log("CREATING ROOM FOR "+room_data);
				}
				createQuesRoom();
				res.redirect("/dash/"+req.params.id);
			}
		});
	}
	
});
















// ===============================================

// DASH1
router.get("/",middleware.isLoggedIn,function(req,res){
		console.log("dashboard 1 !!");	
		//console.log(middleware.check);
		res.redirect("/dash/"+req.user._id);
});
router.get("/faq/:id",middleware.isLoggedIn,function(req,res){
		console.log("faq !!");	
		//console.log(middleware.check);
		res.render("./faq.ejs",{userDetails:req.user});

});







// USER DASH

router.get("/:id",middleware.isLoggedIn,function(req,res){
		console.log("dashboard 2 !!");	
		//console.log(middleware.check);
		var demo_room = {_id : "default"};
		// CHECKING TYPE OF ID
		var type_of_id = "student.id";
		if(req.user.type == "Tutor")
			type_of_id = "tutor.id";
		console.log(type_of_id +" :_ "+req.user.type);
		var ObjectId = require('mongoose').Types.ObjectId; 
		var user_ =  req.params.id ;
		//console.log(user_);
		PrivateRoom.find({ $or:[ { "tutor.id" : user_}, { "student.id" : user_}, {'subject': { $in: req.user.subjects }} ]},function(err,room_data){
			if(err)
				console.log("Cannot Find in DB");
			else{
				console.log("FOUND:rooms======// "+room_data);
				room_data.forEach(element => { 
					//console.log(element.student.id+" "+typeof element.student.id+" "+req.params.id+" "+typeof req.params.id);
					if(element.student.id == req.params.id){
						//console.log(element+" YES");
					} 
				  }); 
				res.render("./dash/landing.ejs",{room_data:room_data, userDetails:req.user, userid: req.params.id});
			}
		});
		
});



	// Question.find({},function(err,camp_data){
	// 	if(err)
	// 		//console.log("Cannot Find in DB");
	// 	else
	// 		res.render("./dash/landing.ejs",{camp_data:camp_data, user_id:req.params.id});
	// });
// });
router.get("/ask/:id",middleware.isLoggedIn,function(req,res){
	//console.log("ASK");
	// Question.find({},function(err,camp_data){
	// 	if(err)
	// 		//console.log("Cannot Find in DB");
	// 	else
	// 		res.render("./dash/landing.ejs",{camp_data:camp_data, user_id:req.params.id});
	// });
});
// Show Info of CampSite by ID
router.get("/room/:id",middleware.isLoggedIn,function(req,res){
	//console.log("REACHED ROOM");
	function findRoom() {
		return new Promise(function(resolve, reject) {
			PrivateRoom.findById(req.params.id,function(err,data){
				if(err)
				console.log(err);
				else
				{
					//console.log("FOUND ROOM");
					console	.log("printing details====\n "+data);
					resolve(data);
				}	
			});	
		})
	}
	function findQues(ques_id) {
		return new Promise(function(resolve, reject) {
			Question.findById(ques_id,function(err,data){
				if(err)
				console.log(err);
				else
				{
					//console.log("FOUND Ques");
					console	.log("printing details====\n "+data);
					resolve(data);
				}	
			});	
		})
	}
	function findStudent(stu_id) {
		return new Promise(function(resolve, reject) {
			User.findById(stu_id, function(err,data){
				if(err)
				console.log(err);
				else
				{
					//console.log("FOUND Student");
					console	.log("printing details====\n "+data);
					resolve(data);
				}	
			});	
		})
	}
	function findTutor(tu_id) {
		return new Promise(function(resolve, reject) {
			dat = null;
			User.findById(tu_id, function(err,data){
				if(err)
				console.log(err);
				else
				{
					//console.log("FOUND tutor");
					console	.log("printing details====\n "+data);
					dat = data;
					resolve(dat);
				}	
			});	
		})
	}
	function addTutor(tutor_id, old_room) {
		return new Promise(function(resolve, reject) {
			old_room.tutor.id       = req.user._id;
			old_room.tutor.username = req.user.username;
			PrivateRoom.findByIdAndUpdate(req.params.id, old_room, function(err,data){
				if(err)
					console.log("Couldnt add tutor to room");
				else{
					//console.log(" add tutor to room");
					resolve(data);
				}
			});
		});
	}
	
	async function getRoomInfo() {
		var room_data    = await findRoom () ;
		var ques_data    = await findQues (room_data.question.id) ;
		var student_data = await findStudent (room_data.student.id) ;
		var tutor_data="";
		if((room_data.tutor.id == null || room_data.tutor.id=="undefined" || room_data.tutor.id == "") && req.user.type === "Tutor"){
			room_data = await addTutor(req.user._id, room_data);
		}
		else
			tutor_data   = await findTutor (room_data.tutor.id) ;
		console.log("=========get room info ===========");
		console.log(room_data);
		console.log(ques_data);
		console.log(student_data);
		console.log(tutor_data);
		console.log("===================================");
		// res.contentType(ques_data.image.contentType);
		// res.send(ques_data.image.data);
		// res.render("./dash/room.ejs",{room_data : room_data, ques_data : ques_data, student_data : student_data, tutor_data : tutor_data, userDetails:req.user, room_id:req.params.id});
		if((room_data.tutor.id == null || room_data.tutor.id=="undefined" || room_data.tutor.id == "") && req.user.type != "Tutor"){
			req.flash("error","\t\t\tNo Tutor assigned Yet !");
			res.redirect("/dash/"+req.user._id);
		}
		else
			res.render("./chat/index.html",{room_data : room_data, ques_data : ques_data, student_data : student_data, tutor_data : tutor_data, userDetails:req.user, room_id:req.params.id});
	}
	getRoomInfo () ;
});
// DELETE Room details
router.get("/room/:id/ques/:id2/delete",middleware.isLoggedIn,function(req,res){
	//console.log("OWNERSHIP GOT")
	function findRoom() {
		return new Promise(function(resolve, reject) {
			PrivateRoom.findById(req.params.id,function(err,data){
				if(err)
				console.log(err);
				else
				{
					//console.log("FOUND ROOM");
					console.log("printing details====\n "+data);
					resolve(data);
				}	
			});	
		})
	}
	function deleteRoom(room_data) {
		return new Promise(function(resolve, reject) {
			PrivateRoom.findByIdAndRemove(req.params.id,function(err){
				if(err)
					console.log(err);
				else{
					Question.findByIdAndRemove(req.params.id2,function(err){
						if(err)
							console.log(err);
						else
							resolve("DONE");
					});
				}
			});	
		})
	}
	async function deleteThis() {
		var room_data    = await findRoom () ;
		var del   		 = await deleteRoom (room_data) ;
		res.redirect("/dash/"+room_data.student.id);
	}
	deleteThis();
	});
// exporting router
module.exports=router;