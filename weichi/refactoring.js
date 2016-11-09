'use strict';

(function(){

var boardCanvas = document.getElementById('board');
var boardContext = boardCanvas.getContext('2d');
var passBtn = document.getElementById('btn-pass');

passBtn.onclick = changeColor;

var cell = 50;
var fieldWidth = 450;
var fieldHeight = 450;

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

var arrCoorX;
var arrCoorY;
var color = 'black';

boardCanvas.onclick = function(e) {
  arrCoorX = Math.floor(e.offsetX / 50);
  arrCoorY = Math.floor(e.offsetY / 50);
  step(arrCoorX, arrCoorY);
}

var ko = {
  color: 'empty',
  coord: [],
  state: false,
  lag: 1
}

function checkKo(x, y, color, lag) {
  var koTemp = JSON.stringify(ko);
  var result = tryKill(x, y);
  ko = JSON.parse(koTemp);

  var moreOne = false;
  result.killed.amount.forEach(function(item) {
    if (item > 1) moreOne = true;
  });

  if (!moreOne) {
    color == 'black' ? color = 'white' : color = 'black';
    fill(result.killed.coords, color);
    color == 'black' ? color = 'white' : color = 'black';
  }

  if (ko.coord[0] == x && ko.coord[1] == y && ko.color == color && lag > 1 && !moreOne) {
    return true;
  }
}

function fillKo(state, color, coord, lag) {
  ko.state = state;
  ko.color = color;
  ko.coord = coord;
  ko.lag = lag;
}

function tryKill(x, y) {
  board[x][y] = color;
  var result = {}
  result.currentGroup = getGroup([[x, y]], color),
  result.currentGroupAlive = checkGroup(result.currentGroup),
  result.killed = kill(board, x, y, color)
  board[x][y] = 'empty';
  return result;
}

function step(x, y) {
  var result = {
    killed: {
      dead: false
    }
  };
  var empty = checkEmpty(board, x, y);
  if (empty) {
    var checkedKo = checkKo(x, y, color, ko.lag);
    if (checkedKo) return;
  }

  if (empty) result = tryKill(x, y);

  if (empty == true && result.currentGroupAlive == true || result.killed.dead) {
    board[x][y] = color;
    kill(board, x, y, color);
    changeColor();
    drawField();

    if (ko.lag > 1) {
      fillKo(false, 'empty', 0, 0);
    }

    ko.lag += 1;
    return true;
  }
}

function changeColor() {
  color == 'black' ? color = 'white' : color = 'black';
}

function checkEmpty(board, x, y) {
  return (board[x][y] == 'empty' ? true : false);
}

function checker (board, x, y, edge, color, result) {
  if (edge && board[x][y] == color) {
    if (result.length > 1) result[1].push([x, y]);
    result[0] = true;
  }
}

function checkNearEmpty(board, x, y, color) {
  var nearEmpty = [false];
  checker (board, x + 1, y, x < 8, 'empty', nearEmpty);
  checker (board, x - 1, y, x > 0, 'empty', nearEmpty);
  checker (board, x, y + 1, y < 8, 'empty', nearEmpty);
  checker (board, x, y - 1, y > 0, 'empty', nearEmpty);
  return nearEmpty[0];
}

function checkNearColor(board, x, y, color) {
  var stones = [false, []];
  checker (board, x + 1, y, x < 8, color, stones);
  checker (board, x - 1, y, x > 0, color, stones);
  checker (board, x, y + 1, y < 8, color, stones);
  checker (board, x, y - 1, y > 0, color, stones);
  return stones;
}

// function getGroup(group, color) {
//   var amount = group.length;
//   var outGroup;

//   for (var k = 0; k < group.length; k++) {
//     var nearStone = checkNearColor(board, group[k][0], group[k][1], color)[1];

//     for (var i = 0; i < nearStone.length; i++) {
//       var elem = checkNearColor(board, nearStone[i][0], nearStone[i][1], color)[1];
//       var needToCut = [];

//       for (var c = 0; c < elem.length; c++) {
//         for (var j = 0; j < nearStone.length; j++) {
//           if (elem[c][0] == nearStone[j][0] && elem[c][1] == nearStone[j][1]) needToCut.push(c);
//         }
//         for (var m = 0; m < group.length; m++) {
//           if (elem[c][0] == group[m][0] && elem[c][1] == group[m][1]) needToCut.push(c);
//         }
//       }

//       for (var c = needToCut.length; c > 0; c--) {
//         elem.splice(needToCut[c - 1], 1);
//       }

//       nearStone = nearStone.concat(elem);

//       needToCut = [];
//       for (var c = 0; c < nearStone.length; c++) {
//         for (var j = 0; j < group.length; j++) {
//           if (nearStone[c][0] == group[j][0] && nearStone[c][1] == group[j][1]) needToCut.push(c);
//         }
//       }

//       for (var c = needToCut.length; c > 0; c--) {
//         nearStone.splice(needToCut[c - 1], 1);
//       }

//       group = group.concat(nearStone);
//     }
//   }

//   if (amount != group.length) {
//     outGroup = getGroup(group);
//   } else {
//     return group;
//   }

//   return outGroup;
// }

// start check

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
          checkElement(elem, nearStone, c, j, needToCut);
        }
        for (var m = 0; m < group.length; m++) {
          checkElement(elem, group, c, m, needToCut);
        }
      }

      clearGroupStone(c, needToCut, elem);
      nearStone = nearStone.concat(elem);

      needToCut = [];
      for (var c = 0; c < nearStone.length; c++) {
        for (var j = 0; j < group.length; j++) {
          checkElement(nearStone, group, c, j, needToCut);
        }
      }

      clearGroupStone(c, needToCut, nearStone);
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

