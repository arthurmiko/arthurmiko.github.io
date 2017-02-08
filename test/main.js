'use strict';

var bunchA = {
  a: function(arg) {
    console.log(arg)
  },
  // b: function() {...},
  // c: function() {...},
  
  infoA: 'someA',
  infoB: 5,
  infoC: {
    name: 'Alex'
  }
}

var bunchB = {
  a: function(arg) {
    return arg;
  },
  // b: function() {...},
  // c: function() {...},

  infoA: 'someB',
  infoB: 9,
  infoC: {
    name: 'Zick'
  }
}

bunchA.a(bunchB.a(bunchB.infoA));