'use strict';

var a = [[1, 1],[2, 2]];
var b = [[0, 0],[3, 3]];
var c = new Array(a.length);

for (var i = 0; i < c.length; i++) {
  c[i] = new Array(a[i].length);
}

for (var i = 0; i < a.length; i++) {
  b[i][0] = a[i][0];
  b[i][1] = a[i][1];
  c[i][0] = a[i][0];
  c[i][1] = a[i][1];
}

b[0][0] = 4;
c[0][0] = 5;

console.log('a: ' + a.join('; '));
console.log('b: ' + b.join('; '));
console.log('c: ' + c.join('; '));