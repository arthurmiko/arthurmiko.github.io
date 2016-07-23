'use strict';
console.log('train space ready');

(function() {

var body = document.body;
var box = document.getElementById('box');
var begin = document.getElementById('begin');
var nextLevel = document.getElementById('next_level');
var level = document.querySelectorAll('#level li');
var squares = document.querySelectorAll('.square');
var placesArr = document.getElementById('box').querySelectorAll('.place');
var colorArr = new Array(10);
var li = document.getElementsByTagName('li');
var num = 0;
var degrees = 0;
var difficultLevel = 1;
var difficult = 1;

begin.onclick = function(){
  fadeOut(document.getElementById('greatings'));
};

nextLevel.onclick = function() {
  restart();
};

start();

function filter() {
  if (degrees > 360) {
    degrees = 0;
  }
  document.getElementById('filter_box').style.webkitFilter = 'hue-rotate(' + degrees + 'deg)'
};

function start() {
  initColorArr(colorArr);
  document.getElementById('first_color').style.background = colorArr[0][0];
  document.getElementById('last_color').style.background = colorArr[9][1];
  for (var i = 0; i < squares.length; i++) {
    fillPLaces();
    addDragDrop(squares[i]);
    setGradient(squares[i]);
  }
  level[difficultLevel].style.background = '#191';
};

function restart() {
  difficultLevel += 1;
  if (difficult == 1) {
    difficult += 1;
  } else {
    difficult += 2;
  }
  fadeOut(document.getElementById('result'));
  initColorArr(colorArr);
  document.getElementById('first_color').style.background = colorArr[0][0];
  document.getElementById('last_color').style.background = colorArr[9][1];
  var liCoords;
  for (var i = 0; i < squares.length; i++) {
    li[i].appendChild(squares[i]);
    liCoords = getCoords(li[i]);
    squares[i].style.top = liCoords.top + 'px';
    squares[i].style.left = liCoords.left + 'px';
    squares[i].colorNum = null;
  }
  squares = document.querySelectorAll('.square');
  for (var i = 0; i < squares.length; i++) {
    setGradient(squares[i]);
  }
  for (var i = 1; i < level.length; i++) {
    level[i].style.background = '#999';
  }
  level[difficultLevel].style.background = '#191';
  if (difficultLevel > 3) {
    var filterId = setTimeout(function filterShift() {
      filter();
      degrees += 3 * difficultLevel;
      filterId = setTimeout(filterShift, 100);
    }, 100);
  };
};

function setGradient(elem) {
  elem.colorNum = getRandom(squares);
  elem.style.backgroundImage = '-webkit-linear-gradient(left, ' + colorArr[elem.colorNum][0] + ', ' + colorArr[elem.colorNum][1] + ')';
};

function getRandom(arr) {
  var num = Math.floor(Math.random() * 10);
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].colorNum == num) {
      i = -1;
      num = Math.floor(Math.random() * 10);
    }
  }
  return num;
};

