/*
добавить каждому бойду элемент рандомности в движении повороты влево вправо
*/

'use strict';

console.log('START');
var canvas = document.createElement("canvas"),
    ctx = canvas.getContext("2d"),
    w = canvas.width = window.innerWidth,
    h = canvas.height = window.innerHeight,
    circleRadius = 3,
    countTick = 0,
    rulesQuotient = {
      one: 0.01,
      two: 0.5,
      three: 0.05
    };
    // displayQuotient = {
    //   one: document.querySelector('#ruleOne p span'),
    //   two: document.querySelector('#ruleTwo p span'),
    //   three: document.querySelector('#ruleThree p span')
    // }

ctx.fillStyle = 'rgba(0, 0, 0, 1)';
ctx.fillRect(0, 0, w, h);

document.body.appendChild(canvas);

var boids = [];
init(100);
setInterval(draw, 5);

// Main

function Boid(coords, speed) {
  this.v = {x: speed.x, y: speed.y, sc: speed.sc}; // v = velocity
  this.c = {x: coords.x, y: coords.y}; // c = circle
  this.color = randomInteger(0, 360);
  this.rotator = {
    deg: randomFloat(0.1, 1) * Math.PI / 180,
    dir: 'clockwise',
    tumbler: false
  }

  this.updateCoords = function() {
    this.c.x += this.v.x * this.v.sc;
    this.c.y += this.v.y * this.v.sc;

    // Loop borders
    if ( this.c.x + circleRadius > w - w / 2 ) {
      this.c.x = ( -w / 2 ) + 5;
    }
    if ( this.c.x - circleRadius < 0 - w / 2 ) {
      this.c.x = ( w / 2 ) - 5;
    }
    if ( this.c.y + circleRadius > h - h / 2 ) {
      this.c.y = ( -h / 2 ) + 5;
    }
    if ( this.c.y - circleRadius < 0 - h / 2 ) {
      this.c.y = ( h / 2 ) - 5;
    }
  }

  this.normalize = function() {
    this.v.len = Math.sqrt( this.v.x * this.v.x + this.v.y * this.v.y );
    this.v.x = this.v.x / this.v.len;
    this.v.y = this.v.y / this.v.len;
  }

  this.rotate = function() {
    this.v.x = this.v.x * Math.cos( this.rotator.deg ) - this.v.y * Math.sin( this.rotator.deg );
    this.v.y = this.v.x * Math.sin( this.rotator.deg ) + this.v.y * Math.cos( this.rotator.deg );
  }
}

function align(ballList) {
  var newVX = [], newVY = [], newVXRuleOne = [], newVYRuleOne = [],
      i = 0, j = 0, dx, dy, d, n;

  for ( i = 0; i < boids.length; i++ ) {
    newVX[i] = 0;
    newVY[i] = 0;
    newVXRuleOne[i] = 0;
    newVYRuleOne[i] = 0;
    n = 0;

    for ( j = 0; j < boids.length; j++ ) {
      // if ( i === j ) continue;
      dx = boids[j].c.x - boids[i].c.x;
      dy = boids[j].c.y - boids[i].c.y;
      d = Math.sqrt( dx * dx + dy * dy );

      if ( d < 300 ) {

        if ( d < 30 ) {
          n++;
          newVXRuleOne[i] += boids[j].c.x
          newVYRuleOne[i] += boids[j].c.y
        }

        if ( d < 30 ) {
          // rule 2: Boids try to keep a small distance away from other boids
          newVX[i] -= ( boids[j].c.x - boids[i].c.x ) * rulesQuotient.two;
          newVY[i] -= ( boids[j].c.y - boids[i].c.y ) * rulesQuotient.two;
        }

        // // rule 3: Boids try to match velocity with near boids.
        newVX[i] += ( boids[j].v.x / ( d + rulesQuotient.three ) );
        newVY[i] += ( boids[j].v.y / ( d + rulesQuotient.three ) );
      }
    }

    if ( n > 1 ) {
      newVX[i] -= ( newVXRuleOne[i] / n ) * rulesQuotient.one;
      newVY[i] -= ( newVYRuleOne[i] / n ) * rulesQuotient.one;
    }
  }

  for ( i = 0; i < boids.length; i++ ) {
    boids[i].v.x = newVX[i];
    boids[i].v.y = newVY[i];
  }
}

// Render

function draw() {
  countTick++;

  // displayQuotient.one.innerHTML = rulesQuotient.one;
  // displayQuotient.two.innerHTML = rulesQuotient.two;
  // displayQuotient.three.innerHTML = rulesQuotient.three;

  // if (countTick % 1000 === 0) turnOnRotate();
  ctx.fillStyle = 'rgba(20, 20, 20, 1)';
  ctx.fillRect(0, 0, w, h);
  ctx.save();
  ctx.translate( w/2, h/2 );

  updateAndDraw();

  ctx.restore();
}

function updateAndDraw() {
  align();
  for (var i in boids) {
    boids[i].normalize();
    boids[i].updateCoords();
    if ( boids[i].rotator.tumbler ) boids[i].rotate();

    ctx.beginPath();
    ctx.arc(boids[i].c.x, boids[i].c.y, circleRadius, 0, Math.PI * 2);
    ctx.strokeStyle = 'hsla(' + boids[i].color + ', 100%, 50%, 1)';
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(boids[i].c.x, boids[i].c.y);
    ctx.lineTo(boids[i].c.x + boids[i].v.x * boids[i].v.sc * 10, boids[i].c.y + boids[i].v.y * boids[i].v.sc * 10);
    ctx.strokeStyle = 'hsla(' + boids[i].color + ', 100%, 50%, 0.3)';
    ctx.stroke();
  }
}

