function Rect(color, x, y, width, height) {
  this.color = color;
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.draw = function(){
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };
};

function update() {
  aiMove();

  if (ball.y < 0 || ball.y + ball.height > field.height) {
    ball.vY = -ball.vY;
  }

  if (ball.x < 0) {
    ball.vX = -ball.vX;
    player.scores++;
  }

  if (ball.x + ball.width > field.width) {
    ball.vX = -ball.vX;
    ai.scores++;
  }

  if ((collision(ai, ball) && ball.vX < 0) || (collision(player, ball) && ball.vX > 0)) {
    ball.vX = -ball.vX;
  }

  ball.x += ball.vX;
  ball.y += ball.vY;
};

function aiMove() {
  var y;
  var vY = Math.abs(ball.vY) - 1;
  if (ball.y < ai.y + ai.height / 2) {
    y = ai.y - vY;
  } else {
    y = ai.y + vY;
  };

  ai.y = y;
};

function play() {
  drawAll();
  update();
};

function collision(objA, objB) {
  if (objA.x + objA.width  > objB.x &&
      objA.x               < objB.x + objB.width &&
      objA.y + objA.height > objB.y &&
      objA.y               < objB.y + objB.height) {
        return true;
  } else {
    return false;
  };
};

function playerMove(e) {
  var y = e.pageY - 50;
  if (player.height / 2 < y && y < field.height - player.height / 2) {
    player.y = y - player.height / 2;
  };
};

function init() {
  field = new Rect("#000", 0, 0, 640, 480);
  ai = new Rect("#FFF", 10, field.height / 2 - 40, 20, 80);
  player = new Rect("#FFF", field.width - 30, field.height / 2 - 40, 20, 80);
  ai.scores = 0;
  player.scores = 0;
  ball = new Rect("#FFF", 40, field.height / 2 - 10, 20, 20);
  ball.vX = 5;
  ball.vY = 5;
  board = document.getElementById('pong');
  board.width = field.width;
  board.height = field.height;
  ctx = board.getContext('2d');
  board.onmousemove = playerMove;
  var refreshTime = setTimeout(function refTime() {
    play();
    refreshTime = setTimeout(refTime, 10)
  });
};

function drawAll() {
  field.draw();
  ctx.font = 'bold 128px courier';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillStyle = '#ccc';
  ctx.fillText(ai.scores, 100, 0);
  ctx.fillText(player.scores, field.width - 100, 0);
  for (var i = 5; i < field.height; i+= 30) {
    ctx.fillStyle = "#ccc";
    ctx.fillRect(field.width / 2 - 1, i, 2, 20);
  };
  ai.draw();
  player.draw();
  ball.draw();
};

init();