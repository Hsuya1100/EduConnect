var express=require('express');
var router=express.Router({mergeParams: true});;
var methodOverride=require("method-override");
var flash=require('connect-flash');
router.use(flash());
router.use(methodOverride("_method"));
var Question=require('../models/Question.js');
var User=require("../models/user.js");
var middleware=require("../middleware");
var multer = require('multer');
var PrivateRoom=require("../models/PrivateRoom.js");



// VIEW PROFILE
router.get("/profile/:id",middleware.isLoggedIn, function(req,res){
    console.log("VIEW PROFILE"+req.params.id);
    user_id = req.params.id;
    User.findById(user_id,function(err,user_data){
        console.log("USER DATA "+user_data);
        if(err)
        console.log(err);
        else{
            console.log("CURRENT DATA PUT PROFILE ===> ");
            console.log(user_data.name);
            console.log(user_data.type);
            console.log(user_data.std);
            console.log(user_data.subjects);
            console.log(user_data.bio);
            res.render("./user/edit.ejs",{user_id:user_id, user_data:user_data});	
        }
    });
});

// POST UPDATE PROFILE
router.put("/profile/:id",middleware.isLoggedIn,function(req,res){
	var user_id=req.params.id;
    var name = req.body.name;
    var type = req.body.type;
    var std = req.body.std;
    var subjects = req.body.subjects;
    var bio = req.body.bio;
	var new_user_data={ 
        name     : name,
        type     : type,
        std     : std,
        subjects : subjects,
        bio      : bio
    };

    console.log("NEW DATA PUT PROFILE ===> "+user_id+" "+req.params.id);
    console.log(name);
    console.log(type);
    console.log(std);
    console.log(subjects);
    console.log(bio);
    
    User.findByIdAndUpdate(user_id,new_user_data,function(err,data){
		if(err)
			console.log("Couldnt Create USER data in DB");
		else
			res.redirect("/dash/"+user_id);
		});
    console.log("PUT PROFILE");
    });
        
module.exports = router;