'use strict';

var canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d'),
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight;
document.body.appendChild(canvas);

function rand( min, max ) {
  return Math.random() * (max - min) + min;
}

function genNum(min, max, type) {
  if (type == 'integer') {
    return Math.floor(Math.random() * (max - min + 1) + min);
  } else if (type == 'float') {
    return Math.random() * (max - min) + min;
  }
};

// function getRandomColor() {
//   var letters = '0123456789ABCDEF';
//   var color = '#';
//   for (var i = 0; i < 6; i++ ) {
//     color += letters[Math.floor(Math.random() * 16)];
//   }
//   return color;
// }

function getRandomHSLA() {
  var color = 'hsla(';
  color += genNum(0, 360, 'integer') + ',';
  color += genNum(0, 100, 'integer') + '%,';
  color += genNum(0, 100, 'integer') + '%,';
  color += genNum(0, 1, 'float') + ')';
  return color;
}

function getRandomRGBA() {
  var color = 'rgba(';
  color += genNum(0, 255, 'integer') + ',';
  color += genNum(0, 255, 'integer') + ',';
  color += genNum(0, 255, 'integer') + ',';
  color += genNum(0, 1, 'float') + ')';
  return color;
}

for (var i = 0; i < 50000; i++) {
  if (i % 2 == 0) {
    ctx.fillStyle = getRandomHSLA();
  } else {
    ctx.fillStyle = getRandomRGBA();
  }
  var radius = rand(10, 50);
  ctx.beginPath();
  ctx.arc(rand(radius, width - radius), rand(radius, height - radius), radius, 0, Math.PI * 2);
  ctx.fill();
}

setInterval(function(){
  for (var i = 0; i < 50000; i++) {
    if (i % 2 == 0) {
      ctx.fillStyle = getRandomHSLA();
    } else {
      ctx.fillStyle = getRandomRGBA();
    }
    var radius = rand(10, 50);
    ctx.beginPath();
    ctx.arc(rand(radius, width - radius), rand(radius, height - radius), radius, 0, Math.PI * 2);
    ctx.fill();
  }
}, 5000)


