'use strict';

// чтобы при окружении одного камня камнями другого цвета
// происходило снятие камня

// intialize canvas

var boardCanvas = document.getElementById('board');
var boardContext = boardCanvas.getContext('2d');

var cell = 50;
var fieldWidth = 450;
var fieldHeight = 450;



function drawField() {
  boardContext.fillStyle = '#ddd';
  boardContext.fillRect(0, 0, fieldWidth, fieldHeight);
  for (var x = 0; x < fieldWidth + cell; x += cell) {
    boardContext.strokeStyle = '#777';
    boardContext.beginPath();
    boardContext.moveTo(x - cell / 2, cell / 2);
    boardContext.lineTo(x - cell / 2, fieldHeight - cell / 2);
    boardContext.closePath();
    boardContext.stroke();
  }
  for (var y = 0; y < fieldHeight + cell; y += cell) {
    boardContext.strokeStyle = '#777';
    boardContext.beginPath();
    boardContext.moveTo(cell / 2, y - cell / 2);
    boardContext.lineTo(fieldWidth - cell / 2, y - cell / 2);
    boardContext.closePath();
    boardContext.stroke();
  }
}

drawField();

// initialize array

function createArrayBoard() {
  var arr = new Array(9);
  for (var i = 0; i < arr.length; i++) {
    arr[i] = new Array(9);
  }

  for (var i = 0; i < arr.length; i++) {
    for (var c = 0; c < arr[i].length; c++) {
      arr[i][c] = 'empty';
    }
  }

  return arr;
}

var boardArray = createArrayBoard();

// mouse click event

var arrCoorX;
var arrCoorY;
var turnColor = 'black';

boardCanvas.onclick = function(e) {
  arrCoorX = Math.floor(e.offsetX / 50);
  arrCoorY = Math.floor(e.offsetY / 50);
  turn(arrCoorX, arrCoorY);
}

function turn(x, y) {
  var empty = checkEmpty(boardArray, x, y);
  var nearPoint = checkNearPoint(boardArray, x, y, turnColor);
  if (empty == true && nearPoint == true) {
    drawCircle(x, y, turnColor);
    boardArray[x][y] = turnColor;
    killStone(boardArray, x, y, turnColor);
    changeColor();
  }
}

function changeColor() {
  if (turnColor == 'black') {
    turnColor = 'white';
  } else {
    turnColor = 'black';
  }
}

function drawCircle(x, y, color) {
  if (color == 'black') {
    boardContext.fillStyle = "#000";
    boardContext.beginPath();
    boardContext.arc(x * cell + cell / 2, y * cell + cell / 2, cell / 2, 0, Math.PI * 2, true);
    boardContext.fill();
  } else {
    boardContext.fillStyle = "#fff";
    boardContext.beginPath();
    boardContext.arc(x * cell + cell / 2, y * cell + cell / 2, cell / 2, 0, Math.PI * 2, true);
    boardContext.fill();
  }
}

function checkEmpty(board, x, y) {
  if (board[x][y] == 'empty') {
    return true;
  }
}

function checkNearPoint(board, x, y, color) {
  if (x < 8 && board[x + 1][y] == 'empty' || x < 8 && board[x + 1][y] == color) {
    return true;
  } else if (x > 0 && board[x - 1][y] == 'empty' || x > 0 && board[x - 1][y] == color) {
    return true;
  } else if (y < 8 && board[x][y + 1] == 'empty' || y < 8 && board[x][y + 1] ==  color) {
    return true;
  } else if (y > 0 && board[x][y - 1] == 'empty' || y > 0 && board[x][y - 1] == color) {
    return true;
  }
}

function killStone(board, x, y, color) {
  var check = false;
  if (color == 'white') {
    if (x < 8 && board[x + 1][y] == 'black') {
      check = checkNearPoint(board, x + 1, y, 'black');
      if (check != true) {
        // board[x + 1][y] == 'empty';
        // console.log(board)
        console.log('x: ' + x + ' y: ' + y)
        console.log('kill x: ' + (x + 1) + ' y: ' + (y));
      }
    } else if (x > 0 && board[x - 1][y] == 'black') {
      check = checkNearPoint(board, x - 1, y, 'black');
      if (check != true) {
        // board[x - 1][y] == 'empty';
        // console.log(board)
        console.log('x: ' + x + ' y: ' + y)
        console.log('kill x: ' + (x - 1) + ' y: ' + (y));
      }
    } else if (y < 8 && board[x][y + 1] == 'black') {
      check = checkNearPoint(board, x, y + 1, 'black');
      if (check != true) {
        // board[x][y + 1] == 'empty';
        // console.log(board)
        console.log('x: ' + x + ' y: ' + y)
        console.log('kill x: ' + (x) + ' y: ' + (y + 1));
      }
    } else if (y > 0 && board[x][y - 1] == 'black') {
      check = checkNearPoint(board, x, y - 1, 'black');
      if (check != true) {
        // board[x ][y - 1] == 'empty';
        // console.log(board)
        console.log('x: ' + x + ' y: ' + y)
        console.log('kill x: ' + (x) + ' y: ' + (y - 1));
      }
    }
  } else {
    if (x < 8 && board[x + 1][y] == 'white') {
      check = checkNearPoint(board, x + 1, y, 'white');
      if (check != true) {
        // board[x + 1][y] == 'empty';
        // console.log(board)
        console.log('x: ' + x + ' y: ' + y)
        console.log('kill x: ' + (x + 1) + ' y: ' + (y));
      }
    } else if (x > 0 && board[x - 1][y] == 'white') {
      check = checkNearPoint(board, x - 1, y, 'white')
      if (check != true) {
        // board[x - 1][y] == 'empty';
        // console.log(board)
        console.log('x: ' + x + ' y: ' + y)
        console.log('kill x: ' + (x - 1) + ' y: ' + (y));
      }
    } else if (y < 8 && board[x][y + 1] == 'white') {
      check = checkNearPoint(board, x, y + 1, 'white');
      if (check != true) {
        // board[x][y + 1] == 'empty';
        // console.log(board)
        console.log('x: ' + x + ' y: ' + y)
        console.log('kill x: ' + (x) + ' y: ' + (y + 1));
      }
    } else if (y > 0 && board[x][y - 1] == 'white') {
      check = checkNearPoint(board, x, y - 1, 'white');
      if (check != true) {
        // board[x ][y - 1] == 'empty';
        // console.log(board)
        console.log('x: ' + x + ' y: ' + y)
        console.log('kill x: ' + (x) + ' y: ' + (y - 1));
      }
    }
  }
}

