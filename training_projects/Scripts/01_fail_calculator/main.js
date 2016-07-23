'use strict';

var enteredNum = [];
var displayInput;
var displayResult;
var firstNum;
var bufferNum;
var integerArr = [];
var resultNum;

function calc() {

  firstNum = enteredNum.join('')

  var k = [];
  for (var i = 0; i < firstNum.length; i++) {
    +firstNum[i];
    if (isFinite(firstNum[i])) {
      k.push(firstNum[i]);
  } else {
    var p = k.join('');
    integerArr.push(p);
    integerArr.push(firstNum[i]);
    k = [];
  }
}

  displayInput = document.getElementById('enteredNumber');
  displayInput.innerHTML = firstNum;
  displayResult = document.getElementById('result')
  displayResult.innerHTML = resultNum;
}

function clean () {
  alert(integerArr);
  firstNum = 0;
  bufferNum = 0;
  enteredNum = [];
  displayInput = document.getElementById('enteredNumber');
  displayInput.innerHTML = 0;
  displayResult = document.getElementById('result')
  displayResult.innerHTML = 0;
}