"use strict"

var test = {
  drone: function() {
    return 'some text';
  }
}

var a = foo();

function foo() {
  return test.drone();
}

console.log(a)