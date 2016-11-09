'use strict';

$(document).ready(function() {
  $("#owl-top").owlCarousel({
    singleItem: true,
    navigation: true,
    navigationText: ['<span class="fa fa-angle-double-left"></span>', '<span class="fa fa-angle-double-right"></span>'],
    transitionStyle: 'fade'
  });

  $("#owl-bottom").owlCarousel({
    items: 6,
    pagination: false,
  });

  var owlBottom = $('#owl-bottom');
  $('.bottom-prev').click(function() {
    owlBottom.trigger('owl.prev');
  });
  $('.bottom-next').click(function() {
    owlBottom.trigger('owl.next');
  });

  var dynamicScales = document.querySelector('.dynscales');
  var scaleRotator = $('.scale-rotate');
  var scaleNum = $('.scale-num');

  $(document).scroll(function() {
    var bottomEdge = document.documentElement.clientHeight + window.pageYOffset;
    var coords = getCoords(dynamicScales);

    if (coords.bottom < bottomEdge - 30) {
      if (!scaleRotator.eq(0).hasClass('scale-rotate-50')) {
        scaleRotator.eq(0).toggleClass('scale-rotate-50');
        scaleRotator.eq(1).toggleClass('scale-rotate-70');
        scaleRotator.eq(2).toggleClass('scale-rotate-80');
        scaleRotator.eq(3).toggleClass('scale-rotate-100');

        var scaleLimits = {
          first: [0, 50],
          second: [0, 70],
          third: [0, 80],
          fourth: [0, 100],
        };
        scaleLimits.timing = [2000 / scaleLimits.first[1], 2000 / scaleLimits.second[1], 2000 / scaleLimits.third[1], 2000 / scaleLimits.fourth[1]];

        function changeTime(span, lim, timing) {
          var self = this;
          return setTimeout(function tick() {
            scaleNum.eq(span).html(lim[0]);
            if (lim[0] < lim[1]) {
              lim[0] += 1;
              self = setTimeout(tick, timing);
            } else {
              clearTimeout(self);
            };
          }, timing);
        }

        var firstScale = changeTime(0, scaleLimits.first, scaleLimits.timing[0]);
        var secondScale = changeTime(1, scaleLimits.second, scaleLimits.timing[1]);
        var thirdScale = changeTime(2, scaleLimits.third, scaleLimits.timing[2]);
        var fourthScale = changeTime(3, scaleLimits.fourth, scaleLimits.timing[3]);

      }
    }
  })

});

function getCoords(elem) {
  var box = elem.getBoundingClientRect();
  return {
    top: box.top + pageYOffset,
    bottom: box.bottom + pageYOffset
  }
}