// Control

window.addEventListener('keydown', function(e) {
  console.log( 'e.keyCode: ' + e.keyCode );
  // space LURD
  if ( [32, 37, 38, 39, 40, 49, 50, 51, 52, 53, 83].indexOf(e.keyCode) > -1 ) {
    e.preventDefault();
    switch(e.keyCode) {
      case 32:
        init(100);
        break;
      case 37:
        turnOnRotate();
        break;
      case 38:
        randomizeSpeed();
        break;
      case 39:
        turnOffRotate();
        break;
      case 40:
        stabilizeSpeed();
        break;
      case 49:
        case1_49();
        break;
      case 50:
        case1_50();
        break;
      case 51:
        case1_51();
        break;
      case 52:
        case1_52();
        break;
      case 53:
        case1_53();
        break;
      case 83:
        init(10);
        break;
    }
  }
}, false);

window.addEventListener('click', function(e) {
  boids.push(new Boid({
    x: ( - w / 2 ) + e.clientX,
    y: ( - h / 2 ) + e.clientY
  }, {
    x: randomFloat( -1, 1 ),
    y: randomFloat( -1, 1 ),
    sc: 1
    // sc: randomFloat( 0.5, 1 )
  }));
})

// ruleOnePlus.onclick = function() {
//   rulesQuotient.one += 0.01;
// }

// ruleOneMinus.onclick = function() {
//   rulesQuotient.one -= 0.01;
// }

// ruleTwoPlus.onclick = function() {
//   rulesQuotient.two += 0.1;
// }

// ruleTwoMinus.onclick = function() {
//   rulesQuotient.two -= 0.1;
// }

// ruleThreePlus.onclick = function() {
//   rulesQuotient.three += 0.01;
// }

// ruleThreeMinus.onclick = function() {
//   rulesQuotient.three -= 0.01;
// }

function init(boidsCount) {
  var cx, cy;
  for (var i = 0; i < boidsCount; i++) {
    cx = randomFloat( ( -w + circleRadius + 10 ) / 2, ( w - circleRadius - 10 ) / 2 );
    cy = randomFloat( ( -h + circleRadius + 10 ) / 2, ( h - circleRadius - 10 ) / 2 );

    while ( !checkIntersectionForNewCircle(cx, cy) ) {
      cx = randomFloat( -w / 2, w / 2 );
      cy = randomFloat( -h / 2, h / 2 );
    }

    boids.push(new Boid({
      x: cx,
      y: cy
    }, {
      x: randomFloat( -1, 1 ),
      y: randomFloat( -1, 1 ),
      sc: 1
      // sc: randomFloat( 0.5, 1 )
    }));
  }
}

function checkIntersectionForNewCircle(x, y) {
  var valid = true;
  var rad = Math.pow(2 * circleRadius, 2);

  for (var i in boids) {
    var bi = boids[i];
    var bix = bi.c.x;
    var biy = bi.c.y;
    var dx = bix - x;
    var dy = biy - y;
    var d = dx * dx + dy * dy;
    if (d < rad) {
      valid = false;
      break;
    }
  }

  return valid;
}

// Service

function randomFloat(min, max) {
  return min + Math.random() * (max - min);
}

function randomInteger(min, max) {
  return Math.floor( min + Math.random() * (max + 1 - min) );
}

// Testing

function case1_49() {
  console.log('case1_49')
  boids.push(new Boid({
    x: -100,
    y: -100
  }, {
    x: 1,
    y: 1,
    sc: 0.1
  }));

  boids.push(new Boid({
    x: 100,
    y: -100
  }, {
    x: -1,
    y: 1,
    sc: 0.1
  }));
}

function case1_50() {
  console.log('case1_50')
  boids.push(new Boid({
    x: -100,
    y: -100
  }, {
    x: 1,
    y: 1,
    sc: 0.5
  }));

  boids.push(new Boid({
    x: 100,
    y: -100
  }, {
    x: -1,
    y: 1,
    sc: 0.5
  }));

  boids.push(new Boid({
    x: -100,
    y: 100
  }, {
    x: 1,
    y: -1,
    sc: 0.5
  }));

  boids.push(new Boid({
    x: 100,
    y: 100
  }, {
    x: -1,
    y: -1,
    sc: 0.5
  }));
}

function case1_51() {
  console.log('case1_51');
  boids.push(new Boid({
    x: 0,
    y: 0
  }, {
    x: -1,
    y: 0,
    sc: 0.1
  }));

  boids.push(new Boid({
    x: 50,
    y: 0
  }, {
    x: -1,
    y: 0.1,
    sc: 0.2
  }));
}

function case1_52() {
  console.log('case1_52');
  boids.push(new Boid({
    x: 0,
    y: -100
  }, {
    x: -1,
    y: 0,
    sc: 1
  }));

  boids.push(new Boid({
    x: 0,
    y: 0
  }, {
    x: 1,
    y: 0,
    sc: 1
  }));
}

function case1_53() {
  console.log('case1_53');
  boids.push(new Boid({
    x: 0,
    y: 0
  }, {
    x: 0,
    y: 1,
    sc: 1
  }));

  boids.push(new Boid({
    x: 100,
    y: 0
  }, {
    x: 0,
    y: -1,
    sc: 1
  }));
}