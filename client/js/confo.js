///////////////////////////////////////////////////////
//
// File: confo.js
// This is the main application file for client end point. It tries to use Enablex Web Toolkit to
// communicate with EnableX Servers
//
/////////////////////////////////////////////////////


var username = null;
var room;
// Player Options

window.onload = function () {
    
    // URL Parsing to fetch Room Information to join

    var parseURLParams = function (url) {
        var queryStart = url.indexOf("?") + 1,
            queryEnd = url.indexOf("#") + 1 || url.length + 1,
            query = url.slice(queryStart, queryEnd - 1),
            pairs = query.replace(/\+/g, " ").split("&"),
            parms = {}, i, n, v, nv;

        if (query === url || query === "") return;

        for (i = 0; i < pairs.length; i++) {
            nv = pairs[i].split("=", 2);
            n = decodeURIComponent(nv[0]);
            v = decodeURIComponent(nv[1]);

            if (!parms.hasOwnProperty(n)) parms[n] = [];
            parms[n].push(nv.length === 2 ? v : null);
        }
        return parms;
    }
    var urlData = parseURLParams(window.location.href);

    // Function: To create user-json for Token Request
    var createDataJson = function (url) {
        var urlData = parseURLParams(url);
        username = urlData.user_ref[0];
        var retData = {
            "name": urlData.user_ref[0],
            "role": urlData.usertype[0],
            "roomId": urlData.roomId[0],
            "user_ref": urlData.user_ref[0],
        };
        return retData;

    }
    // Function: Create Token

    createToken(createDataJson(window.location.href), function (response) {
            var token = response;
             room = EnxRtc.EnxRoom({token: token});
             room.connect();

             room.addEventListener("room-connected",function(data){
                room.addEventListener("message-received",function(data){
                    console.log(data);
                    var obj = {
                        'msg': data.message.message,
                        'username': data.message.sender
                    };
                    plotChat(obj);

                })
             })

    });
}

function sendChat(event)
{
    if (event.keyCode === 13) {
        addText();
    }


}
function addText() {
    var text = document.getElementById('chat-text-area').value;
    var elem = document.getElementById("chat-message");

    if (/<[a-z][\s\S]*>/i.test(text)) {
        text = "'" + text + "'";
    }
    if (text !== "") {
        var template = createChatText(text);
        $(template).appendTo(elem);
        document.getElementById('chat-text-area').value = '';
        sendChatToServer(text);
    }
}
function sendChatToServer(text) {

    room.sendMessage(text,true,[],function(){

    })

}
function createChatText(text) {
    var f_name = username;
    var name = username.slice(0,1);
    var template = '<li class="right clearfix"><span class="chat-img pull-right">'+
        '</span>'+
        '<div class="chat-body clearfix">'+
        ' <div class="header1">'+
        ' <strong class=" primary-font">'+f_name+'</strong>: '+

        '<span>'+text+' </span>'+
        ' </div>'+
        '</div>'+
        '</li>';

    return template;
}


function plotChat(obj) {
    var f_name = obj.username;
    var name = obj.username.slice(0,1);
    var template = ' <li class=" clearfix">'+
        '<span class="chat-img pull-left">'+
        '</span>'+
        '<div class="chat-body clearfix">'+
        '<div class="header1">'+
        '<strong class="primary-font">'+f_name+'</strong>:  '+
        '<span>'+obj.msg+' </span>'+
        ' </div>'+
        '</div>'+
        ' </li>';

    var elem = document.getElementById("chat-message");
    $(template).appendTo(elem);


}
