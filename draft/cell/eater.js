var eater = {
  posX: genNum(0, ctxInfo.width * used.mul - ctxInfo.cell, 'integer'),
  posY: genNum(0, ctxInfo.height * used.mul - ctxInfo.cell, 'integer'),
  size: ctxInfo.cell,
  move: {
    deg: genNum(-Math.PI, Math.PI, 'float'),
    cos: Math.cos(this.deg),
    sin: Math.sin(this.deg),
    dir: true // true - поворот по часовой стрелке
  },
  steps: {
    count: 0, // steps counter before reach limit
    limit: 20 // limit steps in one direction
  },
  speed: 7 // in px
}

function moveEater() {
  ctx.fillStyle = '#151';
  ctx.fillRect(eater.posX, eater.posY, eater.size * used.mul, eater.size * used.mul);

  eater.steps.count++;
  if (eater.steps.count > eater.steps.limit) {
    eater.steps.count = 0;
    eater.move.dir = Math.random() > 0.5 ? true : false;
  }

  if (eater.move.dir) {
    if (eater.move.deg - used.deg < -Math.PI) {
      eater.move.deg = Math.PI;
    } else {
      eater.move.deg -= used.deg;
    }
  } else {
    if (eater.move.deg - used.deg > Math.PI) {
      eater.move.deg = -Math.PI;
    } else {
      eater.move.deg += used.deg;
    }
  }
  deg.value = eater.move.deg;

  eater.move.cos = Math.cos(eater.move.deg);
  eater.move.sin = Math.sin(eater.move.deg);
  // коэфициент подобия
  var scaleFactor = eater.speed / Math.sqrt(Math.pow(eater.move.cos, 2) + Math.pow(eater.move.sin, 2));
  if (scaleFactor !== Infinity) {
    eater.posX += eater.move.cos * scaleFactor;
    eater.posY += eater.move.sin * scaleFactor;
  }
};