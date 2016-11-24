"use strict";

$('.preview-item-btn div').click(function() {
  var id = this.getAttribute('data-modal-id');
  $('.preview-modal').css('display', 'block');
  $('#' + id).css('display', 'block').addClass('active')
  setTimeout(function(){
    $('.preview-modal').css('opacity', 1);
  }, 50);

  var modal = document.querySelector('.active .preview-modal-scroll');
  modal.style.right = modal.clientWidth - modal.offsetWidth + 'px';
})

$(function() {
  $('a[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top - $('header').outerHeight()
        }, 300);
        return false;
      }
    }
  });
});

function hideModal() {
  $('.preview-modal').css('opacity', 0);
  $('.preview-modal').one('transitionend', function() {
    $('.preview-modal .active')
      .css('display', 'none')
      .removeClass('active');
    $('.preview-modal').css('display', 'none');
  })
}

$('.modal-btn-close').click(function(e) {
  hideModal();
})

$(document).keydown(function(e) {
  if (e.which == 27 && $('.preview-modal-item').hasClass('active')) {
    hideModal();
  }
});

$('.navmenu, .navmenu a').click(function() {
  $('.navmenu').removeClass('active');
  $('.navmenu-btn').removeClass('active');
})

$('.navmenu-btn').click(function() {
  $('.navmenu-btn').toggleClass('active');
  $('.navmenu').toggleClass('active');
})

// document.addEventListener('backbutton', function(){
//   if ($('.preview-modal-item').hasClass('active')) {
//     hideModal();
//     return false;
//   } else {
//     navigator.app.exitApp();
//   }
// });

// $(window).on("navigate", function (event, data) {
//   var direction = data.state.direction;
//   if (direction == 'back' && $('.preview-modal-item').hasClass('active')) {
//     hideModal();
//     return false;
//   }
// });

var unloadEvent = function (e) {
    if($('.preview-modal-item').hasClass('active')) {
      hideModal();
    } else {
       return false;
    }
};
window.addEventListener("beforeunload", unloadEvent);

setInterval(function(){
  console.log($('.preview-modal-item').hasClass('active'))
}, 500);