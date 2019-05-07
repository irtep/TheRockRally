/*

Continue: 
  - checkpoints, lap calculator etc.
  - painted lines/circles to track for direction and finish line.
  COULD TRY THIS ARROW:
  
  function canvas_arrow(context, fromx, fromy, tox, toy, r){
    var x_center = tox;
    var y_center = toy;

    var angle;
    var x;
    var y;

    context.beginPath();

    angle = Math.atan2(toy-fromy,tox-fromx)
    x = r*Math.cos(angle) + x_center;
    y = r*Math.sin(angle) + y_center;

    context.moveTo(x, y);

    angle += (1/3)*(2*Math.PI)
    x = r*Math.cos(angle) + x_center;
    y = r*Math.sin(angle) + y_center;

    context.lineTo(x, y);

    angle += (1/3)*(2*Math.PI)
    x = r*Math.cos(angle) + x_center;
    y = r*Math.sin(angle) + y_center;

    context.lineTo(x, y);

    context.closePath();

    context.fill();
  }

references if needed: 
https://davetayls.me/html5racer/
https://github.com/davetayls/html5racer/blob/Part02/racer.js

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
https://stackoverflow.com/questions/43558803/javascript-rotate-a-shape-by-a-fixed-angle

coll detect:

https://stackoverflow.com/questions/41489627/collision-between-two-elements-with-rotating/41513341#41513341

should check this next i think:
https://github.com/Sinova/Collisions
*/
  