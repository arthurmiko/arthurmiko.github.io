'use strict';
console.log('The Show Must Go On!');

//Map

function initMap() {
  var mapDiv = document.getElementById('map');

  var mapOptions = {
    center: {lat: 55.863365, lng: 36.906352},
    zoom: 10,
    scrollwheel: false,
    styles: [{"featureType":"road.highway","elementType":"geometry","stylers":[{"saturation":-100},{"lightness":-8},{"gamma":1.18}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"saturation":-100},{"gamma":1},{"lightness":-24}]},{"featureType":"poi","elementType":"geometry","stylers":[{"saturation":-100}]},{"featureType":"administrative","stylers":[{"saturation":-100}]},{"featureType":"transit","stylers":[{"saturation":-100}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"saturation":-100}]},{"featureType":"road","stylers":[{"saturation":-100}]},{"featureType":"administrative","stylers":[{"saturation":-100}]},{"featureType":"landscape","stylers":[{"saturation":-100}]},{"featureType":"poi","stylers":[{"saturation":-100}]},{}]
  }

  var map = new google.maps.Map(mapDiv, mapOptions);

  var image = {
    url: 'images/pointblue2.png',
    size: new google.maps.Size(30, 50),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(15, 50)
  }

  var benone = new google.maps.LatLng(55.775334, 37.471192);

  var marker = new google.maps.Marker({
    position: benone,
    map: map,
    icon: image,
    title: 'г. Москва, просп. Маршала Жукова, д. 39 корп. 1'
  });

  var benone2 = new google.maps.LatLng(55.980367, 37.259621);

  var marker2 = new google.maps.Marker({
    position: benone2,
    map: map,
    icon: image,
    title: 'г. Зеленоград, ВКЗ, пр.4807, д. 1, стр.1'
  });

  var benone3 = new google.maps.LatLng(55.912249,36.8263786);

  var marker3 = new google.maps.Marker({
    position: benone3,
    map: map,
    icon: image,
    title: 'Московская обл., г. Истра, ул. Панфилова, д. 9'
  });

};

// Timer

function showTime() {
  var today = new Date();
  var nextMonth = new Date(today.getFullYear(), (today.getMonth() + 1));
  var timeLeft = nextMonth - today;
  var msInDay = 1000 * 60 * 60 * 24;
  var msInHour = 1000 * 60 * 60;
  var msInMin = 1000 * 60;

  var daysLeft = Math.floor(timeLeft / msInDay);
  var hoursLeft = Math.floor((timeLeft - msInDay * daysLeft) / msInHour);
  var minLeft = Math.floor((timeLeft - (msInDay * daysLeft + msInHour * hoursLeft)) / msInMin);
  var secLeft = Math.floor((timeLeft - (msInDay * daysLeft + msInHour * hoursLeft + msInMin * minLeft)) / 1000);

  function suffixSelect(checkedNum) {
    var nominative = 1;
    var genetive = 2;
    var genetivePlural = 3;
    var meaningfulDigit = 0;

    if (checkedNum > 9) {
      meaningfulDigit = checkedNum + '';
      meaningfulDigit = meaningfulDigit.slice(-1);
    } else {
      meaningfulDigit = checkedNum;
    }

    if (meaningfulDigit == 0 || checkedNum >= 5 && checkedNum <= 20 || checkedNum > 20 && meaningfulDigit >= 5 && checkedNum > 20 && meaningfulDigit <= 9) {
      return genetivePlural;
    } else if (meaningfulDigit == 1) {
      return nominative;
    } else if (meaningfulDigit >= 2 && meaningfulDigit <= 4) {
      return genetive;
    }
  }

  var daysWord = 0;
  var hoursWord = 0;
  var minWord = 0;
  var secWord = 0;

  function changeWordCase(days, hours, min, sec) {
    var daysCase = suffixSelect(days);
    if (daysCase == 1) {
      daysWord = 'день';
    } else if (daysCase == 2) {
      daysWord = 'дня';
    } else if (daysCase == 3) {
      daysWord = 'дней';
    };
    var hoursCase = suffixSelect(hours);
    if (hoursCase == 1) {
      hoursWord = 'час';
    } else if (hoursCase == 2) {
      hoursWord = 'часа';
    } else if (hoursCase == 3) {
      hoursWord = 'часов';
    };
    var minCase = suffixSelect(min);
    if (minCase == 1) {
      minWord = 'минута';
    } else if (minCase == 2) {
      minWord = 'минуты';
    } else if (minCase == 3) {
      minWord = 'минут';
    };
    var secCase = suffixSelect(sec);
    if (secCase == 1) {
      secWord = 'секунда';
    } else if (secCase == 2) {
      secWord = 'секунды';
    } else if (secCase == 3) {
      secWord = 'секунд';
    };
  };
  changeWordCase(daysLeft, hoursLeft, minLeft, secLeft);

  if (minLeft < 10) {
    minLeft = '0' + minLeft;
  }

  if (secLeft < 10) {
    secLeft = '0' + secLeft;
  }

  document.querySelectorAll('.days-left-digit')[0].innerHTML = daysLeft;
  document.querySelectorAll('.hours-left-digit')[0].innerHTML = hoursLeft;
  document.querySelectorAll('.min-left-digit')[0].innerHTML = minLeft;
  document.querySelectorAll('.sec-left-digit')[0].innerHTML = secLeft;

  document.querySelectorAll('.days-left-word')[0].innerHTML = daysWord;
  document.querySelectorAll('.hours-left-word')[0].innerHTML = hoursWord;
  document.querySelectorAll('.min-left-word')[0].innerHTML = minWord;
  document.querySelectorAll('.sec-left-word')[0].innerHTML = secWord;

  document.querySelectorAll('.days-left-digit')[1].innerHTML = daysLeft;
  document.querySelectorAll('.hours-left-digit')[1].innerHTML = hoursLeft;
  document.querySelectorAll('.min-left-digit')[1].innerHTML = minLeft;
  document.querySelectorAll('.sec-left-digit')[1].innerHTML = secLeft;

  document.querySelectorAll('.days-left-word')[1].innerHTML = daysWord;
  document.querySelectorAll('.hours-left-word')[1].innerHTML = hoursWord;
  document.querySelectorAll('.min-left-word')[1].innerHTML = minWord;
  document.querySelectorAll('.sec-left-word')[1].innerHTML = secWord;
  setTimeout(showTime, 1000);
};
showTime();

$(document).on('click','.menu a', function(e){
  var nameLink = $(this).attr('href');
  var destination = $(nameLink).offset().top;
  $('html, body').stop().animate({
     scrollTop: destination
  }, 1000);
  e.preventDefault();
});

$(document).on('click','form button', function(){
  $(this).closest('form').find('.validity-erroneous').removeClass('validity-erroneous');

  $(this).closest('form').find('input[type="text"]').each(function(){
  var _this = $(this);
  var val = $(this).val();
    if(!val.length) {
      _this.addClass('validity-erroneous');
    }
  });
  if($(this).closest('form').find('.validity-erroneous').length) {
    $(this).closest('form').find('button').text('Заполните форму');
    return false;
  }
});

$(document).on('click','.popup-open', function(){
  var name = $(this).attr('name');
  $('.popup#'+name+'').css('opacity','1').addClass('visible');
});

$(document).on('click','.popup-wrap .bg', function(){
  setTimeout(function() {$(".popup-wrap").removeClass('visible');}, 500)
  $(".popup-wrap").css('opacity','0');
  event.stopPropagation();
});
