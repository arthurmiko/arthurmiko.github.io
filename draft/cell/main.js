'use strict';

/*
Заметки по расчёту движения
1. Направление X = -1 - 1, Y = -1 - 1;
   x = 0.67 в2 = 0.4489
   y = 0.38 в2 = 0.1444
2. шаг = 3 --- найти способ увеличить шаг до 10 или больше
3. Гипотенуза корень из X 2 + Y 2 = 0.770259696
4. Кооэфициент подобия 3 / 0.770259696 = 3.89479031
5. x = 0.67 * 3.89479031 = 2.609509508 шаг
   y = 0.38 * 3.89479031 = 1.480020318 шаг
6. Плавно менять первоначальные x и y
7. Расчёт нового шага
*/

// Нужна кнопка СТОП

$(document).ready(function() {

var canvas = document.getElementById('board'),
    ctx = canvas.getContext('2d'),
    used = { // набор часто используемых чисел
      mul: 5,
      degMin: 0.0523599,
      degMax: 0.1047198,
      dPi: 2 * Math.PI
    },
    ctxInfo = {
      width: 100 * used.mul,
      height: 100 * used.mul,
      cell: 15
    },
    cleanerWorks = false;

// подготовка canvas
canvas.width = ctxInfo.width;
canvas.height = ctxInfo.height;
ctx.transform((1 / used.mul), 0, 0, (1 / used.mul), 0, 0);
ctx.fillStyle = '#efefef';
ctx.fillRect(0, 0, ctxInfo.width * used.mul, ctxInfo.height * used.mul);

var eaters = [];

var countEaters = 0;

var drawCanvas = play();
var maxEaters = 100;
var eaterLifetime = 3000;
var eaterSpeedMin = 10;
var eaterSpeedMax = 20;
var eaterSizeMin = 10;
var eaterSizeMax = 30;
var eaterSteps = 20;
var eaterRotation = true;
var newInCenter = true;

function Eater() {
  this.size = genNum(eaterSizeMin, eaterSizeMax, 'integer');
  if (newInCenter) {
    this.posX = (ctxInfo.width - this.size) * used.mul / 2;
    this.posY = (ctxInfo.height - this.size) * used.mul / 2;
  } else {
    this.posX = genNum(0, (ctxInfo.width - this.size) * used.mul, 'integer');
    this.posY = genNum(0, (ctxInfo.height - this.size) * used.mul, 'integer');
  }
  this.move = {
    deg: genNum(-Math.PI, Math.PI, 'float'),
    cos: Math.cos(this.deg),
    sin: Math.sin(this.deg),
    dir: true // true - поворот по часовой стрелке
  };
  this.steps = {
    count: 0, // steps counter before reach limit
    limit: eaterSteps // limit steps in one direction
  };
  this.speed = genNum(eaterSpeedMin, eaterSpeedMax, 'integer') // in px
  this.color = getRandomColor();
  this.lifetime = eaterLifetime;
}

function moveEater(eater, fix) {
  eater.lifetime--;
  eater.steps.count++;
  if (eater.lifetime < 1) {
    return false;
  }

  ctx.fillStyle = eater.color;
  ctx.fillRect(eater.posX, eater.posY, eater.size * used.mul, eater.size * used.mul);

  if (eater.steps.count > eater.steps.limit) {
    eater.steps.count = 0;
    eater.move.dir = Math.random() > 0.5 ? true : false;
  }

  if (eater.posX < 2 || eater.posX > (ctxInfo.width - eater.size) * used.mul - 2) {
    eater.move.deg = -(eater.move.deg + Math.PI);
  }
  if (eater.posY < 2 || eater.posY > (ctxInfo.width - eater.size) * used.mul - 2) {
    eater.move.deg = eater.move.deg + 2 * (Math.PI - eater.move.deg);
  }

  var rotationDeg = genNum(used.degMin, used.degMax, 'float')
  if (eaterRotation &&
      eater.posX > 2 && eater.posX < (ctxInfo.width - eater.size) * used.mul - 2 &&
      eater.posY > 2 && eater.posY < (ctxInfo.width - eater.size) * used.mul - 2) {
    if (eater.move.dir) {
      if (eater.move.deg - used.deg < -Math.PI) {
        eater.move.deg = eater.move.deg - rotationDeg + used.dPi;
      } else {
        eater.move.deg -= rotationDeg;
      }
    } else {
      if (eater.move.deg + used.deg > Math.PI) {
        eater.move.deg = eater.move.deg + rotationDeg + used.dPi;
      } else {
        eater.move.deg += rotationDeg;
      }
    }
  }

  eater.move.cos = Math.cos(eater.move.deg);
  eater.move.sin = Math.sin(eater.move.deg);
  // коэфициент подобия
  var scaleFactor = eater.speed / Math.sqrt(Math.pow(eater.move.cos, 2) + Math.pow(eater.move.sin, 2));
  if (scaleFactor !== Infinity) {
    eater.posX += eater.move.cos * scaleFactor;
    eater.posY += eater.move.sin * scaleFactor;
  }

  return true;
};

function play() {
  var tmpA = setTimeout(function tick() {
    step();
    drawCanvas = setTimeout(tick, 20);
  }, 20)
  return tmpA;
}

function step(fix) {
  var time = Date.now();
  ctx.fillStyle = '#efefef';
  ctx.fillRect(0, 0, ctxInfo.width * used.mul, ctxInfo.height * used.mul);

  if (eaters.length < maxEaters) {
    eaters.push(new Eater());
    countEaters++;
  };

  for (var i in eaters) {
    var tmpB = moveEater(eaters[i], fix);
    if (!tmpB) {
      eaters.splice(i, 1);
    }
  }

  perf.innerHTML = Date.now() - time;
  eatersCount.innerHTML = eaters.length;
  newEaters.innerHTML = countEaters;
}

$('#btnPlay').click(function(){
  drawCanvas = play();
})
$('#btnStop').click(function(){
  clearTimeout(drawCanvas);
})
$('#btnStep').click(function(){
  clearTimeout(drawCanvas);
  step(true);
})
$('#btnKill').click(function(){
  eaters.length = 0;
})

maxEatersInput.value = maxEaters;
eaterLifetimeInput.value = eaterLifetime;
eatersSpeedMin.value = eaterSpeedMin;
eatersSpeedMax.value = eaterSpeedMax;
eatersSizeMin.value = eaterSizeMin;
eatersSizeMax.value = eaterSizeMax;
eatersAngleMin.value = used.degMin;
eatersAngleMax.value = used.degMax;
eatersSteps.value = eaterSteps;

$('#maxEatersInput').on('change', function(e){
  maxEaters = +maxEatersInput.value;
})
$('#eaterLifetimeInput').on('change', function(e){
  eaterLifetime = +eaterLifetimeInput.value;
})
$('#eatersSpeedMin').on('change', function(e){
  eaterSpeedMin = +eatersSpeedMin.value;
})
$('#eatersSpeedMax').on('change', function(e){
  eaterSpeedMax = +eatersSpeedMax.value;
})
$('#eatersSizeMin').on('change', function(e){
  eaterSizeMin = +eatersSizeMin.value;
})
$('#eatersSizeMax').on('change', function(e){
  eaterSizeMax = +eatersSizeMax.value;
})
$('#eatersAngleMin').on('change', function(e){
  used.degMin = +eatersAngleMin.value;
})
$('#eatersAngleMax').on('change', function(e){
  used.degMax = +eatersAngleMax.value;
})
$('#eatersSteps').on('change', function(e){
  eaterSteps = +eatersSteps.value;
})

$('#btnTurn').on('click', function(e){
  if ($(this).hasClass('activated')) {
    $(this).removeClass('activated').addClass('inactivated').text('ROTATION OFF');
    eaterRotation = false;
  } else {
    $(this).removeClass('inactivated').addClass('activated').text('ROTATION ON');
    eaterRotation = true;
  }
})
$('#btnCenter').on('click', function(e){
  if ($(this).hasClass('activated')) {
    $(this).removeClass('activated').addClass('inactivated').text('NEW IN RANDOM');
    newInCenter = false;
  } else {
    $(this).removeClass('inactivated').addClass('activated').text('NEW IN CENTER');
    newInCenter = true;
  }
})

window.eaters = eaters;

/*
var cells = [];

var settings = {
  lifeTerm: 1000
}

var count = {
  total: 0,
  success: 0,
  restart: 0
};

var fillBoard = setTimeout(function tick() {
  count.total++;
  if (count.success < 50) {
    var posX = genNum(0, 290),
        posY = genNum(0, 290);
    var point = boardCtx.getImageData(posX - 1, posY - 1, 12, 12).data;

    point = point.reduce(function(a, b){
      return a + b;
    })
    if (point == 0) {
      boardCtx.fillStyle = "#252"
      boardCtx.fillRect(posX, posY, boardInfo.cell, boardInfo.cell);
      cells.push([posX, posY, Date.now()]);
      count.success++;
    } else {
      count.restart++;
    }

    if (!cleanerWorks) {
      cleaner();
      cleanerWorks = true;
    }
  }
  fillBoard = setTimeout(tick, 50);
}, 50);

function cleaner() {
  var timer = setTimeout(function tick() {
    cells.forEach(function(c, i, arr) {
    var dif = Date.now() - c[2];
      if (dif > settings.lifeTerm) {
        if (count.success > 0) {count.success--};
        boardCtx.clearRect(c[0], c[1], boardInfo.cell, boardInfo.cell);
        arr.splice(i, 1);
      }
    })
  timer = setTimeout(tick, 50);
  $('#totalcount span').text(count.success);
  }, 50);
}

$('#lifeterm span').text(settings.lifeTerm)
$('#lifetermIncrease').click(function(){
  settings.lifeTerm = settings.lifeTerm + 100;
  $('#lifeterm span').text(settings.lifeTerm)
})
$('#lifetermDecrease').click(function(){
  settings.lifeTerm = settings.lifeTerm - 100;
  $('#lifeterm span').text(settings.lifeTerm)
})

$('#eaterspeed span').text(eater.speed)
$('#eaterSpeedIncrease').click(function(){
  eater.speed = eater.speed + 1;
  $('#eaterspeed span').text(eater.speed)
})
$('#eaterspeed span').text(eater.speed)
$('#eaterSpeedDecrease').click(function(){
  eater.speed = eater.speed - 1;
  $('#eaterspeed span').text(eater.speed)
})
*/

})

function genNum(min, max, type) {
  if (type == 'integer') {
    return Math.floor(Math.random() * (max - min + 1) + min);
  } else if (type == 'float') {
    return Math.random() * (max - min) + min;
  }
};

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++ ) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}