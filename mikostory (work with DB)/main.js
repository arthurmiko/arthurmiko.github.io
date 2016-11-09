'use strict';

// ========================================================
// General BEGIN
// ========================================================

var ajaxCBs = {
  list: function() {
    userList = JSON.parse(this.responseText);
    fillUserList();
  },
  msg: function() {
    usersData.raw = JSON.parse(this.responseText);
    initDateArr(usersData.raw);
    initStats();
    fillStats();
    drawChart();
  }
}

function ajaxGetReq(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.send();

  xhr.onreadystatechange = function() {
    if (xhr.readyState != 4) return;

    if (xhr.status != 200) {
      console.log(xhr.status + ': ' + xhr.statusText);
    } else {
      callback.call(this);
    }
  }
}

// ========================================================
// General END
// ========================================================

// ========================================================
// Prepare page BEGIN
// ========================================================

$(document).ready(function(){
  ajaxGetReq('/db/users', ajaxCBs.list);
});

var userList = [];

function fillUserList() {
  userList.forEach(function(val) {
    var element = document.createElement('li');
    var input = document.createElement('input');
    input.setAttribute('type', 'checkbox');
    input.setAttribute('id', val.id);
    input.setAttribute('name', 'user-select');
    input.setAttribute('value', val.name);
    element.appendChild(input);
    var label = document.createElement('label');
    label.setAttribute('for', val.id)
    label.innerHTML = val.name;
    element.appendChild(label);
    window['user-list'].appendChild(element);
  });
}

function selectAll() {
  var tmp = document.querySelectorAll('#user-list li');
  if (window['select-all'].checked) {
    tmp.forEach(function(val) {
      val.childNodes[0].checked = false;
    })
  } else {
    tmp.forEach(function(val) {
      val.childNodes[0].checked = true;
    })
  }
}

// ========================================================
// Prepare page END
// ========================================================

// ========================================================
// Request to DB BEGIN
// ========================================================

var usersData = {
  raw: null,
  ids: '',
  graphDateArr: [],
  userStats: {}
}

function reqUserDB() {
  setChart();
  resetUserData();
  var tmp = document.querySelectorAll('#user-list li');
  tmp.forEach(function(val, i, arr) {
    if (val.childNodes[0].checked) {
      usersData.ids = usersData.ids + '&ids=' + val.childNodes[0].id;
    }
  })
  ajaxGetReq('/userId/' + usersData.ids, ajaxCBs.msg);
}

function setChart() {
  var elem = document.querySelector('.graph-wrap');
  if (elem.querySelector('canvas')) {
    elem.querySelector('canvas').remove();
  }
  if (elem.querySelector('iframe')) {
    elem.querySelector('iframe').remove();
  }
  var chart = document.createElement('canvas');
  chart.setAttribute('id', 'myChart');
  chart.setAttribute('width', '4');
  chart.setAttribute('height', '1');
  elem.appendChild(chart);
}

function resetUserData() {
  usersData.userStats = {};
  usersData.graphDateArr = [];
  usersData.ids = '';
}

function initDateArr() {
  var tmpDate = {
    min: Infinity,
    i: null,
    prevMonth: null,
    prevYear: null,
    curMonth: null,
    curYear: null
  }

  usersData.raw.forEach(function(val, i){
    if (val.msgs[val.msgs.length - 1].date < tmpDate.min) {
      tmpDate.min = val.msgs[val.msgs.length - 1].date;
      tmpDate.i = i;
    }
  })
  tmpDate.prevMonth = new Date(usersData.raw[tmpDate.i].msgs[usersData.raw[tmpDate.i].msgs.length - 1].date * 1000).getMonth(),
  tmpDate.prevYear = new Date(usersData.raw[tmpDate.i].msgs[usersData.raw[tmpDate.i].msgs.length - 1].date * 1000).getFullYear(),
  tmpDate.curMonth = new Date().getMonth(),
  tmpDate.curYear = new Date().getFullYear()

  while (tmpDate.prevMonth != tmpDate.curMonth ||
         tmpDate.prevYear != tmpDate.curYear) {
    usersData.graphDateArr.push('' + (tmpDate.prevMonth + 1) + ', ' + tmpDate.prevYear);
    if (tmpDate.prevMonth < 11) {
      tmpDate.prevMonth++;
    } else {
      tmpDate.prevMonth = 0;
      tmpDate.prevYear++;
    }
  }
  usersData.graphDateArr.push('' + (tmpDate.prevMonth + 1) + ', ' + tmpDate.prevYear);
}

function initStats() {
  usersData.raw.forEach(function(val){
    usersData.userStats[val.id] = {
      name: val.name,
      in: [],
      out: []
    }
  })
  for (var key in usersData.userStats){
    usersData.userStats[key].in = new Array(usersData.graphDateArr.length);
    usersData.userStats[key].out = new Array(usersData.graphDateArr.length);
    for (var i = 0; i < usersData.graphDateArr.length; i++) {
      usersData.userStats[key].in[i] = 0;
      usersData.userStats[key].out[i] = 0;
    }
  }
}

function fillStats() {
  usersData.raw.forEach(function(val){
    var currentUserId = val.id;
    val.msgs.forEach(function(val){
      var cur = new Date();
      var past = new Date(val.date * 1000);
      var dif = (cur.getMonth() + cur.getFullYear() * 12) - (past.getMonth() + past.getFullYear() * 12);
      if (val.out) {
        usersData.userStats[currentUserId].out[usersData.graphDateArr.length - (1 + dif)]++;
      } else {
        usersData.userStats[currentUserId].in[usersData.graphDateArr.length - (1 + dif)]++;
      }
    })
  })
}

