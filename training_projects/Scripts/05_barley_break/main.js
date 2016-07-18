'use strict'
console.log('Hello, my dear friend!');

$(document).keydown(function (keyNum) {
  if (keyNum.which == 37) {
    console.log('Была нажата стрелка влево');
    moveLeft();
  } else if (keyNum.which == 38) {
    console.log('Была нажата стрелка вверх');
    moveUp();
  } else if (keyNum.which == 39) {
    console.log('Была нажата стрелка вправо');
    moveRight();
  } else if (keyNum.which == 40) {
    console.log('Была нажата стрелка вниз');
    moveDown();
  };
});

function moveRight () {
  console.log('Функция движение вправо')
  searchPositionNow ();
  var idUp = idNow - 1;
  if(idUp != 4 && idUp != 8 && idUp != 12 && idUp > 0) {
    var idUpNum = $('#cell_' + idUp).html();
    $('#cell_' + idNow).html(idUpNum);
    $('#cell_' + idNow).attr('class', '');
    $('#cell_' + idUp).attr('class', 'empty');
    $('#cell_' + idUp).html('');
  };
};

function moveLeft () {
  console.log('Функция движение влево')
  searchPositionNow ();
  var idUp = idNow + 1;
  if(idUp != 1 && idUp != 5 && idUp != 9 && idUp != 13 && idUp < 17) {
    var idUpNum = $('#cell_' + idUp).html();
    $('#cell_' + idNow).html(idUpNum);
    $('#cell_' + idNow).attr('class', '');
    $('#cell_' + idUp).attr('class', 'empty');
    $('#cell_' + idUp).html('');
  };
};

function moveUp () {
  console.log('Функция движение вверх')
  searchPositionNow ();
  var idUp = idNow + 4;
  if(idUp < 17) {
    var idUpNum = $('#cell_' + idUp).html();
    $('#cell_' + idNow).html(idUpNum);
    $('#cell_' + idNow).attr('class', '');
    $('#cell_' + idUp).attr('class', 'empty');
    $('#cell_' + idUp).html('');
  };
};

function moveDown () {
  console.log('Функция движение вниз')
  searchPositionNow ();
  var idUp = idNow - 4;
  if(idUp > 0) {
    var idUpNum = $('#cell_' + idUp).html();
    $('#cell_' + idNow).html(idUpNum);
    $('#cell_' + idNow).attr('class', '');
    $('#cell_' + idUp).attr('class', 'empty');
    $('#cell_' + idUp).html('');
  };
};

var random;
var s = false;
function rand () {
  random = Math.ceil(Math.random()*15);
};

function check () {
  s = false;
  for (var c = 1; c <= 14; c++) {
    if (random == $('#cell_' + c).html()) {
      s = false;
      return;
    } else {
      s = true;
    };
  };
};

function fill () {
  for (var i = 1; i <= 15; i++) {
    rand();
    check();
    if (s == true) {
      $('#cell_' + i).html(random);
    } else {
      i--;
    };
  };
};

var idNow;
function searchPositionNow () {
  for (var i = 1; i <= 16; i++) {
    if ($('#cell_' + i).attr('class') == 'empty') {
      var idString = $('#cell_' + i).attr('id');
      if (idString.length < 7) {
        idNow = +idString.slice(-1);
        console.log(idNow);
      } else {
        idNow = +idString.slice(-2);
        console.log(idNow);        
      }
    };
  };
};

$('.begin').click(function () {
  for (var i = 1; i <= 14; i++) {
    $('#cell_' + i).attr('class', '');
    $('#cell_' + i).html('');
  };
  $('#cell_' + idNow).attr('class', '');
  $('#cell_16').html('');
  idNow = 16;
  fill();
  timer();
  $('#min_id').html('00');
  correct = false;
  if (solvability() == false){
    $('.begin').click();
  };
});

var begin;
function timer () {
  begin = new Date();
  setInterval(showTime, 1);
};

var correct = false;
function checkCorrect () {
  var correctCounter = 0;
  for (var i = 1; i < 16; i++) {
    var cellValue = $('#cell_' + i).html();
    cellValue = +cellValue;
    var cellId = $('#cell_' + i).attr('id');
    if (cellId.length < 7) {
      cellId = +cellId.slice(-1);
    } else {
      cellId = +cellId.slice(-2);
    };
    if (cellValue == cellId) {
      correctCounter++;
    };
  };
  if (correctCounter == 15) {
    correct = true;
  };
};

var passed;
function showTime() {
  checkCorrect();
  if (correct == false) {
    passed = new Date();
    var niceTime = +passed-begin;
    var stringTime = niceTime + '';
    var ms = stringTime.slice(-3);
    if (ms.length < 2) {
      $('#ms_id').html('00' + ms);
    } else if (ms.length < 3) {
      $('#ms_id').html('0' + ms);
    } else {
      $('#ms_id').html(ms);
    };
    var sec = Math.round(niceTime/1000);
    if (sec < 10) {
      $('#sec_id').html('0' + sec);
    } else if (sec < 60) {
      $('#sec_id').html(sec);
    } else {
      var min = Math.floor(sec/60);
      if (min < 10) {
        $('#min_id').html('0' + min);
      };
      sec = sec - (min * 60);
      if (sec < 10) {
        $('#sec_id').html('0' + sec);
      } else {
        $('#sec_id').html(sec);        
      };
    };
  };
};

function solvability () {
  var messArg = 0;
  for (var c = 1; c < 15; c++) {
    var currentValue = $('#cell_' + c).html();
    currentValue = +currentValue;
    var i = c;
    i = i++;
    for (i; i < 16; i++) {
      var countValue = $('#cell_' + i).html();
      countValue = +countValue;
      if (currentValue > countValue) {
        messArg++;
      };
    };
  };
  messArg = messArg + 4;
  console.log(messArg);
  if (messArg%2 == 0) {
    return true;
  } else {
    return false;
  };
};
