/*
TODO
1. Автоматическое поддерживание количества
- если число частиц стало меньше n увеличить появление новых
- по достижении порогового числа + % снова снизить

2. Обмен цветом
- выбор цветовой модели - 15 минут
- аккуратно убрать текущие цветовые методы
- добавить генерацию частиц случайного цвета
- сделать накопление цвета и генерация частиц определённого цвета
- или сделать смешивание цветов
*/

$(document).ready(function(){
var canvas = document.createElement( 'canvas' ),
    ctx = canvas.getContext( '2d' ),
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight,
    avg = ( width + height ) / 8,
    blobs = [],
    speedRange = 3,
    maxCombo = 15,
    radius = 2,
    count = avg * 0.7,
    countLimit = 4,
    PI = Math.PI,
    TWOPI = PI * 2;

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

// расчёт расстояния между частицами
function dist( p1, p2 ) {
  var dx = p1.x - p2.x,
      dy = p1.y - p2.y;
  return Math.sqrt( dx * dx + dy * dy );
}

function Blob() {
  this.radius = radius; // 2
  this.targetRadius = radius; // 2
  this.x = rand( this.radius, width - this.radius ); // от левого до правого края - радиус
  this.y = rand( this.radius, height - this.radius ); // от верха до низа - радиус
  this.vx = rand( -speedRange, speedRange ); // случайное число от -3 до 3
  this.vy = rand( -speedRange, speedRange );
  // this.hue = 0;

  this.color = genNum(1, 3, 'integer');
  if (this.color == 1) {
    this.hue = 0;
  } else if (this.color == 2) {
    this.hue = 120;
  } else {
    this.hue = 240;
  }

  this.saturation = 0;
  this.combineCount = 1;
  this.deathFlag = 0;
  this.stepLimit = genNum(0, 300, 'integer');
  this.stepCount = genNum(0, this.stepLimit, 'integer');
  this.stepDir = true;
}

// аргументом получает номер частицы
Blob.prototype.update = function( i ) {
  // убираем "мёртвые" частицы
  if( this.deathFlag ) {
    blobs.splice( i, 1 );
    return;
  }

  // взрываем частицы превысившие порог
  if( this.combineCount >= maxCombo ) {
    // примерно 11
    var j = this.combineCount - countLimit;
    // создаём новые частицы
    while( j-- ) {
      var blob = new Blob();
      // с координатами текущей
      blob.x = this.x;
      blob.y = this.y;
      blob.vx = rand( -speedRange, speedRange );
      blob.vy = rand( -speedRange, speedRange );
      // предотвращение столкновений
      blob.immuneFlag = 50;

      blob.hue = this.hue;
      blobs.push( blob );
    }
    // малозаметная вспышка на месте лопнувшей частицы
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.beginPath();
    ctx.arc( this.x, this.y, this.radius, 0, TWOPI );
    ctx.fill();
    blobs.splice( i, 1 );
    return;
  }

  // добавляем персональный номер по индексу в массиве на текущей итерации
  this.index = i;
  if( this.immuneFlag > 0 ) {
    this.immuneFlag--;
  }


  // по умолчанию targetRadius равен raduis и здесь ничего не происходит
  this.radius += ( this.targetRadius - this.radius ) * 0.2;

  if ( this.stepCount > this.stepLimit) {
    this.stepCount = 0;
    this.stepDir = !this.stepDir;
  }
  this.stepCount++;

  if (this.hue == 0) {
    if (this.stepDir) {
      this.x += this.vx;
      this.y += this.vy;
    } else {
      this.x -= this.vx;
      this.y -= this.vy;
    }
  } else if (this.hue == 120) {
    if (this.stepDir) {
      this.x += this.vx;
      this.y += this.vy;
    } else {
      this.x += this.vx;
      this.y -= this.vy;
    }
  } else {
    if (this.stepDir) {
      this.x += this.vx;
      this.y += this.vy;
    } else {
      this.x -= this.vx;
      this.y += this.vy;
    }
  }

  // от 220 и до 360
  // this.hue = 200 + ( this.combineCount / maxCombo ) * 160;
  this.saturation = 50 + ( this.combineCount / maxCombo ) * 100;
  if (this.saturation > 100) {
    this.saturation = 100;
  }

  this.wrapBounds();
  this.checkCollisions();
};

Blob.prototype.checkCollisions = function() {
  // this.colliding = 0;
  var i = blobs.length;
  while( i-- ) {
    if( this.index != i ) {
      var other = blobs[ i ];
      // если нет иммунитета И
      // растояние между текущей и другой частицей МЕНЬШЕ или РАВНО
      // сумме их радуисов
      if( !this.immuneFlag && dist( this, other ) <= this.radius + other.radius ) {
        // если радиус текущей больше радиуса другой
        if( this.radius >= other.radius ) {
          // добавляем к радиусу текущей частицы, радиус другой
          this.targetRadius += other.radius;
          // увеличиваем счётчик комбо
          this.combineCount += other.combineCount;
          // и убиваем другую частицу
          other.deathFlag = 1;
        } else {
          other.targetRadius += this.radius;
          other.combineCount += this.combineCount;
          this.deathFlag = 1;
        }
        // лишний break
        break;
      }
    }
  }
};

Blob.prototype.wrapBounds = function() {
  if( this.x + this.radius < 0 ) {
    this.x = width + this.radius;
  }
  if( this.x - this.radius > width ) {
    this.x = -this.radius;
  }
  if( this.y + this.radius < 0 ) {
    this.y = height + this.radius;
  }
  if( this.y - this.radius > height ) {
    this.y = -this.radius;
  }
};

Blob.prototype.render = function( i ) {
  ctx.beginPath();
  ctx.arc( this.x, this.y, this.radius, 0, TWOPI );
  // ctx.fillStyle = 'hsl(' + this.hue + ', 100%, 50%)';
  ctx.fillStyle = 'hsl(' + this.hue  + ',' + this.saturation + '%,' + '50%)';
  ctx.fill();
};

function createBlobs() {
  for( var i = 0; i < count; i++ ) {
    blobs.push( new Blob() );
  }
}

function loop() {
  requestAnimationFrame( loop );
  ctx.clearRect( 0, 0, width, height ); // очистка холста
  var i = blobs.length; // количество частиц
  while( i-- ) { // для каждой частицы вызывать update()
    blobs[ i ].update( i );
  }
  i = blobs.length; // восстанавливаем переменную с количеством
  while( i-- ) { // для каждой частицы вызываем render()
    blobs[ i ].render();
  }
}

document.body.appendChild( canvas );
createBlobs();
loop();

// control
controlSpeed.value = speedRange;
controlCount.value = countLimit;
controlRadius.value = maxCombo;

setInterval(function(){
  totalCount.value = blobs.length;
}, 100)

$(controlSpeed).on('change', function(){
  var s = this.value;
  if (s > 20) {
    s = 20;
  } else if (s < 1) {
    s = 1;
  }
  this.value = speedRange = s;
})

$(controlCount).on('change', function(){
  var s = this.value;
  if (s < -5) {
    s = -5;
  } else if (s > 14) {
    s = 14;
  }
  this.value = countLimit = s;
})

$(controlRadius).on('change', function(){
  var s = this.value;
  if (s > 50) {
    s = 50;
  } else if (s < 2) {
    s = 2;
  }
  this.value = maxCombo = s;
})

})