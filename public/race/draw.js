
/*
function drawRotatedImage(image, x, y, angle) {
  const canvas = document.getElementById('kanveesi');
  const ctx = canvas.getContext("2d");
  const TO_RADIANS = Math.PI/180;
  
	// save the current co-ordinate system
	ctx.save();
 
	// move to the middle of where we want to draw our image
	ctx.translate(x, y);
 
	// rotate around that point, converting our
	// angle from degrees to radians
	ctx.rotate(angle * TO_RADIANS);
 
	// draw it up and to the left by half the width
	// and height of the image
	ctx.drawImage(image, -(image.width/2), -(image.height/2));
 
	// and restore the co-ords to how they were when we began
	ctx.restore();
}
*/
/*
function rotatePoint (coords, angle, distance) {
	return {
		x: Math.sin(angle * TO_RADIANS) * distance + coords.x,
		y: Math.cos(angle * TO_RADIANS) * distance * -1 + coords.y,
	};
}
*/

function clearCanvas(){
  const canvas = document.getElementById('kanveesi');
  const ctx = canvas.getContext("2d");
  
  ctx.clearRect(0,0,canvas.width,canvas.height);  // clear all 
}

function paintCar(partsToPaint, degrees, id) {
  const canvas = document.getElementById('kanveesi');
  const ctx = canvas.getContext("2d");
  const drawPoint = {x: -(partsToPaint.hull.w/1.5), y: -(partsToPaint.hull.h/1.5)};
  
  // need to give coordinates to windowparts and some widths and heights
  // i need to figure out to make better way for this...
  partsToPaint.leftFrontWindow.x = drawPoint.x + (partsToPaint.hull.w / 2);
  partsToPaint.leftFrontWindow.y = drawPoint.y + 1;
  partsToPaint.leftFrontWindow.w = (partsToPaint.hull.w / 4) / 2;
  
  partsToPaint.rightFrontWindow.x = partsToPaint.leftFrontWindow.x;
  partsToPaint.rightFrontWindow.y = drawPoint.y + partsToPaint.hull.h - partsToPaint.rightFrontWindow.h - 1;
  partsToPaint.rightFrontWindow.w = (partsToPaint.hull.w / 4) / 2;
  
  partsToPaint.leftRearWindow.x = drawPoint.x + (partsToPaint.hull.w / 4);
  partsToPaint.leftRearWindow.y = drawPoint.y + 1;
  partsToPaint.leftRearWindow.w = (partsToPaint.hull.w / 4) / 2;
  
  partsToPaint.rightRearWindow.x = partsToPaint.leftRearWindow.x;
  partsToPaint.rightRearWindow.y = drawPoint.y + partsToPaint.hull.h - partsToPaint.rightRearWindow.h - 1;
  partsToPaint.rightRearWindow.w = (partsToPaint.hull.w / 4) / 2;
  
  partsToPaint.frontWindow.x = drawPoint.x + partsToPaint.hull.w - (partsToPaint.hull.w / 3);
  partsToPaint.frontWindow.y = drawPoint.y + 1.5;
  partsToPaint.frontWindow.h = partsToPaint.hull.h - 3;
  
  partsToPaint.rearWindow.x = drawPoint.x + (partsToPaint.hull.w / 6);
  partsToPaint.rearWindow.y = drawPoint.y + 1.5;
  partsToPaint.rearWindow.h = partsToPaint.hull.h - 3;
  
  // make list of other parts of the car.
  const parts = [partsToPaint.rightFrontWindow, partsToPaint.leftFrontWindow, partsToPaint.leftRearWindow, partsToPaint.rightRearWindow, partsToPaint.frontWindow, partsToPaint.rearWindow];
  
  clearCanvas();
  
  // paint hull of car
  ctx.beginPath();
  ctx.fillStyle = partsToPaint.hull.color;
  ctx.save(); // save coords system
  ctx.translate(partsToPaint.hull.x, partsToPaint.hull.y); // go here
  ctx.rotate(degrees * Math.PI / 180);
  ctx.rect(drawPoint.x, drawPoint.y, partsToPaint.hull.w, partsToPaint.hull.h);// time to paint it
  ctx.fill();
  ctx.closePath();
  
  // other parts: 
  const paintIt = parts.map((part) => {
    
    ctx.beginPath();
    ctx.fillStyle = part.color;
    ctx.rect(part.x, part.y, part.w, part.h);
    ctx.fill();
  }); 
  
  // write id number  
  ctx.beginPath();
  ctx.fillStyle = 'black';
  ctx.fillText (id, drawPoint.x, drawPoint.y);
  ctx.fill;
  
  ctx.restore(); // restore coords.
  
  // some other stuff to track:
  
  ctx.beginPath();
  ctx.fillStyle = 'black';
  ctx.rect(100, 150, 100, 100);
  ctx.fill();
  ctx.closePath();
  
  ctx.beginPath();
  ctx.fillStyle = 'black';
  ctx.rect(340, 250, 100, 100);
  ctx.fill();
  ctx.closePath();
}