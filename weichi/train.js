'use strict';

var object1 = {
  name: 'Vasya',
  age: 18,
  5: 'fixe',
  '2 + 2': 'four'
};

var object2 = {
  name: 'Petya'
}

var simpleArr = [[1, 45, 76, 23],['a', 'b', 'c', 'd']];

console.log(simpleArr);

var arr = [[1, 2, 3],
           [4, 5, 6],
           [7, 8, 9]];

console.log(arr);
console.log(typeof(arr[4]));

function showName(who) {
  console.log(who.name);
}

showName(object2);
