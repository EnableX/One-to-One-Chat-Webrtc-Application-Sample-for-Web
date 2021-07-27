/// ////////////////////////////////////////////////////
//
// File: confo.js
// This is the main application file for client end point. It tries to use Enablex Web Toolkit to
// communicate with EnableX Servers
//
/// //////////////////////////////////////////////////

let username = null;
let myFiles = null;
let id = null;
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

    for (i = 0; i < pairs.length; i += 1) {
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
    room.addEventListener('fs-download-result', (event) => {
      const msg = event.message;
      switch (msg.messageType) {
        case 'download-started':
          // Note msg.jobId for cancellation
          // download-started event JSON Example given below
          break;
        case 'download-completed':
          // Know msg.jobId is completed
          // download-completed event JSON Example given belowbreak;
          break;
        case 'download-failed':
          // Know msg.jobId has failed
          // download-failed event JSON Example given belowbreak;
          break;
        default:
          break;
      }
    });
    room.addEventListener('fs-upload-result', (event) => {
      const msg = event.message;
      switch (msg.messageType) {
        case 'upload-started':
          // Note msg.upJobId for management
          // upload-started event JSON Example given below
          break;
        case 'upload-completed':
          // Know msg.upJobId is completed
          // upload-completed event JSON Example given belowbreak;
          break;
        case 'upload-failed':
          // Know msg.upJobId has failed
          // upload-failed event JSON Example given belowbreak;
          break;
        default:
          break;
      }
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

// Filesharing

const shareOptions = {
  isMobile: false,
  broadcast: true,
  // "clientList": clientList
};

const pullfiles = function () {
  const fileInput = document.querySelector('#myfiles');
  const { files } = fileInput;
  room.sendFiles(files, shareOptions, (resp) => {
    if (resp.result == '0') { // Success JSON Example given below
      id = resp.response.upJobId;
    } else {	// Error JSON Example given below
    }
  });
};

function download() {
  myFiles = room.availableFiles;
  if (myFiles.length !== 0) {
    for (let i = 0; i < myFiles.length; i++) {
      room.recvFiles(myFiles[i].index, {}, (resp) => {
        if (resp.result == '0') { // Success JSON Example given below
        } else {	// Error JSON Example given below
        }
      });
    }
  } else {
    alert('No files to download');
  }
}
