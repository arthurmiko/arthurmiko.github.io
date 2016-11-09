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

var midVK = {
  data: {
    count: null,
    usersInfo: []
  },

  customizeRequest: function(method) {
    var urlReq = 'https://api.vk.com/method/';

    if (method == 'getUsersId') {

      if (!midVK.data.count) {
        urlReq += 'messages.getDialogs?offset=0&start_message_id=0&count=200' + auth.token;
        var handler = function(data) {
          midVK.data.count = data.response.count;
          midVK.tmpArr.push(data.response);
          if (midVK.data.count <= 200) {
            midVK.customizeRequest('getUsersInfo');
          } else {
            midVK.customizeRequest('getUsersId');
          }
        };
      }

      else {
        var code = 'var count = ' + midVK.data.count + ';' +
                   'var offset = 200;' +
                   'var result = [];' +
                   'var i = ' + Math.ceil((midVK.data.count - 200) / 200) + ';' +
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
          midVK.tmpArr = midVK.tmpArr.concat(data.response);
          midVK.customizeRequest('getUsersInfo');
        }
      };
    }

    else if (method == 'getUsersInfo') {
      midVK.tmpArr.forEach(function(val) {
        val.items.forEach(function(el){
          if (el.message.hasOwnProperty('chat_id')) {
            return;
          }
          midVK.data.usersInfo.push(el.message.user_id);
        })
      });
      midVK.tmpArr = [];
      urlReq += 'users.get?user_ids=' + midVK.data.usersInfo[0] + auth.token;
      var handler = function(data) {
        console.log(data)
      }
      // следующий шаг, сбор информации по всем пользователям
      // имя, фамилия, пол, количество сообщений
      // для начала простой запрос, на получение имени и фамилии
      // затем для сбора количества сообщений ещё один отдельный запрос
      // потом, попробовать их объединить, когда поведение обоих в отдельности будет очевидно
      // return;
    }

    scriptRequest(urlReq, handler, failJSONP);
  },

  tmpArr: []
}

// ========================================================
// VK interchange END
// ========================================================

// ========================================================
// Authorize BEGIN
// ========================================================

var auth = {
  token: '&access_token=f2734098fa2310721bd85da95a6b4119a38a78b547ad7cbcebf9f4e3bf26567ed35ffcb28177f810e459b&v=5.53',
  id: '&user_id=55832488',
  oAuthUrl: 'https://oauth.vk.com/authorize?client_id=5640930&display=page&redirect_uri=blank.html&scope=messages&response_type=token&v=5.53&state=123456',
  getToken: function() {
    window.open(this.oAuthUrl);
  }
}

// ========================================================
// Authorize END
// ========================================================

// var req = '/local';
var req = 'https://api.vk.com/method/users.get?user_ids=85922329, 7122720, 70209146';

