'use strict';

var arr = [], tmpArr = [];

for (var i = 1; i <= 999999; i++) {
  tmpArr = [];
  tmpArr = tmpArr.concat(i.toString().split(''));
  while (tmpArr.length < 6) {
    tmpArr.unshift('0');
  }
  if (Number(tmpArr.slice(0, 3).reduce(summ)) == Number(tmpArr.slice(3, 6).reduce(summ))) arr.push(tmpArr);
}

console.log(arr);
console.log(arr.length);

function summ(acc, curr, i) {
  return Number(acc) + Number(curr);
}