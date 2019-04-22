function getSpeeds (rotation, speed) {
  const TO_RADIANS = Math.PI/180;
  // -45 to 45 is ok like this...
  return {
		y: Math.sin(rotation * TO_RADIANS) * speed,
		x: Math.cos(rotation * TO_RADIANS) * speed * -1,
	};
}


// key Listeners
function checkKeyPressed(pressed){ 
  
  switch (pressed.code) {
  
    // up  
    case 'ArrowUp': 
      car1.statuses.accelerate = true;
    break;
    
    // down
    case 'ArrowDown': 
      car1.statuses.braking = true;
    break;
      
    // left  
    case 'ArrowLeft': 
      car1.statuses.turnLeft = true;
    break;
      
    // right  
    case 'ArrowRight': 
      car1.statuses.turnRight = true;
    break;
      
    default: console.log('not found this key(pressed)');  
  }
}
function checkKeyReleased(released){
  
  switch (released.code) {
  
    // up  
    case 'ArrowUp': 
      car1.statuses.accelerate = false;
    break;
    
    // down
    case 'ArrowDown': 
      car1.statuses.braking = false;
    break;
      
    // left  
    case 'ArrowLeft': 
      car1.statuses.turnLeft = false;
    break;
      
    // right  
    case 'ArrowRight': 
      car1.statuses.turnRight = false;
    break;
      
    default: console.log('not found this key(released) ');  
  }
}



function rotatePoint (coords, angle, distance) {
  const TO_RADIANS = Math.PI/180;
	return {
		x: Math.sin(angle * TO_RADIANS) * distance + coords.x,
		y: Math.cos(angle * TO_RADIANS) * distance * -1 + coords.y,
	};
}

function drawPoint (xy) {
	context.fillRect(xy.x,xy.y,1,1);
}

function distance (from, to) {
	var a = from.x > to.x ? from.x - to.x : to.x - from.x,
		b = from.y > to.y ? from.y - to.y : to.y - from.y
		;
	return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2))
}

/**
 * Provides requestAnimationFrame in a cross browser way.
 * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 */
if ( !window.requestAnimationFrame ) {

    window.requestAnimationFrame = ( function() {

        return window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {
            window.setTimeout( callback, 1000 / 60 );
        };

    }());

}