function testGet() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', req, true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
  xhr.setRequestHeader('accept', 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript, */*; q=0.01');
  xhr.setRequestHeader('x-requested-with', 'XMLHttpRequest');
  xhr.send();

  xhr.onreadystatechange = function() {
    if (xhr.readyState != 4) return;

    if (xhr.status != 200) {
      console.log(xhr.status + ': ' + xhr.statusText);
    } else {
      console.log(xhr.responseText);
    }
  }
}

function testGet2() {
  var req = '/local';
  $.ajax({
      url : req,
      method : "GET",
      dataType : "jsonp",
      success : function(msg){
      console.log(msg);
      }
  });
}

// var userIda = '85922329, 7122720, 70209146, 73032042, 4460944, 328521763, 24133062, 10652882, 83422880, 261935057, 380426378, 13043430, 8234635, 10960366, 115265964, 132271786, 7067721, 8839305, 16451229, 15994852, 55832488, 19959048, 278929833, 10781529, 382108289, 92458988, 49129959, 92834321, 28405625, 166067525, 9903582, 23571309, 267020371, 367762603, 38843550, 3437068, 22899463, 275157794, 44128001, 18282493, 15969808, 61617719, 10778678, 170793965, 18397904, 26856341, 62266915, 7213610, 6507268, 223821391, 3429210, 13304638, 114105875, 142726614, 3212470, 11541215, 4928077, 4089863, 74354056, 14795926, 26760157, 193010357, 130931105, 255037422, 200330889, 1472053, 11523316, 45128222, 46264970, 136372462, 109785851, 69595156, 6884945, 24884904, 5552323, 7729902, 4118564, 4203216, 199073323, 23927315, 212800829, 336375827, 219828204, 10154061, 8988517, 9500053, 322763538, 3098680, 198740242, 7835119, 6579960, 10746589, 5060143, 40050455, 10248748, 170699336, 86518732, 208832444, 205143261, 358569673, 172577091, 950328, 13959234, 14030427, 217056119, 162698209, 2033037, 2497206, 266556782, 48554135, 340636025, 93663855, 3917346, 194910611, 347890162, 5641758, 12173408, 343646437, 16010371, 340724652, 80168301, 333819866, 89465039, 34145255, 43648822, 930965, 278278403, 47674564, 44756552, 8353926, 192367950, 10274703, 263308080, 155703274, 3972090, 39223109, 17941325, 6588155, 84400063, 17228115, 62914007, 24523052, 18129120, 14068604, 144176746, 14660428, 309734796, 30232834, 9060178, 8397089, 19591006, 227634057, 42884026, 31343077, 13573702, 108432241, 205351732, 13014916, 319268693, 16757780, 34726370, 72779587, 36958455, 317272903, 23533009, 189323282, 171927722, 147261682, 2419696, 240652359, 6121057, 31482082, 13978783, 4841255, 4784633, 17676466, 260892898, 242516679, 3946139, 244658548, 730273, 28645985, 4535487, 2365981, 2478578, 129605068, 310242861, 1366058, 305695291, 100074166, 18592310, 55480871, 4878296, 3945769, 215774517, 253128924, 154297395, 1587129, 1306098, 71234893, 198296127, 19415375, 18949619, 99386369, 13886346, 294667417, 523344, 22628288, 93864072, 281784902, 19288288, 221699763, 296995376, 60934394, 12172583, 4847905, 9550409, 261281616, 7025108, 8073142, 564137, 41248704, 111443723, 32131418, 2666832, 17786255, 6166042, 202606597, 133129416, 9069967, 40741442, 93921992, 296979725, 254636198, 85247879, 111270728, 41411532, 87852824, 155205905, 10286306, 74188598, 84457560, 5972260, 38066772, 85488089, 69064549, 51093351, 180176239, 11311426, 14319060, 150353532, 118685146, 213075029, 4224355, 14883169, 96283111, 5664283, 18044489, 14287852, 246321398, 63477993, 23430733, 8845805, 151620525, 113546969, 55363231, 10180170, 54720888, 30554808, 22562339, 34856868, 49613381, 8577145, 7201515, 185166256, 10641118, 3913560, 60067155, 27213670, 15027844, 17221284, 6856074, 12477661, 5226372, 20648848, 52790952, 49456816, 101475854, 114300303, 76909273, 13363761, 243623401, 243356160, 207793061, 4530723, 63893138, 272255427, 13781648, 164719836, 252005501, 193301137, 619118, 265280144, 226722413, 114597060, 82870271, 265130853, 73065001, 13515201, 15465681, 145301797, 15056826, 7077688, 151102112, 12733240, 272619357, 270710905, 52243647, 237801111, 250052560, 51758666, 42830284, 86796597, 2770906, 223368843, 15090153, 8326746, 268698198, 272947515, 34506229, 249131, 11056616, 26306383, 16145071, 14793323, 181140317, 20855983, 13685600, 29082977, 195874, 17643884, 191275271, 171004135, 253128969, 89896961, 33146979, 52839092, 8775055, 22124238, 6125566, 38758185, 259129997, 18718996, 6126656, 9607067, 250963380, 194107969, 6273063, 11398394, 7627627, 14366243, 187586280, 12030239, 17566994, 12609240, 162567634, 29852272, 6233294, 160011673, 60530844, 9433170, 49720410, 102634030, 7899520, 27261297, 250957025, 3403695, 23319398, 195708947, 152111013, 53061174, 36318095, 10772210, 17606014, 120025001, 31211622, 142054621, 49826341, 154692087, 39326080, 19540924, 85473620, 44225084, 224907844, 64109656, 15710582, 29248518, 94223257, 12386676, 72306715, 119364254, 150626493, 26147861, 27284320, 125504283, 206503376, 245809537, 20802530, 98019263, 8515124, 40188175, 54150915, 46606497, 38899942, 38264700, 22214766, 19756811, 4341687, 55765382, 6649804, 61286448, 34204136, 56860808, 21356673, 10705902, 8762594, 136764169, 95482911, 34060510, 154683159, 23590691, 33643560, 225459392, 112019937, 169654464, 16445209, 19119659, 155068620, 186448922, 27269323, 82400506, 227217677, 225141697, 190580051, 138313201, 134305527, 132097831, 118372805, 96418069, 77010610, 49638699, 26890758, 26554968, 21629054, 20926297, 16812090, 10890308, 149417736, 12122782, 56768856, 158699311, 12010442, 123152091, 7652084, 150663171, 44573569, 56672548, 184314218, 166958483, 157007319, 101797681, 89907616, 31497416, 26734013, 25662961, 25198205, 20432667, 14293233, 8879752, 5815257, 238009086, 152730491, 16302904, 91186348, 40275624, 44627157, 153351043, 232404234, 24128811, 6654134, 246429514, 154267057, 186473862, 125434231, 57270843, 20492854, 20601541, 5295881, 219807809, 18444456, 196824170, 27823873, 6870061, 113718320, 25047459, 11703805, 97926692, 215745168, 19926294, 80264653, 9480456, 151497043, 200044888, 6499142, 134985136, 9194733, 44178240, 11505821, 3425583, 22668363, 7350728, 236620871, 121441381, 97420911, 241435338, 198907775, 9158959, 11323479, 10329871, 17474737, 62248583, 36460298, 10228498, 5956059, 4747104, 4615293, 135444613, 162101150, 33214778, 169281952, 24130915, 13641437, 161598032, 35712007, 12263481, 229019017, 703873, 7090163, 37260596, 134177407, 41523019, 223767994, 17151010, 4534220, 119950948, 15025019, 50017871, 5783853, 174341816, 16368539, 200265052, 159519716, 12381901, 27093549, 5629591, 21135979, 5627419, 10513823, 141820798, 17476981, 132739965, 18077942, 65926359, 21587891, 10119520, 154080899, 19188397, 3360968, 11975465, 97239658, 181665239, 9403776, 6837436, 30069455, 28444130, 103453580, 172091284, 112879548, 16063087, 14374401, 132847831, 82218570, 184436096, 31135059, 183121690, 145196972, 4605639, 2849155, 3191732, 43044309, 2326988, 99818466, 51542615, 118462556, 16597593, 116764443, 15193528, 8997106, 65697181, 4774607, 3755539, 9675473, 5806978, 157959647, 104443909, 55894668, 69415696, 34313965, 12544828, 15863556, 184398129, 9948012, 15798418, 152717646, 83321137, 70568909, 15368090, 6437815, 81457464, 31207813, 12746713, 10784399, 7614081, 5640609, 4047112, 14105402, 16209237, 1300585, 20309883, 90240203, 179120449, 156267744, 48345084, 145429696, 12868618, 20068409, 5470846, 6202729, 1579892, 2180777, 85627058, 156753751, 17347817, 133078772, 18013897, 15761383, 6337849, 20075677, 83591260, 9280012, 9882119, 64340861, 28149386, 10264277, 4871975, 44330919, 35495326, 6186685, 7674022, 34698535, 59810171, 20287769, 5714550, 5828322, 8169648, 43529445, 16607358, 40366919, 22260116, 53225077, 7566954, 6168966, 35332303, 55950634, 52072056, 11228082, 97152614, 12293382, 21396787, 10841375, 31282757, 108814979, 16416626, 25019970, 38696763, 28468295, 14161256, 19954368, 39133168, 47368493, 12075841, 10530886, 12983809, 131646932, 72965109, 1051218, 9286333, 22375279, 49723803, 63358020, 1238652, 77403202';
// var userIdb = userId;

// function testGet() {
//   var tmp = midVK.data.usersInfo;
//   // var tmp = midVK.data.usersInfo.slice(0, 400);
//   console.log(tmp.join('').length);
//   console.log(tmp.join('').length / 1024);
//   var req = 'https://api.vk.com/method/';
//   $.ajax({
//       url : req,
//       method : "POST",
//       data: 'users.get?user_ids=' + tmp.join(','),
//       dataType : "jsonp",
//       success : function(msg){
//       console.log(msg);
//       }
//   });
// }

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