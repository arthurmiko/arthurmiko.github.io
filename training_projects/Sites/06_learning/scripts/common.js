'use strict';

$(document).ready(function() {

  $(function() {
    $('#gallery_container').mixItUp();
  });

  $('.gallery_icons').magnificPopup({
    delegate: 'a:nth-child(2)',
    type:'image',
    gallery: {enabled: true}
  });

});
