if (Math.abs(eater.posX - eaters[i].posX < (eater.size + eaters[i].size) / 2 * used.mul && eater.posX !== eaters[i].posX &&
Math.abs(eater.posY - eaters[i].posY) < (eater.size + eaters[i].size) / 2 * used.mul && eater.posY !== eaters[i].posY) {
// eaters[i].collision = true; .........



for (var i = 0; i < eaters.length; i++) {
  if (((eater.posXY[0] > eaters[i].posXY[0] && eater.posXY[0] < eaters[i].posXY[0] + eaters[i].size * used.mul) ||
       (eater.posXY[0] + eater.size * used.mul > eaters[i].posXY[0] && eater.posXY[0] + eater.size * used.mul < eaters[i].posXY[0] + eaters[i].size * used.mul)) &&
      ((eater.posXY[1] > eaters[i].posXY[1] && eater.posXY[1] < eaters[i].posXY[1] + eaters[i].size * used.mul) ||
       (eater.posXY[1] + eater.size * used.mul > eaters[i].posXY[1] && eater.posXY[1] + eater.size * used.mul < eaters[i].posXY[1] + eaters[i].size * used.mul))) {
        eaters[i].collision = true;
        eater.collision = true;
  }
}

/*
Как выглядит моя проверка если её описать словами?

ЕСЛИ
(
 ((левый край текущего элемента БОЛЬШЕ левого края элемента[i] И
   левый край текущего элемента МЕНЬШЕ правого края элемента[i])
    ИЛИ
  (правый край текущего элемента БОЛЬШЕ левого края элемента[i] И
   правый край текущего элемента МЕНЬШЕ правого края элемента[i]))
И
 ((верхний край текущего элемента БОЛЬШЕ верхнего края элемента[i] И
   верхний край текущего элемента МЕНЬШЕ нижнего края элемента[i])
    ИЛИ
  (нижний край текущего элемента БОЛЬШЕ верхнего края элемента[i] И
   нижний край текущего элемента МЕНЬШЕ нижнего края элемента[i]))
)


*/










// Хотя вообще говоря даже при этом они будут проникать друг в друга за счет того, что величины шагов слишком большие.

// А в дальнейшем можно написать кусок кода в function moveEater(eater, fix), построенную примерно так: 

for (i; i < 500; i++) {
if (Math.abs(eater.posX - eaters[i].posX < (eater.size + eaters[i].size)/2 * used.mul && eater.posX !== eaters[i].posX)) {
  eater.move.deg = Math.PI - eater.move.deg;
  eater[i].move.deg = Math.PI - eater[i].move.deg;
} else if (Math.abs(eater.posY - eaters[i].posY) < (eater.size + eaters[i].size)/2 * used.mul && eater.posY !== eaters[i].posY) {
    eater.move.deg = -eater.move.deg;
    eaters[i].move.deg = -eaters[i].move.deg;
  }
}

// Я думаю, с застреванием может помочь, если после зрекального отражения отменять случайный поворот на маленький угол. Например, если в этом месте:

if (eater.posX < 2 || eater.posX > (ctxInfo.width - eater.size) * used.mul - 2 || eater.collision) {
eater.move.deg = Math.PI - eater.move.deg;
}
if (eater.posY < 2 || eater.posY > (ctxInfo.width - eater.size) * used.mul - 2 || eater.collision) {
eater.move.deg = -eater.move.deg;
}

// сделать так в теле if, чтобы eater делал шаг и затем return. Или поперемещать блоки внутри moveEater; я думаю, что все-таки в этом все дело