const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");
var filename=id+".txt";
const uID = sessionStorage.getItem("usrID");
var crntmsg=0;
var ttlmsg=0;
const BOT_IMG = "https://image.flaticon.com/icons/svg/327/327779.svg";
const PERSON_IMG = "https://image.flaticon.com/icons/svg/145/145867.svg";
const PERSON_NAME = sessionStorage.getItem("name");
var id = sessionStorage.getItem("chatid");
var user = PERSON_NAME;
window.onload = function(){
  countlines(id);
  read();
  setInterval(read,20);
  document.getElementById("shareframe").src="/share?id="+id;
}


function countlines(a){
if (spaces(a)==false){
$.ajax({
    url: '/countlines',
    type: "GET",
    data:{"file":a},
    success: function(data) {
        ttlmsg=(data.count);
    },
    error: function (error) {
        alert(error);
    }
});
} else{console.log('invalid chat ID ! Join using a valid link')}
}


function read(){
  countlines(id);
  var a= crntmsg;
  var b=ttlmsg;
  if(a<=b){
    for(var p=a;p<b;p++){
      getmsgs(p);
    }
   crntmsg=b;
  }
}

function getmsgs(i){
  var a=id;
$.ajax({
    url:'/getline',
    type: "GET",
    data:{"file":a,"line":i},
    success: function (result) {
        var msg = result;
        console.log(msg.msg);
        setmsgs(msg.msg);
    },
    error: function (result) {
        erroroccour();
    }
});
}

msgerForm.addEventListener("submit", event => {
  event.preventDefault();

  const msgText = msgerInput.value;
  if (!msgText) return;

send(id,user,uID,msgText,getDate(),formatDate(new Date()));
  msgerInput.value = "";
});


function send(a,b,c,d,e,f){
    var arr = [b,c,d,e,f];
  var encTxt = CryptoJS.AES.encrypt(JSON.stringify(arr),a).toString();

  $.ajax({
            url:"/chat",
            type: "post",
            dataType: 'json',
            data:{a: a,b:encTxt},
            success:function(result){
                countlines(result.x);
		console.log('message sent');
         },
         error:function(result){
                       erroroccour();
                       countlines(result.x);

                    }
     });
}


function setmsgs(msg){

  var bytes  = CryptoJS.AES.decrypt(msg, id);
var msgObj = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));


//  var msgObj=JSON.parse(msg);
 var avatar;
 var side;
 if(msgObj[1]==uID){
   avatar = PERSON_IMG;
   side="right";
 } else{
   avatar = BOT_IMG;
   side="left";
 }

  appendMessage(msgObj[0], avatar,side, msgObj[2],msgObj[4]);

}


   function erroroccour(){

       alert("Some error occoured !");

     }


function appendMessage(name, img, side, text,time) {
  const msgHTML = `
    <div class="msg ${side}-msg">
      <div class="msg-img" style="background-image: url(${img})"></div>

      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${name}</div>
          <div class="msg-info-time">${time}</div>
        </div>

        <div class="msg-text">${text}</div>
      </div>
    </div>
  `;

  msgerChat.insertAdjacentHTML("beforeend", msgHTML);
  msgerChat.scrollTop += 500;
}


function sharethis(){

document.getElementById('sharepopup').style.zIndex="99";
document.getElementById('sharepopup').style.display="flex";
document.getElementById('closebtn').style.display="block";

}


function closeshare(){
  document.getElementById('sharepopup').style.zIndex="-99";
document.getElementById('sharepopup').style.display="none";
document.getElementById('closebtn').style.display="none";
}




// Utils
function get(selector, root = document) {
  return root.querySelector(selector);
}

function formatDate(date) {
  const h = "0" + date.getHours();
  const m = "0" + date.getMinutes();

  return `${h.slice(-2)}:${m.slice(-2)}`;
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function getDate(){
    var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = mm + '/' + dd + '/' + yyyy;

return today;
}

function generateId() {
       var pass = '';
       var str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
               'abcdefghijklmnopqrstuvwxyz0123456789';
       for (i = 1; i <= 10; i++) {
           var char = Math.floor(Math.random()
                       * str.length + 1);
           pass += str.charAt(char)
       }
       return pass;
   }

function spaces(str){
if (!str.replace(/\s/g, '').length) {
  return true;
} else {
return false;
}
}
