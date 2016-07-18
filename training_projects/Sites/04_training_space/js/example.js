'use strict';
console.log('Hello, my dear Example.');

var resources = 1000;
var turn = 0;

function Thing(number) {
  var lifeRange = Math.round((Math.random() * 100));
  this.name = 'thingNum_' + number;
  this.age = 0;
  this.lifeLength = lifeRange;
};

var thingArr = [];
for (var i = 0; i < 100; i++) {
  thingArr[i] = new Thing(i);
}

var spaceTurn = document.getElementById('turn');
document.getElementById('population').innerHTML = thingArr.length;
document.getElementById('resources').innerHTML = resources;

var button = document.getElementById('begin');
button.onclick = autoTurnRun;

var runId;
var checkRun = false;
function autoTurnRun() {
  if (checkRun == false) {
    checkRun = !checkRun;
    button.innerHTML = 'stop';
    runId = setInterval(autoTurn, 500);
  } else {
    checkRun = !checkRun;
    button.innerHTML = 'run';
    clearInterval(runId);
  };
};

function showTurn() {
  spaceTurn.innerHTML = turn;  
};

var thingStats = [];
function thingAging() {
  for (var i = 0; i < thingArr.length; i++) {
    var statModule = [];
    statModule.push('Age: ' + thingArr[i].age);
    statModule.push('Life: ' + thingArr[i].lifeLength);
    thingStats.push(statModule);
    console.log(thingStats);
    thingArr[i].age += 1;
    thingArr[i].lifeLength -+ 1;
  };
};

function autoTurn() {
  turn++;
  showTurn();
  thingAging();
};