function clearGroupStone(c, needToCut, f){
  for (var c = needToCut.length; c > 0; c--) {
  f.splice(needToCut[c - 1], 1);
  }
}

function checkElement(element1, element2, item1, item2, needToCut) {
  if (element1[item1][0] == element2[item2][0] && element1[item1][1] == element2[item2][1]) {
    needToCut.push(item1);
  }
}

// end check

function checkGroup(group){
  var alive = false;
  group.forEach(function(item, i, arr) {
    if (checkNearEmpty(board, item[0], item[1])) {
      alive = true;
    };
  })
  return alive;
}

function fill(group, state) {
  if (typeof(group[0]) == 'object') {
    if (typeof(group[0][0]) == 'object') {
      group.forEach(function(item) {
        item.forEach(function(item) {
          board[item[0]][item[1]] = state;
        })
      });
    } else {
      group.forEach(function(item) {
        board[item[0]][item[1]] = state;
      });
    };
  };
}

function trueKill(coord, color, killed) {
  var group = getGroup(coord, color);
  var sideColor = board[coord[0][0]][coord[0][1]]
  if (sideColor == color) {
    if (checkGroup(group) != true){
      fill(group, 'empty');
      if (group.length == 1) {
        fillKo(true, color, group[0], 1);
      }
      killed.dead = true;
      killed.amount.push(group.length);
      killed.coords.push(group);
    }
  }
}

function kill(board, x, y, color) {
  var killed = {
    dead: false,
    amount: [],
    coords: []
  };

  if (color == 'black') {
    if (x < 8) trueKill([[x + 1, y]], 'white', killed);
    if (x > 0) trueKill([[x - 1, y]], 'white', killed);
    if (y < 8) trueKill([[x, y + 1]], 'white', killed);
    if (y > 0) trueKill([[x, y - 1]], 'white', killed);
  } else {
    if (x < 8) trueKill([[x + 1, y]], 'black', killed);
    if (x > 0) trueKill([[x - 1, y]], 'black', killed);
    if (y < 8) trueKill([[x, y + 1]], 'black', killed);
    if (y > 0) trueKill([[x, y - 1]], 'black', killed);
  }
  return killed;
}

window.step = step;

}());