function fadeOut(element) {
    var op = 1;
    var timer = setInterval(function () {
        if (op <= 0.01){
            clearInterval(timer);
            element.style.display = 'none';
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.2;
    }, 50);
}

function fadeIn(element) {
    var op = 0.01;
    var timer = setInterval(function () {
        if (op >= 0.99){
            clearInterval(timer);
        }
        element.style.display = 'block';
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.2;
    }, 50);
}

function getCoords(elem) {
  var box = elem.getBoundingClientRect();
  return {
    top: box.top + pageYOffset,
    left: box.left + pageXOffset
  };
}

function addMove(e) {
  var elem = e.srcElement;
  var coords = getCoords(elem);
  elem.style.position = 'absolute';

  var shiftX = e.pageX - coords.left;
  var shiftY = e.pageY - coords.top;
  elem.style.top = e.pageY - shiftY + 'px';
  elem.style.left = e.pageX - shiftX + 'px';
  elem.style.zIndex = 1;

  box.appendChild(elem);

  document.onmousemove = function(e) {
    elem.style.top = e.pageY - shiftY + 'px';
    elem.style.left = e.pageX - shiftX + 'px';
  };
  document.onmouseup = function() {
    document.onmousemove = null;
    document.onmouseup = null;
  };
};

function fitDrop(e) {
  var posX = e.clientX;
  var posY = e.clientY;
  var square = e.srcElement;
  square.style.display = 'none';
  var elem = document.elementFromPoint(posX, posY);
  square.style.display = 'block';
  if (elem.className == 'place') {
    var coords = getCoords(elem);
    square.style.top = coords.top + 'px';
    square.style.left = coords.left + 'px';
    elem.appendChild(square);
  }
};

function addDragDrop(elem) {
  elem.addEventListener('mousedown', function(e) {
    addMove(e);
  }, false);
  elem.addEventListener('mousedown', function(e) {
    e.stopPropagation();
  }, false);
  elem.addEventListener('mouseup', function(e) {
    fitDrop(e);
    checkOrder(e);
  }, false);
};

function checkOrder(e) {
  var full = true;
  for (var i = 0; i < placesArr.length; i++) {
    if (placesArr[i].childNodes.length < 2) {
      full = false;
      return;
    }
  }
  if (full == true) {
    (function() {
      var squaresArr = document.getElementById('box').querySelectorAll('.square')
      var result = true;
      for (var i = 0; i < placesArr.length; i++) {
        if (placesArr[i].colorNum != squaresArr[i].colorNum) {
          result == false;
          return;
        };
      };
      if (result == true) {
        fadeIn(document.getElementById('result'));
      };
    })();
  };
};

function initColorArr(arr) {  
  var redNext, redPrev, greenNext, greenPrev, blueNext, bluePrev;
  var redColor = genTwoColors();
  var greenColor = genTwoColors();
  var blueColor = genTwoColors();
  while (redColor.difference + greenColor.difference + blueColor.difference > (600 / difficult)) {
    redColor = genTwoColors();
    greenColor = genTwoColors();
    blueColor = genTwoColors();
  }
  redPrev = redColor.first;
  if (redColor.first < redColor.second) {
    redNext = redPrev + (Math.floor(redColor.difference / 10));
  } else {
    redNext = redPrev - (Math.floor(redColor.difference / 10));
  }
  greenPrev = greenColor.first;
  if (greenColor.first < greenColor.second) {
    greenNext = greenPrev + (Math.floor(greenColor.difference / 10));
  } else {
    greenNext = greenPrev - (Math.floor(greenColor.difference / 10));
  }
  bluePrev = blueColor.first;
  if (blueColor.first < blueColor.second) {
    blueNext = bluePrev + (Math.floor(blueColor.difference / 10));
  } else {
    blueNext = bluePrev - (Math.floor(blueColor.difference / 10));
  }
  for (var i = 0; i < arr.length; i++) {
    var colorFirst = 'rgb(' + redPrev + ', ' + greenPrev + ', ' + bluePrev + ')';
    var colorSecond = 'rgb(' + redNext + ', ' + greenNext + ', ' + blueNext + ')';
    arr[i] = new Array(2);
    for (var c = 0; c < arr[i].length; c++) {
      if (c == 0) {
        arr[i][c] = colorFirst;
      } else {
        arr[i][c] = colorSecond;
        redPrev = redNext;
        if (redColor.first < redColor.second) {
          redNext = redPrev + (Math.floor(redColor.difference / 10));
        } else {
          redNext = redPrev - (Math.floor(redColor.difference / 10));
        }
        greenPrev = greenNext;
        if (greenColor.first < greenColor.second) {
          greenNext = greenPrev + (Math.floor(greenColor.difference / 10));
        } else {
          greenNext = greenPrev - (Math.floor(greenColor.difference / 10));
        }
        bluePrev = blueNext;
        if (blueColor.first < blueColor.second) {
          blueNext = bluePrev + (Math.floor(blueColor.difference / 10));
        } else {
          blueNext = bluePrev - (Math.floor(blueColor.difference / 10));
        }
      }
    }
  }
};

function genTwoColors(first, second, difference) {
  first = Math.floor(Math.random() * 266);
  second = Math.floor(Math.random() * 266);
  if (second > first) {
    difference = second - first;
  } else if (first > second) {
    difference = first - second;
  } else {
    difference = 0;
  }
  return {
    first: first,
    second: second,
    difference: difference
  }
};

function fillPLaces() {
  var placesDivs = document.querySelectorAll('.place');
  for (var i = 0; i < placesDivs.length; i++) {
    placesDivs[i].innerHTML = i + 1;
    placesDivs[i].colorNum = i;
  };
};

})();
