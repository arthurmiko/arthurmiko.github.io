'use strict';

(function() {
  document.addEventListener('DOMContentLoaded', function () {
    var services = document.querySelectorAll('.js_multislides')[0];

    lory(services, {
      slidesToScroll: 1,
      infinite: 4
    });
    var clients = document.querySelectorAll('.js_multislides')[1];

    lory(clients, {
      slidesToScroll: 1,
      infinite: 4
    });
  });

  var prev = document.querySelectorAll('.prev');
  var next = document.querySelectorAll('.next');
  prev.forEach(cancelSelect);
  next.forEach(cancelSelect);

  $('#works').mixItUp();

  function cancelSelect(value) {
    value.onmousedown = function() {
      return false;
    };
  }
})()

function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 51.130271, lng: -0.165854},
    scrollwheel: false,
    zoom: 15
  });
  var styles = [
    {
      stylers: [
        { hue: "#3e5a92" },
        { saturation: -80 }
      ]
    }
  ];

  map.setOptions({styles: styles});

  var myLatLng = {lat: 51.130271, lng: -0.165854};
  var image = 'images/logo/pointer.png'
  var marker = new google.maps.Marker({
    position: myLatLng,
    map: map,
    icon: image,
    title: '26 Aenean dignissim str.'
  });
}
initMap();

$(window).on('load', function() {
  $(this).impulse();
});