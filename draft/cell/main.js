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


TODO

1. Проверка пустого места перед добавлением нового eater
2. Отскок при столкновении с другим eater по одной из осей координат
3. Устранить залипание eater друг в друга про столкновении

*/

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
var maxEaters = 20;
var eaterLifetime = 3000;
var eaterSpeedMin = 10;
var eaterSpeedMax = 10;
var eaterSizeMin = 25;
var eaterSizeMax = 50;
var eaterSteps = 20;
var eaterRotation = true;
var acid = false;

function Eater(serialNum) {
  var size = this.size = genNum(eaterSizeMin, eaterSizeMax, 'integer')
  var speed = this.speed = genNum(eaterSpeedMin, eaterSpeedMax, 'integer') // in px
  this.posXY = genPosXY('width', 'height', size, speed);
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
  this.color = getRandomColor();
  this.lifetime = eaterLifetime;
  this.collisionX = false;
  this.collisionY = false;
  this.serialNum = serialNum;
}

// Добавить учёт скорости в расчёты - должно устранить залипания на мелких расстояниях
function genPosXY(width, height, size, speed) {
  var posXY = [];
  posXY[0] = genNum(0, (ctxInfo[width] - size) * used.mul, 'integer');
  posXY[1] = genNum(0, (ctxInfo[height] - size) * used.mul, 'integer');
  for (var i = 0; i < eaters.length; i++) {
    if (((posXY[0] > eaters[i].posXY[0] && posXY[0] < eaters[i].posXY[0] + eaters[i].size * used.mul) ||
         (posXY[0] + size * used.mul > eaters[i].posXY[0] && posXY[0] + size * used.mul < eaters[i].posXY[0] + eaters[i].size * used.mul)) &&
        ((posXY[1] > eaters[i].posXY[1] && posXY[1] < eaters[i].posXY[1] + eaters[i].size * used.mul) ||
         (posXY[1] + size * used.mul > eaters[i].posXY[1] && posXY[1] + size * used.mul < eaters[i].posXY[1] + eaters[i].size * used.mul))) {
      posXY = genPosXY(width, height, size);
    }
  }
  return posXY;
}

function moveEater(eater, fix) {
  eater.lifetime--;
  eater.steps.count++;
  if (eater.lifetime < 1) {
    return false;
  }

  if (acid) {
    ctx.fillStyle = getRandomColor();
  } else {
    ctx.fillStyle = eater.color;
  }
  ctx.fillRect(eater.posXY[0], eater.posXY[1], eater.size * used.mul, eater.size * used.mul);
  // ctx.fillStyle = '#000';
  // ctx.font = "175px serif";
  // ctx.fillText(eater.serialNum, eater.posXY[0] + 30, eater.posXY[1] + 150);

  if (eater.steps.count > eater.steps.limit) {
    eater.steps.count = 0;
    eater.move.dir = Math.random() > 0.5 ? true : false;
  }

  // перевести все рассчёты на использование центральной координаты объекта
  // var currentEaterCenterX = (eater.posXY[0] + eater.size * used.mul) / 2;
  // var currentEaterCenterY = (eater.posXY[1] + eater.size * used.mul) / 2;

  for (var i = 0; i < eaters.length; i++) {
    // var checkEaterCenterX = (eaters[i].posXY[0] + eaters[i].size * used.mul) / 2;
    // var checkEaterCenterY = (eaters[i].posXY[1] + eaters[i].size * used.mul) / 2;
    // if ((Math.abs(currentEaterCenterX - checkEaterCenterX) < ((eater.size * used.mul + eaters[i].size * used.mul) / 2)) &&
    //     (Math.abs(currentEaterCenterY - checkEaterCenterY) < ((eater.size * used.mul + eaters[i].size * used.mul) / 2))) {
//наиболее точная реализация столкновений на данный момент
    if (((eater.posXY[0] > eaters[i].posXY[0] && eater.posXY[0] < eaters[i].posXY[0] + eaters[i].size * used.mul) ||
         (eater.posXY[0] + eater.size * used.mul > eaters[i].posXY[0] && eater.posXY[0] + eater.size * used.mul < eaters[i].posXY[0] + eaters[i].size * used.mul)) &&
        ((eater.posXY[1] > eaters[i].posXY[1] && eater.posXY[1] < eaters[i].posXY[1] + eaters[i].size * used.mul) ||
         (eater.posXY[1] + eater.size * used.mul > eaters[i].posXY[1] && eater.posXY[1] + eater.size * used.mul < eaters[i].posXY[1] + eaters[i].size * used.mul))) {
      if (Math.abs(eater.posXY[0] - eaters[i].posXY[0]) > Math.abs(eater.posXY[1] - eaters[i].posXY[1])) {
          eaters[i].collisionX = true;
          eater.collisionX = true;
      } else {
          eaters[i].collisionY = true;
          eater.collisionY = true;
      }
    }
  }

  if (eater.posXY[0] < 5 || eater.posXY[0] > (ctxInfo.width - eater.size) * used.mul - 5 || eater.collisionX) {
    eater.move.deg = Math.PI - eater.move.deg;
  }
  if (eater.posXY[1] < 5 || eater.posXY[1] > (ctxInfo.width - eater.size) * used.mul - 5 || eater.collisionY) {
    eater.move.deg = -eater.move.deg;
  }

  var rotationDeg = genNum(used.degMin, used.degMax, 'float')
  // ограничение на повороты возле стен, для предотвращения залипания
  if (eaterRotation &&
      eater.posXY[0] > 20 && eater.posXY[0] < (ctxInfo.width - eater.size) * used.mul - 20 &&
      eater.posXY[1] > 20 && eater.posXY[1] < (ctxInfo.width - eater.size) * used.mul - 20) {
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
    eater.posXY[0] += eater.move.cos * scaleFactor;
    eater.posXY[1] += eater.move.sin * scaleFactor;
  }

  eater.collisionX = false;
  eater.collisionY = false;
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
    eaters.push(new Eater(eaters.length));
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
$('#btnAcid').on('click', function(e){
  if ($(this).hasClass('inactivated')) {
    $(this).removeClass('inactivated').addClass('activated').text('ACID ON');
    acid = true;
  } else {
    $(this).removeClass('activated').addClass('inactivated').text('ACID OFF');
    acid = false;
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