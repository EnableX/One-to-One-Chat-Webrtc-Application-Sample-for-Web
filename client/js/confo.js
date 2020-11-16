/// ////////////////////////////////////////////////////
//
// File: confo.js
// This is the main application file for client end point. It tries to use Enablex Web Toolkit to
// communicate with EnableX Servers
//
/// //////////////////////////////////////////////////

let username = null;
let room;
// Player Options

window.onload = function () {
  // URL Parsing to fetch Room Information to join

  const parseURLParams = function (url) {
    const queryStart = url.indexOf('?') + 1;
    const queryEnd = url.indexOf('#') + 1 || url.length + 1;
    const query = url.slice(queryStart, queryEnd - 1);
    const pairs = query.replace(/\+/g, ' ').split('&');
    const parms = {}; let i; let n; let v; let
      nv;

    if (query === url || query === '') return;

    for (i = 0; i < pairs.length; i++) {
      nv = pairs[i].split('=', 2);
      n = decodeURIComponent(nv[0]);
      v = decodeURIComponent(nv[1]);

      if (!parms.hasOwnProperty(n)) parms[n] = [];
      parms[n].push(nv.length === 2 ? v : null);
    }
    return parms;
  };
  const urlData = parseURLParams(window.location.href);

  // Function: To create user-json for Token Request
  const createDataJson = function (url) {
    const urlData = parseURLParams(url);
    username = urlData.user_ref[0];
    const retData = {
      name: urlData.user_ref[0],
      role: urlData.usertype[0],
      roomId: urlData.roomId[0],
      user_ref: urlData.user_ref[0],
    };
    return retData;
  };
  // Function: Create Token

  createToken(createDataJson(window.location.href), (response) => {
    const token = response;
    room = EnxRtc.EnxRoom({ token });
    room.connect();

    room.addEventListener('room-connected', (data) => {
      room.addEventListener('message-received', (data) => {
        console.log(data);
        const obj = {
          msg: data.message.message,
          username: data.message.sender,
        };
        plotChat(obj);
      });
    });
  });
};

function sendChat(event) {
  if (event.keyCode === 13) {
    addText();
  }
}
function addText() {
  let text = document.getElementById('chat-text-area').value;
  const elem = document.getElementById('chat-message');

  if (/<[a-z][\s\S]*>/i.test(text)) {
    text = `'${text}'`;
  }
  if (text !== '') {
    const template = createChatText(text);
    $(template).appendTo(elem);
    document.getElementById('chat-text-area').value = '';
    sendChatToServer(text);
  }
}
function sendChatToServer(text) {
  room.sendMessage(text, true, [], () => {

  });
}
function createChatText(text) {
  const f_name = username;
  const name = username.slice(0, 1);
  const template = `${'<li class="right clearfix"><span class="chat-img pull-right">'
        + '</span>'
        + '<div class="chat-body clearfix">'
        + ' <div class="header1">'
        + ' <strong class=" primary-font">'}${f_name}</strong>: `

        + `<span>${text} </span>`
        + ' </div>'
        + '</div>'
        + '</li>';

  return template;
}

function plotChat(obj) {
  const f_name = obj.username;
  const name = obj.username.slice(0, 1);
  const template = `${' <li class=" clearfix">'
        + '<span class="chat-img pull-left">'
        + '</span>'
        + '<div class="chat-body clearfix">'
        + '<div class="header1">'
        + '<strong class="primary-font">'}${f_name}</strong>:  `
        + `<span>${obj.msg} </span>`
        + ' </div>'
        + '</div>'
        + ' </li>';

  const elem = document.getElementById('chat-message');
  $(template).appendTo(elem);
}
