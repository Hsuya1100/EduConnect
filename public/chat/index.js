// location.reload();
console.log("URL2 "+window.location);
var roomid='';
var userid='';
roomid = document.getElementById('rid').textContent;
userid = document.getElementById('uid').textContent
console.log("intial details "+roomid+ " " + userid);
// function processid(data) {
//     roomid = data[0];
//     userid = data[1];
//     console.log("room use "+roomid+" "+userid);
// }

$('.chat-header .menu ').click(function(){
    $('.chat-header .menu ul.list').slideToggle('fast');
});
$(document).click(function(){
    // console.log("U "+12);
    $(".chat-header .menu ul.list").slideUp('fast');
});
$(".chat-header .menu ul.list,.chat-header .menu ").click(function(e){
    e.stopPropagation();
});
$('.chat-inp .emoji').click(function(){
    $('.emoji-dashboard').slideToggle('fast');
    console.log("1");
});

$(document).click(function(){
    $(".emoji-dashboard").slideUp('fast');
    // console.log("3");
});
$(".chat-header .menu ul.list,.chat-inp .emoji").click(function(e){
    // console.log("2");
    e.stopPropagation();
});



$('input,.input').each(function(){
    tmpval = $(this).text().length;
    if(tmpval != '') {
        $(this).prev().addClass('trans');
        $(this).parent().addClass('lined');
    }
});
$('.input').focus(function() {
    $(this).prev().addClass('trans');
    $(this).parent().addClass('lined');
    $(document).keypress(function(e) {
        if(e.which == 13) {
    //         $('.chat-inp .opts .send').click();
        }
    });
}).blur(function() {
    if ($(this).text().length == ''){
        $(this).prev().removeClass('trans');
        $(this).parent().removeClass('lined');
    }
});

var i=0;

