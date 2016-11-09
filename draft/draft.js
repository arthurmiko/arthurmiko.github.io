'use strict';

var btn = document.getElementById('btn');

var coords = {};
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(pos) {
    coords.lat = pos.coords.latitude;
    coords.lon = pos.coords.longitude;
  })
}

btn.onclick = function() {
  var xhr = new XMLHttpRequest();

  xhr.open('GET', 'coords=' + JSON.stringify(coords), true);

  xhr.send();

  xhr.onreadystatechange = function() {
    if (xhr.readyState != 4) return;

    if (xhr.status != 200) {
      alert (xhr.status + ': ' + xhr.statusText);
    } else {
      var text = JSON.parse(xhr.responseText);
      console.log(text);
    }
  }
}
