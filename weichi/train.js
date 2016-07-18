'use strict';

function check (us,coor, color, ch, ckill){ 
if(us && coor == color){ 
  ch = getGroup(us, color); 
  if (checkgroup(check) != true){ 
    fillEmpty(check);
    if (ch.length == 1) {
          fillKo(true, color, coor, 1);
        }
        cKill = true;
      }
  }
}

function kill(board, x, y, color) {
  var check;
  var checkKill = false;
  if (color == 'black') {
    check (x < 8, board[x + 1][y], 'white', check, chekKill); 
    check (x > 0, board[x - 1][y], 'white', check, checkKill); 
    check (y < 8, board[x][y + 1], 'white', check, checkKill); 
    check (y > 0, board[x][y - 1], 'white', check, checkKill);
    return checkKill;
  } else{
    check (x < 8, board[x + 1][y], 'white', check, checkKill); 
    check (x > 0, board[x - 1][y], 'white', check, checkKill); 
    check (y < 8, board[x][y + 1], 'white', check, checkKill); 
    check (y > 0, board[x][y - 1], 'white', check, checkKill);
  return checkKill;
}
}