$(function(){
    // const roomid = roo;
    // const userid = use;
    console.log("AA GAYA");
    var socket = io.connect();
    console.log(userid+" "+roomid);
// ========================================
// let Peer = require('simple-peer')
// // // let socket =  io.connect();
const video         = document.querySelector('video')
// const filter        = document.querySelector('#filter')
const checkboxTheme = document.querySelector('#theme')
const StopButton    = document.querySelector('#stop_him')
const PlayPause     = document.querySelector('#pause_me')
const exitRoom     = document.querySelector('#exit_peer')
console.log(checkboxTheme)
console.log(StopButton)
console.log(PlayPause)
console.log(exitRoom)
PlayPause.style.display="hidden";
StopButton.style.display="hidden";
StopButton.textContent="start/stop";
let client = {}
let currentFilter
function funcModal(){
  let nn =confirm("Accept Video Call !");
  return nn;
}
//get stream
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
        socket.emit('NewClient',{roomid, userid});
        console.log("emitted newclient " + roomid +" " + userid);
        console.log(stream);
        video.srcObject = stream;
        video.play();
        
        filter.addEventListener('change', (event) => {
          console.log("ECHECHEC--------------");
            currentFilter = event.target.value
            video.style.filter = currentFilter
            SendFilter(currentFilter)
            event.preventDefault
          })
          
          // start stop
          StopButton.addEventListener('click', () => {
            console.log("START STOP : ");
            console.log(client.peer);
            console.log(video.srcObject);
            if(video.srcObject.getTracks()[1].enabled == true || video.srcObject.getTracks()[0].enabled == true)
            {
              console.log("1");
              video.srcObject.getTracks()[0].enabled = false;
              video.srcObject.getTracks()[1].enabled = false
              socket.emit('disconnect');
            }
            else if(client.peer == null || client.peer == "undefined" || client.peer == undefined || video.srcObject == null|| video.srcObject == "undefined"|| video.srcObject == undefined)
            {
              console.log("2");
              if(video.srcObject != undefined){
                console.log("2.5");
                video.srcObject.getTracks()[0].enabled = true;
                video.srcObject.getTracks()[1].enabled = true;
              }
              socket.emit('NewClient',{roomid, userid});
            }
            else{
              console.log("3");
              video.srcObject.getTracks()[0].enabled = true;
              video.srcObject.getTracks()[1].enabled = true;
              socket.emit('NewClient',{roomid, userid});
            }

        })
        //  Play pause
        console.log("PLAY--------------");
        exitRoom.addEventListener('click', () => {
          let peervid = document.getElementById('peerVideo');
          if(peervid.srcObject != null || peervid.srcObject != "undefined" ){
              console.log("exting with removing peer");
              peervid.srcObject = null;
              client.peer = null;
              video.srcObject = null;
              peervid.remove();
            }
        })
        console.log("PLAY--------------");
        PlayPause.addEventListener('click', () => {
          if(PlayPause.textContent == "pause" ){
            socket.emit('play',{roomid, userid});
            PlayPause.textContent = "play";
          }
          else{
            socket.emit('pause',{roomid, userid});
            PlayPause.textContent = "pause";
          }
        })
        
        

        //used to initialize a peer
        function InitSimplePeer(type) {
            let peer = new SimplePeer({ initiator: (type == 'init') ? true : false, stream: stream, trickle: false })
            peer.on('stream', function (stream) {
                CreateVideo(stream);
                PlayPause.style.display = "";
                PlayPause.textContent = "pause";
                StopButton.style.display = "";

            })
          
            peer.on('data', function (data) {
                let decodedData = new TextDecoder('utf-8').decode(data)
                let peervideo = document.querySelector('#peerVideo')
                peervideo.style.filter = decodedData
            })
            return peer
        }

        //for peer of type init
        function MakeSimplePeer(details) {
          console.log("makesimplepeer");
          console.log(roomid," ",details.roomid);
          console.log(userid," ",details.userid);
          console.log(roomid == details.roomid );
          // if(roomid === details.roomid && details.userid != userid){
            client = {};
            client.gotAnswer = false;
            let peer = InitSimplePeer('init');
            peer.on('signal', function (data) {
              console.log("signal recieved0");
                let ans = funcModal();
                if (!client.gotAnswer && ans == true) {
                    socket.emit('Offer', data)
                }
            })
            client.peer = peer
          // }
        }

        //for peer of type not init
        function FrontAnswer(offer) {
            let peer = InitSimplePeer('notInit')
            peer.on('signal', (data) => {
                socket.emit('Answer', data)
            })
            peer.signal(offer)
            client.peer = peer
        }

        function SignalAnswer(answer) {
            client.gotAnswer = true
            let peer = client.peer
            peer.signal(answer)
        }

        function CreateVideo(stream) {
            CreateDiv()

            var vid = document.createElement('video')
            vid.id = 'peerVideo'
            vid.srcObject = stream
            vid.srcObject.active = true
            vid.setAttribute('class', 'embed-responsive-item')
            document.querySelector('#peerDiv').appendChild(vid)
            vid.play()
            
            setTimeout(() => SendFilter(currentFilter), 1000)
        }
        function SessionActive() {
            document.write('Session Active. Please come back later')
        }

        function SendFilter(filter) {
          if (client.peer) {
            client.peer.send(filter)
          }
        }
        function funcPause(data) {
          let peervid = document.getElementById('peerVideo');
          if(peervid == null || peervid == "undefined" || roomid !=data.roomid){
            console.log("BHAK");
          }
          else{
            if(peervid.srcObject.getTracks()[0].enabled == false){
              peervid.srcObject.getTracks()[0].enabled = true;
              // PlayPause.textContent="pause";
            }
            if(peervid.srcObject.getTracks()[1].enabled == false){
              peervid.srcObject.getTracks()[1].enabled = true;
              // PlayPause.textContent="pause";
            }
          }
        }
        function funcPlay(data) {
          let peervid = document.getElementById('peerVideo');
          if(peervid == null || peervid == "undefined" || roomid !=data.roomid){console.log("BHAK 2")}
          else{
            if(peervid.srcObject.getTracks()[0].enabled == true){
              peervid.srcObject.getTracks()[0].enabled = false;
              // PlayPause.textContent="play";
            }
            if(peervid.srcObject.getTracks()[1].enabled == true){
              peervid.srcObject.getTracks()[1].enabled = false;
              // PlayPause.textContent="play";
            }
          }
        }
        function startSess(data) {
          let peervid = document.getElementById('peerVideo');
          if(peervid == null || peervid == "undefined"){
            console.log("BHAK 2")
            // socket.emit('NewClient');
            // StopButton.textContent="stop";
          } 
          else{
            console.log("start else")
            // if(roomid ===data[0]){
              peervid.srcObject.active = true;
              StopButton.textContent="stop";
              // }
          }
        }
        function stopSess(data) {
          let peervid = document.getElementById('peerVideo');
          if(peervid == null || peervid == "undefined" ){console.log("BHAK 2")}
          else{
            console.log("STOPPING:");
            peervid.srcObject.active = false;
            StopButton.textContent="start";
          }
        }
        function setsrc(data){
          vid.srcObject.active = data;
        }
        function newAgain(data){
          // if(roomid == data.roomid)
          console.log("NEW AGAIN "+data+" in room "+roomid+" "+userid);
            socket.emit('NewClient',{roomid, userid});
        }
        
        function reConnect(rid){
          if(roomid == rid){
            console.log("Reconnect "+rid+" in room "+roomid+" "+userid);
            socket.emit('NewClient',{roomid, userid});
          }
        }
        // function funcretrievePause(data){
        //   if(roomid == data.roomid){
        //     PlayPause.textContent = "pause";
        //   }
        // }
          //This isn't working in chrome; works perfectly in firefox.
       
          function RemovePeer(rid) {
            if(rid == roomid){
              if (client.peer) {
                client.peer.destroy()
              }
              client = {};
              document.getElementById("peerVideo").remove();
            }
        }
        socket.on('BackOffer', FrontAnswer)
        socket.on('BackAnswer', SignalAnswer)
        socket.on('SessionActive', SessionActive)
        socket.on('CreateSimplePeer', MakeSimplePeer)
        socket.on('pause', funcPause)
        socket.on('play', funcPlay)
        socket.on('stop', stopSess)
        socket.on('newagain', newAgain)
        socket.on('reconnect', reConnect)
        // socket.on('deleteyourConf', destroyConf)
        socket.on('Disconnect', RemovePeer)

        // socket.on('retrievePause', funcretrievePause)
        // socket.on('start', startSess)

    })
    .catch(err => document.write(err))

    
