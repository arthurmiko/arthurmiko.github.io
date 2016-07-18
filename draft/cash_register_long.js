'use strict';

function checkCashRegister(price, cash, cid) {
  var change = [];
  var result;
  var difference = (cash - price) * 1000;
  var compare = difference;

  var funds = 0;

  for (var i = 0; i < cid.length; i++) {
    cid[i][1] = cid[i][1] * 1000;
    funds += cid[i][1];
  }


  if (funds == compare) {
    return 'Closed';
  }

  while (difference >= 100000 && cid[8][1] >= 100000) {
    difference -= 100000;
    cid[8][1] -= 100000;
    var exist = false;
    for (var i = 0; i < change.length; i++) {
      if (change[i][0] == 'ONE HUNDRED') {
        exist = i;
        break;
      }
    }
    if (exist !== false) {
      change[exist][1] += 100000;
    } else {
      change.push(['ONE HUNDRED', 100000])
    }
  }

  while (difference >= 20000 && cid[7][1] >= 20000) {
    difference -= 20000;
    cid[7][1] -= 20000;
    var exist = false;
    for (var i = 0; i < change.length; i++) {
      if (change[i][0] == 'TWENTY') {
        exist = i;
        break;
      }
    }
    if (exist !== false) {
      change[exist][1] += 20000;
    } else {
      change.push(['TWENTY', 20000])
    }
  }

  while (difference >= 10000 && cid[6][1] >= 10000) {
    difference -= 10000;
    cid[6][1] -= 10000;
    var exist = false;
    for (var i = 0; i < change.length; i++) {
      if (change[i][0] == 'TEN') {
        exist = i;
        break;
      }
    }
    if (exist !== false) {
      change[exist][1] += 10000;
    } else {
      change.push(['TEN', 10000])
    }
  }

  while (difference >= 5000 && cid[5][1] >= 5000) {
    difference -= 5000;
    cid[5][1] -= 5000;
    var exist = false;
    for (var i = 0; i < change.length; i++) {
      if (change[i][0] == 'FIVE') {
        exist = i;
        break;
      }
    }
    if (exist !== false) {
      change[exist][1] += 5000;
    } else {
      change.push(['FIVE', 5000])
    }
  }

  while (difference >= 1000 && cid[4][1] >= 1000) {
    difference -= 1000;
    cid[4][1] -= 1000;
    var exist = false;
    for (var i = 0; i < change.length; i++) {
      if (change[i][0] == 'ONE') {
        exist = i;
        break;
      }
    }
    if (exist !== false) {
      change[exist][1] += 1000;
    } else {
      change.push(['ONE', 1000])
    }
  }

  while (difference >= 250 && cid[3][1] >= 250) {
    difference -= 250;
    cid[3][1] -= 250;
    var exist = false;
    for (var i = 0; i < change.length; i++) {
      if (change[i][0] == 'QUARTER') {
        exist = i;
        break;
      }
    }
    if (exist !== false) {
      change[exist][1] += 250;
    } else {
      change.push(['QUARTER', 250])
    }
  }

  while (difference >= 100 && cid[2][1] >= 100) {
    difference -= 100;
    cid[2][1] -= 100;
    var exist = false;
    for (var i = 0; i < change.length; i++) {
      if (change[i][0] == 'DIME') {
        exist = i;
        break;
      }
    }
    if (exist !== false) {
      change[exist][1] += 100;
    } else {
      change.push(['DIME', 100])
    }
  }

  while (difference >= 50 && cid[1][1] >= 50) {
    difference -= 50;
    cid[1][1] -= 50;
    var exist = false;
    for (var i = 0; i < change.length; i++) {
      if (change[i][0] == 'NICKEL') {
        exist = i;
        break;
      }
    }
    if (exist !== false) {
      change[exist][1] += 50;
    } else {
      change.push(['NICKEL', 50])
    }
  }

  while (difference >= 10 && cid[0][1] >= 10) {
    difference -= 10;
    cid[0][1] -= 10;
    var exist = false;
    for (var i = 0; i < change.length; i++) {
      if (change[i][0] == 'PENNY') {
        exist = i;
        break;
      }
    }
    if (exist !== false) {
      change[exist][1] += 10;
    } else {
      change.push(['PENNY', 10])
    }
  }

  var fullChange = 0;
  for (var i = 0; i < change.length; i++) {
    fullChange += change[i][1];
  }

  for (var i = 0; i < change.length; i++) {
    change[i][1] = change[i][1] / 1000;
  }

  for (var i = 0; i < cid.length; i++) {
    cid[i][1] = cid[i][1] / 1000;
  }

  if (fullChange == compare) {
    result = change;
  } else {
    result = 'Insufficient Funds';
  }

  return result;
}

// Example cash-in-drawer array:
//0 [["PENNY", 1.01],
//1 ["NICKEL", 2.05],
//2 ["DIME", 3.10],
//3 ["QUARTER", 4.25],
//4 ["ONE", 90.00],
//5 ["FIVE", 55.00],
//6 ["TEN", 20.00],
//7 ["TWENTY", 60.00],
//8 ["ONE HUNDRED", 100.00]]

// checkCashRegister(19.50, 20.00, [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.10], ["QUARTER", 4.25], ["ONE", 90.00], ["FIVE", 55.00], ["TEN", 20.00], ["TWENTY", 60.00], ["ONE HUNDRED", 100.00]]);
// [["QUARTER", 0.50]];

// checkCashRegister(19.50, 20.00, [["PENNY", 0.01], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 1.00], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]])
// "Insufficient Funds".

// checkCashRegister(19.50, 20.00, [["PENNY", 0.50], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]])

checkCashRegister(3.26, 100.00, [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.10], ["QUARTER", 4.25], ["ONE", 90.00], ["FIVE", 55.00], ["TEN", 20.00], ["TWENTY", 60.00], ["ONE HUNDRED", 100.00]])