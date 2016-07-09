'use strict';

// чтобы при окружении одного камня камнями другого цвета
// происходило снятие камня

// intialize canvas

var boardCanvas = document.getElementById('board');
var boardContext = boardCanvas.getContext('2d');

var cell = 50;
var fieldWidth = 450;
var fieldHeight = 450;

// function drawField() {
//   for (var x = 0; x < fieldWidth; x += cell) {
//     var checkParityX;
//     if ((x / cell) % 2 == 0) {
//       checkParityX = true;
//     } else {
//       checkParityX = false;
//     }

//     for (var y = 0; y < fieldHeight; y += cell) {
//       var checkParityY;
//       if ((y / cell) % 2 == 0) {
//         checkParityY = true;
//       } else {
//         checkParityY = false;
//       }

//       if (checkParityX == false && checkParityY == true || checkParityX == true && checkParityY == false) {
//         boardContext.fillStyle = "#555";
//         boardContext.fillRect(x, y, cell, cell);
//       }
//     }
//   }
// }

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
var turnPlayer = 'black';

boardCanvas.onclick = function(e) {
  arrCoorX = Math.floor(e.offsetX / 50);
  arrCoorY = Math.floor(e.offsetY / 50);
  turn(arrCoorX, arrCoorY);
}

function turn(x, y) {
  var empty = checkEmpty(boardArray, x, y, turnPlayer);
  if (empty == true) {
    drawCircle(x, y, turnPlayer);
    if (turnPlayer == 'black') {
      turnPlayer = 'white';
    } else {
      turnPlayer = 'black';
    }
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

function checkEmpty(board, x, y, color) {
  if (board[x][y] == 'empty') {
    board[x][y] = color;
    return true;
  }
}