function drawChart() {
  var ctx = $("#myChart");
  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: usersData.graphDateArr,
      datasets: createDatasets(),
    },
    options: {
      maintainAspectRatio: false
    }
  });
}

function createDatasets() {
  var tmp = [];
  for (var key in usersData.userStats) {
    var colorIn = randomColor();
    var colorOut = randomColor();
    var singleDataIn = {
      label: usersData.userStats[key].name + ' - IN',
      data: usersData.userStats[key].in,
      backgroundColor: colorIn + '0.2)',
      borderColor: colorIn + '1)',
      borderWidth: 1
    }
    var singleDataOut = {
      label: usersData.userStats[key].name + ' - OUT',
      data: usersData.userStats[key].out,
      backgroundColor: colorOut + '0.2)',
      borderColor: colorOut + '1)',
      borderWidth: 1
    }
    tmp.push(singleDataIn, singleDataOut);
  }
  return tmp;
}

function randomColor() {
  var r = randomInteger(0, 255);
  var g = randomInteger(0, 255);
  var b = randomInteger(0, 255);
  return 'rgba(' + r + ', ' + g + ', ' + b + ', ';
}

function randomInteger(min, max) {
  var rand = min - 0.5 + Math.random() * (max - min + 1)
  rand = Math.round(rand);
  return rand;
}

// ========================================================
// Request to DB END
// ========================================================

// ========================================================
// VK interchange BEGIN
// ========================================================

// определить общее количество диалогов
// получить с помощью execute список id всех пользоваталей с кем есть диалог
// в одном вызове можно получить 5000 id, пока нет необходимости обходить это ограничение
// var method = 'execute?code=';
// var code = 'var a = []; a.push(API.messages.getHistory({"user_id":380426378})); a.push(API.messages.getHistory({"user_id":73032042})); return a;'
// var req = 'https://api.vk.com/method/' + method + code + auth.token;
// 
// фильтрация бесед в отдельный массив

var midVK = {
  dialogs: {
    count: null,
    usersId: []
  },

  methods: {
    history: 'messages.getHistory?'
  },

  customizeRequest: function(method) {
    var urlReq = 'https://api.vk.com/method/';
    if (method == 'dialogs') {
      if (!midVK.dialogs.count) {
        urlReq += 'messages.getDialogs?offset=0&start_message_id=0&count=200' + auth.token;
        var handler = function(data) {
          console.log(data);
          midVK.dialogs.count = data.response.count;
          data.response.items.forEach(function(val){
            midVK.dialogs.usersId.push(val.message.user_id);
          });
          if (midVK.dialogs.count <= 200) {
            midVK.customizeRequest('users');
          } else {
            midVK.customizeRequest('dialogs');
          }
        };
      } else {
        var code = 'var count = ' + midVK.dialogs.count + ';' +
                   'var offset = 200;' +
                   'var result = [];' +
                   'var i = ' + Math.ceil((midVK.dialogs.count - 200) / 200) + ';' +
                   'while (i > 0) {' +
                     'var res = API.messages.getDialogs({' +
                       '"offset": offset,' +
                       '"start_message_id": 0,' +
                       '"count": 200' +
                     '});' +
                     'result.push(res);' +
                     'offset = offset - (-200); i = i - 1;' +
                   '}; return result;';
        urlReq += 'execute?code=' + code + auth.token;
        var handler = function(data) {
          console.log(data);
        }
      };
    } else if (method == 'users') {
      console.log('next method must collect user info');
    }

    scriptRequest(urlReq, handler, failJSONP);
  }
}

// ========================================================
// VK interchange END
// ========================================================

// ========================================================
// Authorize BEGIN
// ========================================================

var auth = {
  token: '&access_token=51f648f8eebce110bed81f5df1d51fd962d6590859a5bce183fb62776ff0851e0395bc920e32f0d36c9f1&v=5.53',
  id: '&user_id=55832488',
  oAuthUrl: 'https://oauth.vk.com/authorize?client_id=5640930&display=page&redirect_uri=blank.html&scope=messages&response_type=token&v=5.53&state=123456',
  getToken: function() {
    window.open(this.oAuthUrl);
  }
}

// ========================================================
// Authorize END
// ========================================================

// ========================================================
// обработка JSONP BEGIN
// ========================================================

var CallbackRegistry = {};

function scriptRequest(url, onSuccess, onError) {
console.log('script req url: ' + url);
  var scriptOk = false;
  var callbackName = 'cb' + String(Math.random()).slice(-6);

  url += ~url.indexOf('?') ? '&' : '?';
  url += 'callback=CallbackRegistry.' + callbackName;

  CallbackRegistry[callbackName] = function(data) {
    scriptOk = true;
    delete CallbackRegistry[callbackName];
    onSuccess(data);
  };

  function checkCallback() {
    if (scriptOk) return;
    delete CallbackRegistry[callbackName];
    onError(url);
  }

  var script = document.createElement('script');

  script.onreadystatechange = function() {
    if (this.readyState == 'complete' || this.readyState == 'loaded') {
      this.onreadystatechange = null;
      setTimeout(checkCallback, 0);
    }
  }

  script.onload = script.onerror = checkCallback;
  script.src = url;

  document.body.appendChild(script);
}

function failJSONP(url) {
  console.log('Ошибка при запросе ' + url);
}

// ========================================================
// обработка JSONP END
// ========================================================