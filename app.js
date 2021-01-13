var express=require('express');
var app=express();
// // used for req.body 
var bodyParser=require('body-parser');
var mongoose=require('mongoose');
// // for authentication
var passport=require('passport');
var LocalStrategy=require('passport-local');
var flash=require('connect-flash');
var path=require('path');
var multer = require('multer');
// var request=require('request');

// var express = require('express')
// var app = express()

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

// app.get('/', function(request, response) {
//   response.send('Hello World!')
// })

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})


// // SOCKET 
// const socket = require("socket.io");
// // SERVER
// app.set('port', (process.env.PORT || 5000));
// var server = app.listen(app.get('port'));
// console.log("server running");
// // for socket
// const io = socket.listen(server);
//__dirname is whole directory name  
app.use(express.static(path.join(__dirname, 'public')));
console.log(__dirname);
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/uploads',express.static(__dirname + "/uploads"));
app.use(express.static(path.join(__dirname + "/views")));
app.use(express.static(path.join(__dirname + "/chat")));


// // MONGODB

// //mongoose.connect("mongodb://localhost/EduConnect", { useNewUrlParser: true, useUnifiedTopology: true  },function(err,db){
// //	if(err)
// //		console.log(err);
// //	else
// //		console.log("Connected to DB");
// //});
// // =============================================================
//  const uri = "mongodb+srv://admin:admin@cluster0-bdcbs.mongodb.net/EduConnect?retryWrites=true&w=majority"
//   mongoose.connect(uri,{useNewUrlParser: true}, function(err, client) {
//      if(err) {
//           console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
//     }
//     console.log('Connected..D.B.');
//  });
// // =============================================================

// app.use(flash());
// app.use(bodyParser.json({limit: '6mb'}));
// app.use(bodyParser.urlencoded({limit: '6mb',  extended: true,parameterLimit: 1000000}));

// //Require Question Schema
// var Question=require("./models/Question.js");
// var PrivateRoom=require("./models/PrivateRoom");

// // User Schema
// var User=require('./models/user.js'); 
// // var middleware=require("../middleware/index.js");

// // Shortened Routes codes Required
// var  DashboardRoutes=require('./routes/dashboard.js');
// var  userRoutes=require('./routes/user.js');
// var  indexRoutes=require('./routes/index.js');

// //==========================================

// // PASSPORT CONFGI
// app.use(require("express-session")({
// 	secret:"NEWHASHKEY",
// 	resave:false,
// 	saveUninitialized:false
// }))	;
// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// app.use(function(req,res,next){
// 	res.locals.userDetails=req.user;
// 	res.locals.error=req.flash("error");
// 	res.locals.success=req.flash("success");
// 	next();
// });

//================================================
app.get("/",function(req,res){
	console.log("ROOT REACHED!");
	res.render("cover.ejs");
});
// //Refactored routes use
// app.use(indexRoutes);
// app.use("/dash",DashboardRoutes);
// app.use("/user",userRoutes);


// // SOOCKET CODES
// var connections = []
// let clients = 0;
// var roommap = new Map();
// var Roomsroom = new Map();

// // ON CONNECTION ESTABLISH
// io.sockets.on("connection", socket => {
//     console.log("new user joined");
//     socket.emit('chat-message','user id send');
// 	connections.push(socket);
// 	socket.on("NewClient", function (data) {
//         console.log("NEW CLIENT RECIEVED");
//         console.log(data);
//         if(roommap.has(data.roomid)){
//             console.log("entry has true");
//             let arr = roommap.get(data.roomid);
//             //making room full
//             if(arr.length == 1){
//                 console.log("single entry pushed " +data.roomid);
//                 arr.push(data.userid);
//                 console.log(arr)
//                 Roomsroom.set(socket,data.roomid);
                
//                 console.log("Emitting create simple peer ");
//                 this.emit('CreateSimplePeer',data)
//                 console.log("1+1 new if from " + data.roomid+","+data.userid +" "  + roommap.get(data.roomid));
//                 roommap.set(data, arr);
//                 console.log("1+1 new if from " + data.roomid+","+data.userid +" " + roommap.get(data.roomid));
//                 clients++;
//             }
//             else if(arr.length == 2){
//                 // roommap.delete(data.roomid);
//                 console.log("DELETED=================");
//                 // this.broadcast.emit('newagain', data);
//             }
//         }
//         else{//room only one user
//             arr = new Array(data.userid);
//             // let arr2 = new Array(socket);
//             console.log("new roommap made");
//             roommap.set(data.roomid,arr);
//             console.log(roommap.get(data.roomid));
//             Roomsroom.set(socket.id,data.roomid);
//             console.log("new Roomsroom made");
//             console.log(roommap.get(data.roomid));
//             console.log(socket.id +" "+ data.roomid);
//             clients++;
//         }
//     })
//     socket.on('play', Play)
//     socket.on('pause', Pause)
//     socket.on('start', startSess)
//     socket.on('stop', stopSess)
//     socket.on('Offer', SendOffer)
//     socket.on('Answer', SendAnswer)
//     socket.on('deleteyourConf', informOther)
//     // socket.on('dis', dara)
// // recieves message from chatroom
//     socket.on('send message', (data) => {
//         console.log(data.mess);
//         console.log(data.roomid);
//         console.log(data.userid);
// 	// emits message to all chat room
// 		io.sockets.emit('new message', {msg : data.mess, roomid:data.roomid, userid:data.userid});
// 	});
// 	socket.on('drawing', (data) => socket.broadcast.emit('drawing', data));

//     console.log("Connected : %s sockets connected", connections.length);
// //    DISCONNECT
// 	socket.on('disconnect', (data) => {
//         console.log(data);
//         if(Roomsroom.has(socket.id)){
//             let rid = Roomsroom.get(socket.id);
//             for (const [key, value] of Roomsroom.entries()) {
//                 console.log(key, value);
//                 if(value == rid) {
//                     console.log("deleted "+key+" " +value);
//                     Roomsroom.delete(key);
//                 }
//             }
//             console.log("Roommap entry removeed "+rid);
//             roommap.delete(rid);
//             console.log("Braodcast new clientt ");
//             // this.emit.broadcast("reconnect", rid);
            
//         }
//         connections.splice(connections.indexOf(socket),1);
//         console.log(connections);
//         console.log("DISconnected : %s sockets connected", connections.length);
//         // if (clients > 0)
//         //         if(this != "undefined" || this != null || this != undefined || this.broadcast != "undefined" || this.broadcast != null || this.broadcast != undefined)
//         //             this.broadcast.emit("Disconnect",rid)
//             // clientsrid
    
// 	});
// });


// function SendOffer(data) {
//     this.broadcast.emit("BackOffer", data)
// }

// function SendAnswer(data) {
//     this.broadcast.emit("BackAnswer", data)
// }
// function Play(data) {
//     this.broadcast.emit("play", data)
// }
// function Pause(data) {
//     this.broadcast.emit("pause", data)
// }
// function stopSess(data) {
//     this.broadcast.emit("stop", data)
// }
// function startSess(data) {
//     this.broadcast.emit("start", data)
// }
// function informOther(data) {
//     this.emit("deleteyourConf", data)
// }