checkboxTheme.addEventListener('click', () => {
  console.log("ECHECHEC--------------");
    if (checkboxTheme.checked == true) {
        document.body.style.backgroundColor = '#212529'
        // $(.divboard .divchat).style.backgroundColor = '#212529'
        if (document.querySelector('#muteText')) {
            document.querySelector('#muteText').style.color = "#fff"
        }

    }
    else {
        document.body.style.backgroundColor = '#fff'
        // $(.divboard .divchat).style.backgroundColor = '#212529'
        if (document.querySelector('#muteText')) {
            document.querySelector('#muteText').style.color = "#212529"
        }
    }
}
)
    console.log("CHEC--------------");

function CreateDiv() {
    let div = document.createElement('div')
    div.setAttribute('class', "centered")
    div.id = "muteText"
    div.innerHTML = "Click to Mute/Unmute"
    document.querySelector('#peerDiv').appendChild(div)
    if (checkboxTheme.checked == true)
        document.querySelector('#muteText').style.color = "#fff"
}

// ========================================
var canvas = document.getElementsByClassName('whiteboard')[0];
  var colors = document.getElementsByClassName('color');
  var context = canvas.getContext('2d');

  var current = {
    color: 'black'
  };
  var drawing = false;

  canvas.addEventListener('mousedown', onMouseDown, false);
  canvas.addEventListener('mouseup', onMouseUp, false);
  canvas.addEventListener('mouseout', onMouseUp, false);
  canvas.addEventListener('mousemove', throttle(onMouseMove, 10), false);
  
  //Touch support for mobile devices
  canvas.addEventListener('touchstart', onMouseDown, false);
  canvas.addEventListener('touchend', onMouseUp, false);
  canvas.addEventListener('touchcancel', onMouseUp, false);
  canvas.addEventListener('touchmove', throttle(onMouseMove, 10), false);

  for (var i = 0; i < colors.length; i++){
    colors[i].addEventListener('click', onColorUpdate, false);
  }

  socket.on('drawing', onDrawingEvent);

  window.addEventListener('resize', onResize, false);
  onResize();


  function drawLine(x0, y0, x1, y1, color, emit){
    context.beginPath();
    xadj = 327;
    yadj = 127;
    context.moveTo(x0-xadj, y0-yadj);
    context.lineTo(x1-xadj, y1-yadj);
    console.log("\n");
    context.strokeStyle = color;
    context.lineWidth = 4;
    context.stroke();
    context.closePath();

    if (!emit) { return; }
    var w = canvas.width;
    var h = canvas.height;

    socket.emit('drawing', {
      x0: x0 / w,
      y0: y0 / h,
      x1: x1 / w,
      y1: y1 / h,
      color: color,
      roomid:roomid,
      userid:userid
    });
  }

  function onMouseDown(e){
    drawing = true;
    current.x = e.clientX||e.touches[0].clientX;
    current.y = e.clientY||e.touches[0].clientY;
    console.log("DOWN: "+ e.clientX +" "+e.clientY);
  }

  function onMouseUp(e){
    if (!drawing) { return; }
    drawing = false;
    console.log("UP: "+ e.clientX +" "+e.clientY);
    drawLine(current.x, current.y, e.clientX||e.touches[0].clientX, e.clientY||e.touches[0].clientY, current.color, true);
  }

  function onMouseMove(e){
    if (!drawing) { return; }
    console.log("MOVING1: "+ current.x +" "+current.y);
    console.log("MOVING2: "+ e.clientX +" "+e.clientY);
    drawLine(current.x, current.y, e.clientX||e.touches[0].clientX, e.clientY||e.touches[0].clientY, current.color, true);
    current.x = e.clientX||e.touches[0].clientX;
    current.y = e.clientY||e.touches[0].clientY;
  }

  function onColorUpdate(e){
    current.color = e.target.className.split(' ')[1];
  }

  // limit the number of events per second
  function throttle(callback, delay) {
    var previousCall = new Date().getTime();
    return function() {
      var time = new Date().getTime();

      if ((time - previousCall) >= delay) {
        previousCall = time;
        callback.apply(null, arguments);
      }
    };
  }

  function onDrawingEvent(data){
    if(data.roomid == roomid){
      var w = canvas.width;
      var h = canvas.height;
      drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color);
    }
  }

  // make the canvas fill its parent
  function onResize() {
    canvas.width = 800;
    canvas.height = 700;
  }

  function sendintext() {
        i=i+1;
        var val = $('.chat-inp .input').html();
        // console.log("val "+val);
        var n = val.indexOf("<div><br>");
        var mess = val;
        console.log(i+" "+"MESSAGE"+mess);
        if(i == 1){
            mess = val;
        }
        data = {mess:mess, roomid:roomid, userid:userid};
        socket.emit('send message',data);
    }
    // input emoji

    $('.emoji-dashboard li .em').click(function(){
        var emo = $(this).css('background-image').split('"')[1];
        $('.chat-inp .input').append('<img src="'+emo+'">');
        $(".emoji-dashboard").slideUp('fast');
     });
    // click send
    $('.input').keypress(function(e) {
        if(e.which == 13) {
            sendintext();
        }
    });
    $('.chat-inp .opts .send').click(function(){
        sendintext();
    });
    
    socket.on('new message', function(data){
        console.log(data.msg);
        console.log("USERID "+userid)
        console.log("DATA USERID "+data.userid)
        console.log("DATA_ROOMID "+data.roomid)
        console.log("ROOMID "+roomid)
        if (data.msg.length > 0 && data.roomid === roomid && data.userid === userid){
            $('.chat-body .chats-text-cont').append('<p class="chat-text"><span>'+data.msg+'</span></p>')
        }
        else if (data.msg.length > 0  && data.roomid === roomid && data.userid != userid ){
            $('.chat-body .chats-text-cont').append('<p class="chat-text"><span style="background-color:gray !important">'+data.msg+'</span></p>')
        }
        $('.chat-inp .input').html('');
        $('.chats-text-cont div').remove();
    })


});
var modal = document.getElementById("myModal");
var modal2 = document.getElementById("myModal2");

function clickmodal(){
  // modal.click();
  modal.classList.remove("nodisp");
  modal.classList.add("disp");
}
function clickmodal2(){
  // modal.click();
  modal2.classList.remove("nodisp");
  modal2.classList.add("disp");
}
// Get the image and insert it inside the modal - use its "alt" text as a caption
var img = document.getElementById("myImg");
var modalImg = document.getElementById("img01");
var captionText = document.getElementById("caption");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
var span2 = document.getElementsByClassName("close2")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() { 
  // modal.style.display = "hidden";
  modal.classList.remove("disp");
  modal.classList.add("nodisp");
  console.log(span);
  console.log(modal);
}
span2.onclick = function() { 
  // modal.style.display = "hidden";
  modal2.classList.remove("disp");
  modal2.classList.add("nodisp");
  console.log(span2);
  console.log(modal2);
}