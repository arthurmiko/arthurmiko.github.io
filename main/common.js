"use strict";

var headerHeight = document.querySelector('header').offsetHeight;

document.querySelector('.navmenu').onclick = function(e) {
  e.preventDefault();
  if (e.target.tagName.toLowerCase() === 'a') {
    var id = e.target.getAttribute('href').slice(1);
    if (id) {
      var top = document.getElementById(id).offsetTop;
      window.scrollTo(0, top - headerHeight);
    } else {
      window.scrollTo(0, 0);
    }
  }
}