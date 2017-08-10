'use strict';

var fieldWidth = 550;
var fieldHeight = 550;
var cell = 50;
var cellMax = 10;
var posX = 5;
var posY = 5;
var moveDirection = 'up';
var speed = 200;

function randomInteger(min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1)
    rand = Math.round(rand);
    return rand;
  }

var boardCanvas = document.getElementById('board');
var boardContext = boardCanvas.getContext('2d');

window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);


$(document).keydown(function (keyNum) {
  if (keyNum.which == 37) {
    turnLeft();
  } else if (keyNum.which == 38) {
    speedUp();
  } else if (keyNum.which == 39) {
    turnRight();
  } else if (keyNum.which == 40) {
    slowDown();
  };
});

function drawField() {
  for (var x = 0; x < fieldWidth; x += cell) {
    var checkX = x / cell;
    for (var y = 0; y < fieldHeight; y += cell) {
      var checkY = y / cell;
      if (checkX % 2 == 0) {
        if (checkY % 2 != 0) {
          boardContext.fillStyle = "#555"
          boardContext.fillRect(x, y, cell, cell);
          continue;
        };
      } else if (checkX % 2 != 0) {
        if (checkY % 2 == 0) {
          boardContext.fillStyle = "#555"
          boardContext.fillRect(x, y, cell, cell);
          continue;
        };
      };
      boardContext.fillStyle = "#999"
      boardContext.fillRect(x, y, cell, cell);
    };
  };
}

drawField();

function drawBlock() {
  boardContext.fillStyle = "#FFA500"
  boardContext.fillRect(posX * cell, posY * cell, cell, cell);  
};

drawBlock();


function turnLeft() {
  if (moveDirection == 'up') {
    moveDirection = 'left';
  } else if (moveDirection == 'left') {
    moveDirection = 'down';
  } else if (moveDirection == 'down') {
    moveDirection = 'right';
  } else {
    moveDirection = 'up';
  }
};
function turnRight() {
  if (moveDirection == 'up') {
    moveDirection = 'right';
  } else if (moveDirection == 'left') {
    moveDirection = 'up';
  } else if (moveDirection == 'down') {
    moveDirection = 'left';
  } else {
    moveDirection = 'down';
  }
};

function speedUp() {
  speed = speed - cell;
};

function slowDown() {
  speed = speed + cell;
};

function moveLeft() {
  if (posX == 0) {
    posX = cellMax;
    drawBlock();
  } else {
    posX--;
    drawBlock();
  };
};

function moveRight() {
  if (posX == cellMax) {
    posX = 0;
  } else {
    posX++
  };
};

function moveUp() {
  if (posY == 0) {
    posY = cellMax;
  } else {
    posY--
  };
};

function moveDown() {
  if (posY == cellMax) {
    posY = 0;
  } else {
    posY++
  };
};

var appleX;
var appleY;
var appleThere = false;

function addApple() {
  if (appleThere == false) {
    newApplePos();
    drawApple();
  } else {
    drawApple();
  }
  function newApplePos() {
    appleX = randomInteger(0, cellMax);
    appleY = randomInteger(0, cellMax);
    for (var i = 0; i < tale.length; i++) {
      if (appleX == tale[i][0] && appleY == tale[i][1]) {
        newApplePos();
      };
    };
  };
  function drawApple() {
    boardContext.fillStyle = "#900";
    boardContext.fillRect(appleX * cell, appleY * cell, cell, cell);
    appleThere = true;
  };
};

var tale = [];

function taleRefresh() {
  tale.push([posX, posY]);
  if (points < 0) {
    tale.length = 0;
  } else {
    var leng = points + 1;
    var tempArr = tale.slice(-leng);
    tale = tempArr;
  };
  console.log(tale);
  for (var i = 0; i < tale.length; i++) {
    boardContext.fillStyle = "#340";
    boardContext.fillRect(tale[i][0] * cell, tale[i][1] * cell, cell, cell);
  };
};

var points = 0;
function eatApple() {
  if (posX == appleX && posY == appleY) {
    drawBlock();
    appleThere = false;
    points++;
  }
};

//как работает setTimeout через рекурсию?

function die() {
  for (var i = 0; i < tale.length; i++) {
    if (posX == tale[i][0] && posY == tale[i][1]) {
      tale.length = 0;
      points = 0;
    };
  };
};

var moveForward = setTimeout(function moved() {
  if (moveDirection == 'up') {
    moveUp();
  } else if (moveDirection == 'right') {
    moveRight();
  } else if (moveDirection == 'down') {
    moveDown();
  } else if (moveDirection == 'left') {
    moveLeft();
  }

  die();
  drawField();
  taleRefresh();
  drawBlock();
  eatApple();
  addApple();

  moveForward = setTimeout(moved, speed);
}, speed);