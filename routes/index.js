var express=require('express');
var router=express.Router();
var passport=require('passport');
var User=require("../models/user.js");
var flash=require('connect-flash');
var middleware=require("../middleware/index.js");
var multer = require('multer');
var PrivateRoom=require("../models/PrivateRoom.js");


router.use(flash());
//Root
router.get('/',function(req,res){
	res.redirect("/dash");
});

//====AUTHENTICATION ROUTES========================

// register
router.get("/register",function(req,res){
	res.render("register.ejs");
});

// POST register
router.post("/register",function(req,res){
	console.log("registered");
	var newUser=new User({username:req.body.username});
	var userPassword=req.body.password;
	User.register(newUser,userPassword,function(err,user){
		if(err){
			console.log(err);
			return res.render("register.ejs");
		}
		passport.authenticate("local")(req,res,function(){
			res.redirect("/dash/"+req.user._id);
		});
	});
});

// Login Page
router.get("/login",function(req,res){
	console.log("log get");
	res.render("login.ejs");
});
// POST Login_Credentials
router.post("/login",passport.authenticate("local"),
	function(req,res){
		console.log(req.user._id.toString());
		
			if(req.user._id.toString() && req.user._id.toString().length>0)
				{
					req.flash("success","You are successfully logged in");
				res.redirect("/dash/"+req.user._id);
				}

			else
			{
				req.flash("error","Please log in first");
				res.redirect("/login");
			}
});

// LOGOUT
router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","You are logged out");
	res.redirect("/");
});

/*function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
};
*/
// exporting router
module.exports=router;