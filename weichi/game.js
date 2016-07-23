'use strict';

(function() {

function rand(max) {
  return Math.floor(Math.random() * max);
}

var player = 'black';

function AI() {
  var check = 0;
  while (player == 'black' && check < 1000) {
    check++;
    var x = rand(9);
    var y = rand(9);
    var control = step(x, y);
    if (control) changeColor();
  }
  if (check == 1000) {
    alert('You win!')
  }
}

AI();

var boardCanvas = document.getElementById('board');
boardCanvas.onclick = function(e) {
  var arrCoorX = Math.floor(e.offsetX / 50);
  var arrCoorY = Math.floor(e.offsetY / 50);
  var control = step(arrCoorX, arrCoorY);
  if (control) changeColor();
  setTimeout(AI, 100);
}

function changeColor() {
  player == 'black' ? player = 'white' : player = 'black';
}

}())