'use strict';

(function(){
  
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

var board = createArrayBoard();

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

  for (var x = 0; x < board.length; x++) {
    for (var y = 0; y < board[x].length; y++) {
      if (board[x][y] == 'white') {
        drawCircle(x, y, 'white');
      } else if (board[x][y] == 'black') {
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
var color = 'black';

boardCanvas.onclick = function(e) {
  arrCoorX = Math.floor(e.offsetX / 50);
  arrCoorY = Math.floor(e.offsetY / 50);
  step(arrCoorX, arrCoorY);
}

function step(x, y) {
  var empty = checkEmpty(board, x, y);
  var nearPoint = checkNear(board, x, y, color);
  if (empty == true && nearPoint == true) {
    drawCircle(x, y, color);
  if (color == 'black'){
    var black = {};
    black.arrCoorX = [arrCoorX]
    black.arrCoorY = [arrCoorY]
    console.log('black X: ' + black.arrCoorX);
    console.log('black Y: ' + black.arrCoorY);

  }else if(color == 'white'){
    var white = {};
    white.arrCoorX = [arrCoorX]
    white.arrCoorY = [arrCoorY]
    console.log('white X: ' + white.arrCoorX);
    console.log('white Y: ' + white.arrCoorY);

  }

    board[x][y] = color;
    // getGroup(x, y);
    getGroup([[x, y]]);
    killStone(board, x, y, color);
    changeColor();
    drawField();
  }
}

function changeColor() {
  if (color == 'black') {
    color = 'white';
  } else {
    color = 'black';
  }
}

function checkEmpty(board, x, y) {
  if (board[x][y] == 'empty') {
    return true;
  }
}

function checkNear(board, x, y, color) {
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

function getGroup(group) {
  var amount = group.length;

  for (var k = 0; k < group.length; k++) {
    var nearStone = checkNearColor(board, group[k][0], group[k][1], color)[1];

    for (var i = 0; i < nearStone.length; i++) {
      var elem = checkNearColor(board, nearStone[i][0], nearStone[i][1], color)[1];
      var needToCut = [];

      for (var c = 0; c < elem.length; c++) {
        for (var j = 0; j < nearStone.length; j++) {
          if (elem[c][0] == nearStone[j][0] && elem[c][1] == nearStone[j][1]) needToCut.push(c);
        }
        for (var m = 0; m < group.length; m++) {
          if (elem[c][0] == group[m][0] && elem[c][1] == group[m][1]) needToCut.push(c);          
        }
      }

      for (var c = needToCut.length; c > 0; c--) {
        elem.splice(needToCut[c - 1], 1);
      }

      nearStone = nearStone.concat(elem);

      needToCut = [];
      for (var c = 0; c < nearStone.length; c++) {
        for (var j = 0; j < group.length; j++) {
          if (nearStone[c][0] == group[j][0] && nearStone[c][1] == group[j][1]) needToCut.push(c);
        }
      }

      for (var c = needToCut.length; c > 0; c--) {
        nearStone.splice(needToCut[c - 1], 1);
      }

      group = group.concat(nearStone);
    }
  }

  if (amount != group.length) {
    getGroup(group);
  } else {
    console.log('amount: ' + amount);
    console.log('group: ' + group.join('; '));
    return group;
  }
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

})();
