"use strict";

$(document).ready(function(){
  console.log('Begin!');
  var canvas = document.getElementById('game-surface'),
      gl = canvas.getContext('webgl');

      if (!gl) {
        console.log('Fallback to experimental webgl')
        gl = canvas.getContext('experimental-webgl');
      }

      if (!gl) {
        alert('Doesn`t support WebGL')
      }

  canvas.width = window.innerWidth - 20;
  canvas.height = window.innerHeight - 20;
  gl.viewport(0, 0, window.innerWidth - 20, window.innerHeight - 20);

  gl.clearColor(0.75, 0.3, 0.5, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
})