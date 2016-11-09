
var msgCount;

var userIdB = {
  id: null,
  name: null
};

var msgArch = {
  id: null,
  name: null,
  msgs: []
};

var full = false;
var resOk = true;
var mul = 0;

var reqCounter = 0;
var reqCtrl = false;
var startTime = 0;
var limitTimeout;

function vkReqMsg() {
  if (!msgCount) {
    getMsgCount();
    return;
  }
  if (!msgArch.name) {
    msgArch.name = userIdB.name;
    msgArch.id = userIdB.id;
  }
  reqCtrl = limitReq();
  if (reqCtrl) {
    if (mul < msgCount && resOk) {
      resOk = false
      getMessages();
      mul += 200;
    } else {
      saveData();
    }
  }
}

function returnCount(data) {
  msgCount = data.response.count;
  vkReqMsg();
}

function getMsgCount() {
  var method = '/method/messages.getHistory?';
  var token = 'access_token=cf4827da7004140e7d0ea68ae489b98ac153f2cd0a85aaba88c7ab84c1b8eee12f3578cad4d5a69b51a75&';
  var userIdA = 'user_id=55832488&';
  var reqDetails = userIdA + token + 'user_id=' + userIdB.id;
  var request = 'https://api.vk.com' + method + 'v=5.52&' + reqDetails;
  scriptRequest(request, returnCount, fail);
}

function getMessages() {
  var method = '/method/messages.getHistory?';
  var token = 'access_token=cf4827da7004140e7d0ea68ae489b98ac153f2cd0a85aaba88c7ab84c1b8eee12f3578cad4d5a69b51a75&';
  var userIdA = 'user_id=55832488&';
  var offset = 'offset=' + mul + '&';
  var reqDetails = userIdA + token + offset + 'count=200&user_id=' + userIdB.id;
  var request = 'https://api.vk.com' + method + 'v=5.52&' + reqDetails;
  scriptRequest(request, fillMsgArch, fail);
}

function limitReq() {
  startTime = startTime ? startTime : -(-new Date());
  var difTime = -(-new Date()) - startTime;

  if (difTime < 1500 && reqCounter == 2) {
    clearTimeout(limitTimeout);
    limitTimeout = setTimeout(vkReqMsg, 100);
    return false;
  } else if (difTime > 1500 && reqCounter == 2) {
    startTime = 0;
    reqCounter = 0;
    return true;
  } else if (reqCounter < 2) {
    reqCounter++;
    return true;
  }
}

function fillMsgArch(data) {
  if (data.response.items.length != 0) {
    resOk = true;
    msgArch.msgs = msgArch.msgs.concat(data.response.items);
    vkReqMsg();
  } else {
    full = true;
  }
}

function saveData() {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/arch', true);

  xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

  var body = JSON.stringify(msgArch);

  xhr.send(body);
  xhr.onreadystatechange = function() {
    if (xhr.readyState != 4) return;

    if (xhr.status != 200) {
      console.log(xhr.status + ': ' + xhr.statusText);
    } else {
      console.log(xhr.responseText);
    }
  }
}
