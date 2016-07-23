'use strict';

(function() {

function rand(max) {
  return Math.floor(Math.random() * max);
}

var stepTimer = setTimeout(function tick(){
    var x = rand(9);
    var y = rand(9);
    step(x, y);
  stepTimer = setTimeout(tick, 100);
}, 100);

}())