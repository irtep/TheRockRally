
const keyDownListeners = window.addEventListener("keydown", checkKeyPressed, false); 
const keyUpListeners = window.addEventListener("keyup", checkKeyReleased, false); 

function carMovement(car) {
  const stats = car.statuses;

  // if advancing
  if (stats.speed > 0) {
    // decrease of speed by friction
    stats.isMoving = true;
    stats.speed -= stats.friction; 
   
    // if too much speed for grip, some slide is added:
    if (stats.speed > stats.grip && stats.turnLeft === true) {
      // - to heading
    }
    // if too much speed for grip, some slide is added:
    if (stats.speed > stats.grip && stats.turnRight === true) {
      // + to heading 
    }
    
    const speeds = getSpeeds(stats.heading, stats.speed);
    
    car.pieces.hull.x += -speeds.x;
    car.pieces.hull.y += speeds.y;

  }
    
    // if stopped
    if (stats.speed < 0 && stats.reverse === false) {
      stats.isMoving = false;    
    }
  
    // if reversing
    if (stats.speed < 0 && stats.reverse === true) {
        
      const speeds = getSpeeds(stats.heading, -0.6);
    
      car.pieces.hull.x += -speeds.x;
      car.pieces.hull.y += speeds.y;
      stats.isMoving = true;
    }
  
    // if accelerating
    if (stats.accelerate === true) { 
      car.accelerate();    
    }
    // if braking
    if (stats.braking === true && stats.speed > -1) { 
      car.brake();    
    } else {
      // release breaks
      stats.friction = stats.originalFriction;
    }

    // if turning
    if (stats.turnRight === true) { 
      car.turnRight();    
    }

    // if turning
    if (stats.turnLeft === true) { 
      car.turnLeft();    
    }
    // collision detect
}

function animate(){
  
  carMovement(car1);
  car1.draw();
  giveStats();
  window.requestAnimationFrame(animate);
}

function giveStats() {
  const infoPlace = document.getElementById('infoPlace');
  
  infoPlace.innerHTML = 'speed: '+ car1.statuses.speed+ ' HEadInG: '+ car1.statuses.heading+
    ' isMoving, acce, bra, tL, tR '+ car1.statuses.isMoving + ' '+ car1.statuses.accelerate+
     car1.statuses.accelerate + ' ' +car1.statuses.braking + ' '+ car1.statuses.turnLeft+
    ' '+ car1.statuses.turnRight;
}

//  -------- ONLOAD:  ------------
window.onload = (()=> { 
  //setInterval(()=> { // temporary solution to slow things up until few solutions...
    animate();
 // }, 500); 
  
});