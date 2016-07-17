'use strict';

var regexp = /#[^;\s]+/ig;
 // .match() => [#add32F, #effD452]
var str = "#add32F; #effD452"; // 09:00, 21-30
var show = str.match(re);

console.log(show);
