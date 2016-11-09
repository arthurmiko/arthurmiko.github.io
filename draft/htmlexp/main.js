'use strict';

function highAndLow(numbers){
  numbers = numbers.split(' ').map(Number);
  return Math.max.apply(null, numbers) + ' ' + Math.min.apply(null, numbers);
}

console.log(highAndLow('1 2 3'));