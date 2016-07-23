'use strict'
console.log('Hi!');

var rockUserDef;
var scissorsUserDef;
var paperUserDef;
var rockPCDef = $('#id_rock_pc').attr('class');
var scissorsPCDef = $('#id_scissors_pc').attr('class');
var paperPCDef = $('#id_paper_pc').attr('class');
var pcSelectShort;
var userSelectShort;
var checkSelect = false;
var defUserChoice = $('#user_choice').attr('class');
var countGame = 0;
var win = 0;
var lose = 0;
var draw = 0;
var percent = 0;

function pcPreSelect() {
  var randomResult = Math.random();
  console.log(randomResult);
  $('#id_rock_pc').attr('class', rockPCDef);  
  $('#id_scissors_pc').attr('class', scissorsPCDef);  
  $('#id_paper_pc').attr('class', paperPCDef);

  if (randomResult < 0.3) {
    $('#id_rock_pc').attr('class', 'image_pc rock' + ' ' + 'image_selected');
    pcSelectShort = 1;
  } else if (randomResult >= 0.3 && randomResult < 0.7) {
    $('#id_scissors_pc').attr('class', 'image_pc scissors' + ' ' + 'image_selected');
    pcSelectShort = 2;
  } else {
    $('#id_paper_pc').attr('class', 'image_pc paper' + ' ' + 'image_selected');
    pcSelectShort = 3;
  };
};

function pcSelect () {
  if (pcSelectShort == 1) {
    $('#pc_choice').attr('class', 'image_pc rock');
  } else if (pcSelectShort == 2) {
    $('#pc_choice').attr('class', 'image_pc scissors');
  } else if (pcSelectShort == 3) {
    $('#pc_choice').attr('class', 'image_pc paper');
  } else {
    console.log('you make mistake');
  };
};

function runPCPreSelect () {
  for (var i = 1; i < 30; i++) {
    setTimeout(pcPreSelect, 100*i);
  };
};

function comparsion () {
  if (userSelectShort == 1) {
    if (pcSelectShort == 1) {
      $('#winner_id').attr('class', 'winner winner_draw');
      draw++;
    } else if (pcSelectShort == 2) {
      $('#winner_id').attr('class', 'winner winner_user');
      win++;
    } else {
      $('#winner_id').attr('class', 'winner winner_pc');
      lose++;
    };
  } else if (userSelectShort == 2) {
    if (pcSelectShort == 1) {
      $('#winner_id').attr('class', 'winner winner_pc');
      lose++;
    } else if (pcSelectShort == 2) {
      $('#winner_id').attr('class', 'winner winner_draw');
      draw++;
    } else {
      $('#winner_id').attr('class', 'winner winner_user');
      win++;
    };
  } else {
    if (pcSelectShort == 1) {
    $('#winner_id').attr('class', 'winner winner_user');
    win++;
    } else if (pcSelectShort == 2) {
      $('#winner_id').attr('class', 'winner winner_pc');
      lose++;
    } else {
      $('#winner_id').attr('class', 'winner winner_draw');
      draw++;
    };
  };
  countGame++;
};

function statRefresh () {
  $('#count').html(countGame);
  $('#win_id').html(win);
  $('#lose_id').html(lose);
  $('#draw_id').html(draw);
  if(countGame > 0) {
    percent = Math.round((win * 100)/countGame);
    $('#percent_id').html(percent);
  }
};

function defineWinner () {
  runPCPreSelect();
  setTimeout(pcSelect, 3500);
  setTimeout(comparsion, 4000);
  setTimeout(statRefresh, 4500);
};

$('#id_rock_user').click(function () {
  var lengthControl = $('#user_choice').attr('class');
  if (lengthControl.length < 11) {
    $('#user_choice').attr('class',
      $(this).attr('class'));
    rockUserDef = $(this).attr('class');
    $(this).attr('class', 'image_user rock' + ' ' + 'image_selected');
    userSelectShort = 1;
    defineWinner();
  };
});

$('#id_scissors_user').click(function () {
  var lengthControl = $('#user_choice').attr('class');
  if (lengthControl.length < 11) {
    $('#user_choice').attr('class',
      $(this).attr('class'));
    scissorsUserDef = $(this).attr('class');
    $(this).attr('class', 'image_user scissors' + ' ' + 'image_selected');
    userSelectShort = 2;
    defineWinner();
  };
});

$('#id_paper_user').click(function () {
  var lengthControl = $('#user_choice').attr('class');
  if (lengthControl.length < 11) {
    $('#user_choice').attr('class',
      $(this).attr('class'));
    paperUserDef = $(this).attr('class');  
    $(this).attr('class', 'image_user paper' + ' ' + 'image_selected');
    userSelectShort = 3;
    defineWinner();
  };
});

$('#yes').click(function () {
  $('#id_rock_user').attr('class', rockUserDef);
  $('#id_scissors_user').attr('class', scissorsUserDef);
  $('#id_paper_user').attr('class', paperUserDef);
  $('#id_rock_pc').attr('class', rockPCDef);  
  $('#id_scissors_pc').attr('class', scissorsPCDef);  
  $('#id_paper_pc').attr('class', paperPCDef);  
  $('#user_choice').attr('class', defUserChoice);
  $('#pc_choice').attr('class', 'pc_blank');
  $('#winner_id').attr('class', 'winner');
});

$('#no').click(function () {
  alert('Game over');
  window.location.reload();
});
