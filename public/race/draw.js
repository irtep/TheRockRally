
function clearCanvas(){
  const canvas = document.getElementById('kanveesi');
  const ctx = canvas.getContext("2d");
  
  ctx.clearRect(0,0,canvas.width,canvas.height);  // clear all 
}

// new draw function:
function paintAll(race) {
  const canvas = document.getElementById('kanveesi');
  const ctx = canvas.getContext("2d");
   
  clearCanvas();
  
  race.cars.forEach((unit) => {
    const partsToPaint = unit.pieces;
    const drawPoint = partsToPaint.drawPoint;
    const degrees = unit.statuses.heading;
     
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
    const paintIt = partsToPaint.parts.map((part) => {
      
      ctx.beginPath();
      ctx.fillStyle = part.color;
      ctx.rect(part.x, part.y, part.w, part.h);
      ctx.fill();
    }); 
      // write drivers name 
    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.fillText (unit.driver, drawPoint.x, drawPoint.y);
    ctx.fill;
    
    ctx.restore(); // restore coords.
  });

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
  
  ctx.beginPath();
  ctx.arc(550, 175, 50, 0, 2 * Math.PI);
  ctx.stroke();
}