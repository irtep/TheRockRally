
const keyDownListeners = window.addEventListener("keydown", checkKeyPressed, false); 
const keyUpListeners = window.addEventListener("keyup", checkKeyReleased, false); 

function carMovement(car) {
  const stats = car.statuses;
  
  // give lost control back if slow enough
  if (stats.grip > stats.speed) {stats.outOfControl = false;}
  
  // if advancing
  if (stats.speed > 0) {
    const speeds = getSpeeds(stats.heading, stats.speed);
    // decrease of speed by friction
    stats.isMoving = true;
    stats.speed -= stats.friction; 
   
    // if too much speed for grip and turning, car is out of control:
    if (stats.speed > stats.grip) {
      if (stats.turnRight === true || stats.turnLeft === true) {
        let slideDir = null;
        const slideValue = (stats.speed + stats.weight - stats.grip) / 4; // this prolly changes
        stats.turnRight ? slideDir = 'right' : slideDir = 'left'; 
        
        // if right + to heading, if left - to heading
        if (slideDir === 'right') {
          stats.heading += slideValue;
        } else {
          stats.heading -= slideValue;
        }
        
        const speedsWithSlide = getSpeedsSliding(stats.heading, stats.speed, slideValue) 
        
        stats.outOfControl = true;
        // sliding
        car.pieces.hull.x += -speedsWithSlide.x;
        car.pieces.hull.y += speedsWithSlide.y;
        // right was + to heading 
      } else {
        // not sliding
        car.pieces.hull.x += -speeds.x;
        car.pieces.hull.y += speeds.y;
      }
    } else {
      // not sliding
      car.pieces.hull.x += -speeds.x;
      car.pieces.hull.y += speeds.y;
    }
  
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
    if (stats.accelerate === true && stats.outOfControl === false) { 
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
  
  carMovement(car1); // moves car1... need to move all cars here or causes double movement etc.
  car1.draw();  // draws car1.. need to draw all cars in same place i think...
 // car2.draw();  // draws car2
  giveStats();  // writes info to infoPlace.innerHTML
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
  //setInterval(()=> { // can use this too.. but i think this window.requestAnimationFrame works better...
  animate();
 // }, 500); 
});