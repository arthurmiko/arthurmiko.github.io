'use strict';

(function(){

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

// var ko = {
//   color: 'empty',
//   coordX: 0,
//   coordY: 0,
//   state: false,
//   lag: 1
// }

// function checkKo(x, y, color, lag) {
//   if (ko.coordX == x && ko.coordX == x && ko.color == color && lag > 1) {
//     return true;
//   }
// }

// function fillKo(state, color, x, y, lag) {
//   ko.state = state;
//   ko.color = color;
//   ko.coordX = 0;
//   ko.coordX = 0;
//   ko.lag = lag;
// }

function step(x, y) {
  var empty = checkEmpty(board, x, y);
  // var checkedKo = checkKo(x, y, color, ko.lag);
  // if (checkedKo) return;

  if (empty) {
    board[x][y] = color;
    var currentGroup = getGroup([[x, y]], color);
    var currentGroupAlive = checkGroup(currentGroup);
    var killed = kill(board, x, y, color);
    board[x][y] = 'empty';
  }

  if (empty == true && currentGroupAlive == true || killed) {
    board[x][y] = color;
    kill(board, x, y, color);
    changeColor();
    drawField();

    // if (ko.lag > 1) {
    //   fillKo(false, 'empty', 0 ,0 , 0);
    // }

    // ko.lag += 1;
  }
}

function changeColor() {
  color == 'black' ? color = 'white' : color = 'black';
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

function getGroup(group, color) {
  var amount = group.length;
  var outGroup;

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
    outGroup = getGroup(group);
  } else {
    return group;
  }

  return outGroup;
}

function checkGroup(group){
  var alive = false;
  group.forEach(function(item, i, arr) {
    if (checkNearEmpty(board, item[0], item[1])) {
      alive = true;
    };
  })
  return alive;
}

function fillEmpty(group) {
  group.forEach(function(item) {
    board[item[0]][item[1]] = 'empty';
  })
}

function trueKill(coords, color) {
  var group = getGroup(coords, color);
  var sideColor = board[coords[0][0]][coords[0][1]]
  if (sideColor == color) {
    if (checkGroup(group) != true){
      fillEmpty(group);
      // if (group.length == 1) {
      //   fillKo(true, color, coor, 1);
      // }
      return true;
    }
  }
  return false;
}

function kill(board, x, y, color) {
  var killed = false;
  var killedFunc = function(func) {
    if (func) killed = true;
  };

  if (color == 'black') {
    if (x < 8) killedFunc(trueKill([[x + 1, y]], 'white'));
    if (x > 0) killedFunc(trueKill([[x - 1, y]], 'white'));
    if (y < 8) killedFunc(trueKill([[x, y + 1]], 'white'));
    if (y > 0) killedFunc(trueKill([[x, y - 1]], 'white'));
  } else {
    if (x < 8) killedFunc(trueKill([[x + 1, y]], 'black'));
    if (x > 0) killedFunc(trueKill([[x - 1, y]], 'black'));
    if (y < 8) killedFunc(trueKill([[x, y + 1]], 'black'));
    if (y > 0) killedFunc(trueKill([[x, y - 1]], 'black'));
  }
  return killed;
}

})();
