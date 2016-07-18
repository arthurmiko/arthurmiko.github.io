function resizeDetect() {
  $('.main_head').css("height", $(window).height());
  if ($(window).width() > 960) {
    $('.wrapper').css("height", $(window).height());
    $('.main_link').css("height", $(window).height());
    $('.container').css("width", '960px');
  } else if ($(window).width() < 960 && $(window).width() > 540) {
    $('.main_link').css("height", $(window).height());
    $('.container').css("width", $(window).width());
  } else {
    $('.main_link').css("height", ($(window).height() / 4));    
    $('.container').css("width", $(window).width());
  }
};

resizeDetect();
$(window).resize(function () {
  resizeDetect();
});

$('.change_color').click(changeColor);
function changeColor() {
  $('.text_about').toggleClass('black_white');
}