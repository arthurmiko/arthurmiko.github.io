'use strict';

var arr = [1, 2, 3, 4, 5, 6, 7, 8];

function sum(board, x) {
  if (board[x] == 2) {
    console.log('ok');
  } else {
    console.log('wrong')
  }
  board[0] = 2;
}

sum(arr, 0);

console.log(arr)