'use strict';

function randomInteger(min, max) {
  var rand = min - 0.5 + Math.random() * (max - min + 1)
  rand = Math.round(rand);
  return rand;
}

var draw = {
  ctx: document.getElementById('board').getContext('2d'),
  cell: 40,

  dynamicArr: [
                [4, 2, 3, 1, 2, 3, 1, 2, 3, 4],
                [3, 1, 2, 3, 1, 2, 3, 1, 2, 3],
                [2, 3, 1, 2, 3, 1, 2, 3, 1, 2],
                [1, 2, 3, 1, 2, 3, 1, 2, 3, 1],
                [3, 1, 2, 3, 1, 2, 3, 1, 2, 3],
                [2, 3, 1, 2, 3, 1, 2, 3, 1, 2],
                [1, 2, 3, 1, 2, 3, 1, 2, 3, 1],
                [3, 1, 2, 3, 1, 2, 3, 1, 2, 3],
                [2, 3, 1, 2, 3, 1, 2, 3, 1, 2],
                [4, 2, 3, 1, 2, 3, 1, 2, 3, 4],
              ],

  fillArr: function() {
    for (var i = 0; i < draw.dynamicArr.length; i++) {
      for (var c = 0; c < draw.dynamicArr[i].length; c++) {
        (function(i, c){
          var coord = draw.dynamicArr[i][c];
          draw.square(i, c);
          if (coord == 1) {
            draw.circleDinSingle(i, c);
          } else if (coord == 2) {
            draw.rhombusDinSingle(i, c);
          } else if (coord == 3) {
            draw.arcDinSingle(i, c);
          } else if (coord == 4) {
            draw.circleDinSingle(i, c);
            draw.rhombusDinSingle(i, c);
            draw.arcDinSingle(i, c);
          };
        })(i, c);
      };
    };
  },

  timeSquareArr: (function(){
    var temp = new Array(10);
    for (var i = 0; i < temp.length; i++) {
      temp[i] = new Array(10);
    };
    return temp;
  }()),

  timeCircleArr: (function(){
    var temp = new Array(10);
    for (var i = 0; i < temp.length; i++) {
      temp[i] = new Array(10);
    };
    return temp;
  }()),  

  timeRhombusArr: (function(){
    var temp = new Array(10);
    for (var i = 0; i < temp.length; i++) {
      temp[i] = new Array(10);
    };
    return temp;
  }()),  

  timeArcArr: (function(){
    var temp = new Array(10);
    for (var i = 0; i < temp.length; i++) {
      temp[i] = new Array(10);
    };
    return temp;
  }()),

  newColor: function() {
    draw.red = randomInteger(0, 255);
    draw.green = randomInteger(0, 255);
    draw.blue = randomInteger(0, 255);
  },

  putColor: function() {
    var r = draw.red;
    var g = draw.green;
    var b = draw.blue;
    var rgb = "rgb(" + r + ", " + g + ", " + b + ")";
    return rgb;
  },

  square: function genSquare(x, y) {
    draw.newColor();
    draw.ctx.fillStyle = draw.putColor();
    draw.ctx.fillRect(draw.cell * x, draw.cell * y, draw.cell, draw.cell);
    return genSquare;
  },

  squareDinSingle: function(i, c) {
          draw.timeSquareArr[i][c] = setTimeout (function repSq(){
            var rnd = randomInteger(1, 100);
            draw.square(i, c);
            draw.timeSquareArr[i][c] = setTimeout (repSq, rnd * 100);
          }, 0);    
        },

  squareDin: function() {
    for (var i = 0; i < draw.timeSquareArr.length; i++) {
      for (var c = 0; c < draw.timeSquareArr[i].length; c++) {
        (function(i, c) {
          draw.timeSquareArr[i][c] = setTimeout (function repSq(){
            var rnd = randomInteger(1, 100);
            draw.square(i, c);
            draw.timeSquareArr[i][c] = setTimeout (repSq, rnd * 100);
          }, 0);    
        })(i, c);
      };
    };
  },

  circleDinSingle: function(i, c) {
          draw.timeCircleArr[i][c] = setTimeout (function repSq(){
            var rnd = randomInteger(1, 100);
            draw.circle(i, c);
            draw.timeCircleArr[i][c] = setTimeout (repSq, rnd * 100);
          }, 0);    
        },

  circleDin: function() {
    for (var i = 0; i < draw.timeCircleArr.length; i++) {
      for (var c = 0; c < draw.timeCircleArr[i].length; c++) {
        (function(i, c) {
          draw.timeCircleArr[i][c] = setTimeout (function repSq(){
            var rnd = randomInteger(1, 100);
            draw.circle(i, c);
            draw.timeCircleArr[i][c] = setTimeout (repSq, rnd * 100);
          }, 0);    
        })(i, c);
      };
    };
  },  

  circle: function genCircle(x, y) {
    draw.newColor();
    draw.ctx.fillStyle = draw.putColor();
    draw.ctx.beginPath();
    draw.ctx.arc(draw.cell * x + 20, draw.cell * y + 20, 20, 0, 2 * Math.PI, true);
    draw.ctx.fill();
    return genCircle;
  },

  rhombus: function genRhombus(x, y) {
    draw.newColor();
    draw.ctx.fillStyle = draw.putColor();
    draw.ctx.beginPath();
    draw.ctx.moveTo(draw.cell * x + 20, draw.cell * y);
    draw.ctx.lineTo(draw.cell * x + 40, draw.cell * y + 20);
    draw.ctx.lineTo(draw.cell * x + 20, draw.cell * y + 40);
    draw.ctx.lineTo(draw.cell * x, draw.cell * y + 20);
    draw.ctx.lineTo(draw.cell * x + 20, draw.cell * y);
    draw.ctx.fill();
  },

  rhombusDinSingle: function(i, c) {
          draw.timeRhombusArr[i][c] = setTimeout (function repSq(){
            var rnd = randomInteger(1, 100);
            draw.rhombus(i, c);
            draw.timeRhombusArr[i][c] = setTimeout (repSq, rnd * 100);
          }, 0);    
        },

  rhombusDin: function() {
    for (var i = 0; i < draw.timeRhombusArr.length; i++) {
      for (var c = 0; c < draw.timeRhombusArr[i].length; c++) {
        (function(i, c) {
          draw.timeRhombusArr[i][c] = setTimeout (function repSq(){
            var rnd = randomInteger(1, 100);
            draw.rhombus(i, c);
            draw.timeRhombusArr[i][c] = setTimeout (repSq, rnd * 100);
          }, 0);    
        })(i, c);
      };
    };
  }, 

  arc: function genArc(x, y) {
    draw.newColor();
    draw.ctx.fillStyle = draw.putColor();
    draw.ctx.beginPath();
    draw.ctx.moveTo(draw.cell * x + 20, draw.cell * y + 20);
    draw.ctx.arc(draw.cell * x, draw.cell * y, 20, (1 / 2) * Math.PI, 0, true);
    draw.ctx.moveTo(draw.cell * x + 20, draw.cell * y + 20);
    draw.ctx.arc(draw.cell * x + 40, draw.cell * y, 20, Math.PI, (1 / 2) * Math.PI, true);
    draw.ctx.moveTo(draw.cell * x + 20, draw.cell * y + 20);
    draw.ctx.arc(draw.cell * x + 40, draw.cell * y + 40, 20, -(1 / 2) * Math.PI, Math.PI, true);
    draw.ctx.moveTo(draw.cell * x + 20, draw.cell * y + 20);
    draw.ctx.arc(draw.cell * x, draw.cell * y + 40, 20, 0, -(1 / 2) * Math.PI, true);
    draw.ctx.fill();
  },

  arcDinSingle: function(i, c) {
          draw.timeArcArr[i][c] = setTimeout (function repSq(){
            var rnd = randomInteger(1, 100);
            draw.arc(i, c);
            draw.timeArcArr[i][c] = setTimeout (repSq, rnd * 100);
          }, 0);    
        },

  arcDin: function() {
    for (var i = 0; i < draw.timeArcArr.length; i++) {
      for (var c = 0; c < draw.timeArcArr[i].length; c++) {
        (function(i, c) {
          draw.timeArcArr[i][c] = setTimeout (function repSq(){
            var rnd = randomInteger(1, 100);
            draw.arc(i, c);
            draw.timeArcArr[i][c] = setTimeout (repSq, rnd * 100);
          }, 0);    
        })(i, c);
      };
    };
  }, 

  fill: function(arg) {
    for (var i = 0; i < 10; i++) {
      for (var c = 0; c < 10; c++) {
        arg(i, c);
      };
    };
  },
};

/*
draw.squareDin();
draw.circleDin();
draw.rhombusDin();
draw.arcDin();

var arr = [
            [0, 1, 2, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
          ]

var redBlock = "#500";
var greenBlock = "#050";
var blueBlock = "#005";

for (var i = 0; i < arr.length; i++) {
  for (var c = 0; c < arr[i].length; c++){
    if (arr[i][c] == 0) {
      draw.ctx.fillStyle = redBlock;
    } else if (arr[i][c] == 1) {
      draw.ctx.fillStyle = greenBlock;
    } else if (arr[i][c] == 2) {
      draw.ctx.fillStyle = blueBlock;
    };
    console.log(arr[i][c]);
    draw.ctx.fillRect(i * 100, c * 100, 100, 100);
  }
}
*/

draw.fillArr();