"use strict";

var headerHeight = $('header').outerHeight();

$('.navmenu').click(function(e) {
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
});

$('.preview-item-btn div').click(function(){
  var id = this.getAttribute('data-modal-id');
  $('.preview-modal').css('display', 'block');
  $('#' + id).css('display', 'block').addClass('active')
  setTimeout(function(){
    $('.preview-modal').css('opacity', 1);
  }, 50);
})

$('.preview-modal').click(function(e){
  if (e.target.getAttribute('data-modal') == 'close') {
    $(this).css('opacity', 0);
    $(this).one('transitionend', function() {
      $('.preview-modal-inset .active')
        .css('display', 'none')
        .removeClass('active');
      $(this).css('display', 'none');
    })
  } else { return };
})