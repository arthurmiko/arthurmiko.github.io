'use strict';

document.addEventListener('DOMContentLoaded', function () {
  var simple = document.querySelector('.js_percentage');

  lory(simple, {
    infinite: 1,
    slideSpeed: 1000
  });
});

var nextSlide = document.querySelector('.js_next');
var sliderTimer = setTimeout(function tick(){
  nextSlide.click();
  sliderTimer = setTimeout(tick, 3000);
}, 3000);
