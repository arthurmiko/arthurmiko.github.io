var canvas = document.createElement( 'canvas' ),
    ctx = canvas.getContext( '2d' ),
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight,
    avg = ( width + height ) / 2,
    blobs = [],
    speedRange = 3,
    maxCombo = 15,
    radius = 2,
    count = avg * 0.5,
    PI = Math.PI,
    TWOPI = PI * 2;

// Blob - конструктор частиц
function Blob() {
  this.radius = radius; // 2
  this.targetRadius = radius; // 2
  this.x = rand( this.radius, width - this.radius ); // от левого до правого края - радиус
  this.y = rand( this.radius, height - this.radius ); // от верха до низа - радиус
  this.vx = rand( -speedRange, speedRange ); // случайное число от -3 до 3
  this.vy = rand( -speedRange, speedRange );
  this.hue = 0; 
  this.combineCount = 1;
  this.deathFlag = 0;
}

/*
Методы Blob:
  1. update() ок
  2. checkCollisions()
  3. wrapBounds() ок
  4. render() ок

1. createBlobs() - blobs.push( new Blob() );
2. loop()
  2.1 - requestAnimationFrame(loop) - планирует следующий запуск loop
  2.2 - update() каждой частицы
  2.3 - render() каждой частицы
*/