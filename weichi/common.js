'use strict';

// снятие группы камней и возможно ко

// intialize canvas

var boardCanvas = document.getElementById('board');
var boardContext = boardCanvas.getContext('2d');

var cell = 50;
var fieldWidth = 450;
var fieldHeight = 450;

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

  for (var x = 0; x < boardArray.length; x++) {
    for (var y = 0; y < boardArray[x].length; y++) {
      if (boardArray[x][y] == 'white') {
        drawCircle(x, y, 'white');
      } else if (boardArray[x][y] == 'black') {
        drawCircle(x, y, 'black');        
      }
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

drawField();

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
  var nearPoint = checkNear(boardArray, x, y, turnColor);
  if (empty == true && nearPoint == true) {
    drawCircle(x, y, turnColor);
    boardArray[x][y] = turnColor;
    getGroup(x, y);
    killStone(boardArray, x, y, turnColor);
    changeColor();
    drawField();
  }
}

function changeColor() {
  if (turnColor == 'black') {
    turnColor = 'white';
  } else {
    turnColor = 'black';
  }
}

function checkEmpty(board, x, y) {
  if (board[x][y] == 'empty') {
    return true;
  }
}

function checkNear(board, x, y, color) {
  var group = [];
  var nearStone = checkNearColor(board, x, y, color);
  if (checkNearEmpty(board, x, y, color) || nearStone[0]) {
    return true;
  }
}

function checkNearEmpty(board, x, y, color) {
  var nearEmpty;
  if (x < 8 && board[x + 1][y] == 'empty') {    
    nearEmpty = true;
  }
  if (x > 0 && board[x - 1][y] == 'empty') {
    nearEmpty = true;
  }
  if (y < 8 && board[x][y + 1] == 'empty') {
    nearEmpty = true;
  }
  if (y > 0 && board[x][y - 1] == 'empty') {
    nearEmpty = true;
  }
  return nearEmpty;
}

function checkNearColor(board, x, y, color) {
  var stones = [false, []];
  if (x < 8 && board[x + 1][y] == color) {
    stones[1].push([x + 1, y]);
    stones[0] = true;
  }
  if (x > 0 && board[x - 1][y] == color) {
    stones[1].push([x - 1, y]);
    stones[0] = true;
  }
  if (y < 8 && board[x][y + 1] == color) {
    stones[1].push([x, y + 1]);
    stones[0] = true;
  }
  if (y > 0 && board[x][y - 1] == color) {
    stones[1].push([x, y - 1]);
    stones[0] = true;
  }
  return stones;
}

function killStone(board, x, y, color) {
  var check;
  killStoneBlack(board, x, y, color);
  killStoneWhite(board, x, y, color);
}

function killStoneBlack(board, x, y, color) {
  var check;
  if (color == 'black') {
    if (x < 8 && board[x + 1][y] == 'white') {
      check = checkNear(board, x + 1, y, 'white');
      if (check != true) {
        board[x + 1][y] = 'empty';
      }
    }
    if (x > 0 && board[x - 1][y] == 'white') {
      check = checkNear(board, x - 1, y, 'white')
      if (check != true) {
        board[x - 1][y] = 'empty';
      }
    }
    if (y < 8 && board[x][y + 1] == 'white') {
      check = checkNear(board, x, y + 1, 'white');
      if (check != true) {
        board[x][y + 1] = 'empty';
      }
    }
    if (y > 0 && board[x][y - 1] == 'white') {
      check = checkNear(board, x, y - 1, 'white');
      if (check != true) {
        board[x ][y - 1] = 'empty';
      }
    }
  }
}

function killStoneWhite(board, x, y, color) {
  var check;
  if (color == 'white') {
    if (x < 8 && board[x + 1][y] == 'black') {
      check = checkNear(board, x + 1, y, 'black');
      if (check != true) {
        board[x + 1][y] = 'empty';
      }
    }
    if (x > 0 && board[x - 1][y] == 'black') {
      check = checkNear(board, x - 1, y, 'black');
      if (check != true) {
        board[x - 1][y] = 'empty';
      }
    }
    if (y < 8 && board[x][y + 1] == 'black') {
      check = checkNear(board, x, y + 1, 'black');
      if (check != true) {
        board[x][y + 1] = 'empty';
      }
    }
    if (y > 0 && board[x][y - 1] == 'black') {
      check = checkNear(board, x, y - 1, 'black');
      if (check != true) {
        board[x][y - 1] = 'empty';
      }
    }
  }
}

function getGroup(x, y) {
  var nearStone = checkNearColor(boardArray, x, y, turnColor)[1];
  var nextNearStone = [];

  for (var i = 0; i < nearStone.length; i++) {
    var elem = checkNearColor(boardArray, nearStone[i][0], nearStone[i][1], turnColor)[1];
    var needToCut = [];

    for (var c = 0; c < elem.length; c++) {
      for (var j = 0; j < nearStone.length; j++) {
        if (elem[c][0] == nearStone[j][0] && elem[c][1] == nearStone[j][1]) needToCut.push(c);
      }

      for (var j = 0; j < nextNearStone.length; j++) {
        if (elem[c][0] == nextNearStone[j][0] && elem[c][1] == nextNearStone[j][1]) needToCut.push(c);
      }
    }

    for (var c = needToCut.length; c > 0; c--) {
      elem.splice(needToCut[c - 1], 1);
    }

    nextNearStone = nextNearStone.concat(elem);
    console.log(nextNearStone.join('; ') + ' iteration: ' + i)
  }

  nearStone = nearStone.concat(nextNearStone);
  console.log('nearStone length: ' + nearStone.length + '\n' + 'nearStone coords: ' + nearStone.join('; '))
}