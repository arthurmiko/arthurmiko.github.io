'use strict';

window.onload = function() {

var radioInputsBanner = document.querySelectorAll('.tagline_selector input');
var radioLabelsBanner = document.querySelectorAll('.tagline_selector label');
var radioBtnsList = document.querySelectorAll('.tagline_selector ul');
var taglines = document.querySelectorAll('.tagline');
var arrowRight = document.querySelectorAll('.arrow_right')[0];
var arrowLeft = document.querySelectorAll('.arrow_left')[0];
var userActive = false;
var autoId;

taglines[0].classList.toggle('tl_visible');
radioInputsBanner[0].setAttribute('checked', 'checked');

radioBtnsList[0].addEventListener('click', selectBannerBtn);
radioBtnsList[0].addEventListener('click', userActivity);
arrowRight.addEventListener('click', turnRight);
arrowRight.addEventListener('click', userActivity);
arrowLeft.addEventListener('click', turnLeft);
arrowLeft.addEventListener('click', userActivity);

for (var i = 0; i < radioInputsBanner.length; i++) {
  radioInputsBanner[i].addEventListener('click', prevDef);
  radioLabelsBanner[i].addEventListener('click', prevDef);
};

autoSlide();

function prevDef() {
  event.preventDefault();
}

function selectBannerBtn() {
  var selected = event.target.getAttribute('for');
  if (!!selected == false) {
    return;
  };

  var prevSelected = convertId(searchSelected());
  var selectedNum = convertId(selected);

  slideOut(selectedNum, prevSelected);
  setTimeout(function(){slideIn(selectedNum, prevSelected)}, 400);
};

function slideIn(cur, prev) {
  if (cur > prev) {
    taglines[cur].classList.add('tl_visible', 'fadeInRight');
    radioInputsBanner[cur].setAttribute('checked', 'checked');
  } else {
    taglines[cur].classList.add('tl_visible', 'fadeInLeft');
    radioInputsBanner[cur].setAttribute('checked', 'checked');
  }
}

function slideOut(cur, prev) {
  if (cur > prev) {
    taglines[prev].classList.add('fadeOutLeft');
  } else {
    taglines[prev].classList.add('fadeOutRight');    
  }
  setTimeout (function(){
    for(var i = 0; i < radioInputsBanner.length; i++) {
      taglines[i].classList.remove('tl_visible', 'fadeInRight', 'fadeOutLeft', 'fadeOutRight');
      radioInputsBanner[i].removeAttribute('checked');
    };
  }, 400);
}

function turnRight() {
  var prevSelected = convertId(searchSelected());
  var nextSelected;
  if (prevSelected == 0) {
    nextSelected = 1;
  } else if (prevSelected == 1) {
    nextSelected = 2;
  } else if (prevSelected == 2) {
    nextSelected = 3;
  } else if (prevSelected == 3) {
    nextSelected = 4;
  } else if (prevSelected == 4) {
    nextSelected = 0;
  };

  slideOut(nextSelected, prevSelected);
  setTimeout(function(){slideIn(nextSelected, prevSelected)}, 400);
}

function turnLeft() {
  var prevSelected = convertId(searchSelected());
  var nextSelected;
  if (prevSelected == 0) {
    nextSelected = 4;
  } else if (prevSelected == 1) {
    nextSelected = 0;
  } else if (prevSelected == 2) {
    nextSelected = 1;
  } else if (prevSelected == 3) {
    nextSelected = 2;
  } else if (prevSelected == 4) {
    nextSelected = 3;
  };

  slideOut(nextSelected, prevSelected);
  setTimeout(function(){slideIn(nextSelected, prevSelected)}, 400);
}

function autoSlide() {
  autoId = setTimeout(function autoSlideTimeout() {
    if (userActive == true) {
      return;
    };
    turnRight();
    autoId = setTimeout(autoSlideTimeout, 3000);
  }, 3000);
};

function userActivity() {
  userActive = true;
  setTimeout(function() {
    userActive = false;
    clearTimeout(autoId);
    autoSlide();
  }, 7000)
};

function searchSelected() {
  for (var i = 0; i < radioInputsBanner.length; i++) {
    if (radioInputsBanner[i].checked == true) {
      return radioInputsBanner[i].id;
    };
  };
};

function convertId(textId) {
  if (textId == 'r_first') {
    return 0;
  } else if (textId == 'r_second') {
    return 1;
  } else if (textId == 'r_third') {
    return 2;
  } else if (textId == 'r_fourth') {
    return 3;
  } else if (textId == 'r_fifth') {
    return 4;
  } else {
    return;
  };
};

};
