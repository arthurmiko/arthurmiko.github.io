// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Runner = Matter.Runner,
    Events = Matter.Events,
    Body = Matter.Body,
    Composites = Matter.Composites,
    Composite = Matter.Composite,
    Common = Matter.Common,
    Events = Matter.Events,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse;

var fullWidth = window.innerWidth,
    halfWidth = fullWidth * 0.5,
    fullHeight = window.innerHeight,
    halfHeight = fullHeight * 0.5;

// create an engine
var engine = Engine.create();
engine.world.gravity.x = 0;
engine.world.gravity.y = 0;

// create a renderer
var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
      width: fullWidth,
      height: fullHeight,
      showPositions: true,
      showAngleIndicator: true,
      wireframes: true
    }
});



var borderT = Bodies.rectangle(halfWidth, 20, fullWidth - 20, 10, { isStatic: true });
var borderB = Bodies.rectangle(halfWidth, fullHeight - 20, fullWidth - 20, 10, { isStatic: true });
var borderL = Bodies.rectangle(20, halfHeight, 10, fullHeight, { isStatic: true });
var borderR = Bodies.rectangle(fullWidth - 20, halfHeight, 10, fullHeight, { isStatic: true });
// var some = Body.create({
//   position: {x: halfWidth / 2, y: halfHeight / 2}
// });

var stack = Composites.stack(halfWidth * 0.75, 50, 10, 6, 10, 10, function(x, y, column, row) {
  return Bodies.circle(x, y, genNum(20, 30, 'integer'), {
    friction: 0,
    restitution: 1,
    density: 3,
    angle: genNum(0, Math.PI * 2, 'float'),
    force: {x: genNum(-50, 50, 'integer'), y: genNum(-50, 50, 'integer')},
    torque: 2500
  });
});

var mouseConstraint = MouseConstraint.create(engine, {
    mouse: Mouse.create(document.querySelector('canvas'))
});
// Matter.Composites.stack(xx, yy, columns, rows, columnGap, rowGap, callback)
// World.add(engine.world, [some, bordserR, borderL, borderT, borderB]);
World.add(engine.world, [stack, borderB, borderL, borderR, borderT], mouseConstraint);

Events.on(engine, "afterUpdate", function(){

})
Events.on(engine, 'tick', function() {
    var allBodies = Composite.allBodies(engine.world);
    MouseConstraint.update(mouseConstraint, allBodies);
    _triggerEvents(mouseConstraint);
});
Events.trigger(engine, 'tick')

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);

function genNum(min, max, type) {
  if (type == 'integer') {
    return Math.floor(Math.random() * (max - min + 1) + min);
  } else if (type == 'float') {
    return Math.random() * (max - min) + min;
  }
};