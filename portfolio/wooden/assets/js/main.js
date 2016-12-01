$(document).ready(function(){

// dynamic change height of header
  function heightDetect() {
    $("header").css("height", $(window).height());
  };
  heightDetect();
  $(window).resize(function() {
    heightDetect();
  });

// menu - modal window
  $('#menu-popup-btn').click(function() {
    if ($('.menu-popup').is(':visible')) {
      $('.menu-popup').fadeOut(600);
      $('.menu-bars').toggleClass('active');
    } else {
      $('.menu-popup').fadeIn(600);
      $('.menu-bars').toggleClass('active');
    }
  });
  $('.menu-popup a').click(function() {
    $('.menu-popup').fadeOut(600);
    $('.menu-bars').toggleClass('active');
  });

// smooth scroll by click
  $('.menu-popup a, .main-nav a, .header-pgn a').mPageScroll2id();
// detect scroll for css animate element
  $('.bg-trans-f,\
     .bg-trans-dec,\
     .bg-trans-abo').animated('fadeInRight', 'fadeOutLeft');
  $('.bg-trans-w,\
     .bg-trans-d,\
     .bg-trans-a,\
     .bg-trans-fur').animated('fadeInLeft', 'fadeOutRight');

// video play in modal window only on display LTE 640px
  if (window.screen.width >= 640) {
  // include YouTube API
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  // contain all needed variables for playback YouTube video
    var player = {
      instantYT: null,
      width: null,
      aspectRatio: null,
      iframe: null,
      play: function(e) {
        e.target.playVideo();
      }
    }

  // event for include iframe and start playback
    $('.run-video').click(function(e) {
      e.preventDefault();
      var videoId = this.getAttribute('data-video-id');
      var src = 'https://www.youtube.com/embed/' + videoId + '?enablejsapi=1';
      player.iframe = document.createElement('iframe');
      player.width = $("body").width() - $("body").width() * 0.5;
      player.aspectRatio = 315 / 560;

      $(player.iframe).attr({
        id: 'player',
        width:  player.width,
        height: player.width * player.aspectRatio,
        src: src,
        frameborder: false,
        allowfullscreen: true
      })

      $('.modal-dialog').append(player.iframe);
      $('.modal-video').css('display', 'block');
      setTimeout(function(){
        $('.modal-video').css('opacity', 1);
      }, 50)
      player.instantYT = new YT.Player('player', {
        events: { 'onReady': player.play }
      });
    })
  }

// fadeout modal window
  $('.modal-video, .modal-video-close').click(function(e) {
    var modal = $('.modal-video');
    $(modal).css('opacity', 0);
    $(modal).one('transitionend', function() {
      $(modal).css('display', 'none');
      player.instantYT.destroy();
    })
  })

// change size of video iframe in modal window
  $(window).resize(function() {
    var w = $("body").width();
    player.width = w - w  * 0.5;
    $(player.iframe)
      .width(player.width)
      .height(player.width * player.aspectRatio);
  });

})