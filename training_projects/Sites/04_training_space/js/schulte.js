'use strict';
console.log('Hello, my dear friend!');

var random;
var s = false;

function rand () {
  random = Math.ceil(Math.random()*25);
};

function check () {
  s = false;
  for (var c = 1; c <= 25; c++) {
    if (random == $('#cell_' + c).html()) {
      s = false;
      return;
    } else {
      s = true;
    };
  };
};

function fill () {
  for (var i = 1; i <= 25; i++) {
    rand();
    check();
    if (s == true) {
      $('#cell_' + i).html(random);
    } else {
      i--;
    };
  };
};

var currentNum = 1;
$('td').click(function () {
  if ($(this).html() == currentNum) {
    $(this).attr('class', 'selected');
    currentNum++;
  };
});

$('.begin').click(function () {
  for (var i = 1; i <= 25; i++) {
    $('#cell_' + i).attr('class', '');
    $('#cell_' + i).html('');
  };
  fill();
  currentNum = 1;
  timer();
});

var begin;
function timer () {
  begin = new Date();
  setInterval(showTime, 1);
};

var passed;
function showTime() {
  if (currentNum != 26) {
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