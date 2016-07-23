var ms;

function showTime () {
  var clockNow = new Date();
  var houres = clockNow.getHours();
  if (houres < 10) {
    houres = '0' + houres;
  };
  var minutes = clockNow.getMinutes();
  if (minutes < 10) {
    minutes = '0' + minutes;
  };
  var seconds = clockNow.getSeconds();
  if (seconds < 10) {
    seconds = '0' + seconds;
  };
  var milliseconds = clockNow.getMilliseconds();
  if (milliseconds < 10) {
    milliseconds = '00' + milliseconds;
  } else if (milliseconds < 100) {
    milliseconds = '0' + milliseconds;
  };
  var timeNow = houres + ':' + minutes + ':' + seconds + ':' + milliseconds;
  $('.clock').html(timeNow);
};
setInterval(showTime, 1);

//
// Таблица случайных чисел
//

setInterval(nineDigitRandom, 3000);

function nineDigitRandom () {

  function rand(min, max) {
    min = 100;
    max = 999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  $('#line1').html('&#' + rand());
  $('#line2').html('&#' + rand());
  $('#line3').html('&#' + rand());
  $('#line4').html('&#' + rand());
  $('#line5').html('&#' + rand());
  $('#line6').html('&#' + rand());
  $('#line7').html('&#' + rand());
  $('#line8').html('&#' + rand());
  $('#line9').html('&#' + rand());
};

setInterval(changecolor, 300);

function changecolor() {

  function rand(min, max) {
    min = 0;
    max = 255;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  function rgbcolor () {
    var randR = rand();
    var randG = rand();  
    var randB = rand();

    var randomcolor = '<div class="example" style="background: RGB(' + randR + ',' + randG + ',' + randB + ')"></div>';
    return randomcolor;
  }

  $('#block1').html(rgbcolor);
  $('#block2').html(rgbcolor);
  $('#block3').html(rgbcolor);
  $('#block4').html(rgbcolor);
  $('#block5').html(rgbcolor);
  $('#block6').html(rgbcolor);
  $('#block7').html(rgbcolor);
  $('#block8').html(rgbcolor);
  $('#block9').html(rgbcolor);
}
