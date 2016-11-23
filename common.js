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

  var modal = document.querySelector('.active .preview-modal-scroll');
  modal.style.right = modal.clientWidth - modal.offsetWidth + 'px';
})

$('.modal-btn-close').click(function(e){
  $('.preview-modal').css('opacity', 0);
  $('.preview-modal').one('transitionend', function() {
    $('.preview-modal .active')
      .css('display', 'none')
      .removeClass('active');
    $('.preview-modal').css('display', 'none');
  })
})

$('.navmenu-btn').click(function(){
  $('.navmenu').toggleClass('active');
})