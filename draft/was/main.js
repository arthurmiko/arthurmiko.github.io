'use strict';

var arr = [1, 2, 3];

var newArr = arr.reduce(function(a, b) {
  return a + b;
}, 4)

console.log(newArr);