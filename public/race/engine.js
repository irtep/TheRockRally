
const keyDownListeners = window.addEventListener("keydown", checkKeyPressed, false); 
const keyUpListeners = window.addEventListener("keyup", checkKeyReleased, false); 
let gameObject = null;

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
      if (stats.turnRight === true || stats.turnLeft === true || stats.outOfControl === true) {
        let slideDir = null;
        //console.log('speed, weight, htip', stats.speed, stats.weight, stats.grip);
        //console.log('car:  ', car);
        //const slideValue = (stats.speed + car.weight - stats.grip);
        const slideValue = 3;
        stats.turnRight ? slideDir = 'right' : slideDir = 'left'; 
        
        if (stats.turnRight === false && stats.turnLeft === false) {
          // if coming here to continue old slide, need to give slideDir
          slideDir = stats.previousSlide;
        }
        
        // if right + to heading, if left - to heading
        if (slideDir === 'right') {
          stats.heading += slideValue;
          stats.previousSlide = 'right'; // need previous to continue old slide, if happens
        } else {
          stats.heading -= slideValue;
          stats.previousSlide = 'left';
        }
        
        // slower speed to get slower slide:
        //stats.speed = stats.speed - 0.2;
        
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
    if (stats.turnRight === true && stats.outOfControl === false) { 
      car.turnRight();    
    }

    // if turning
    if (stats.turnLeft === true && stats.outOfControl === false) { 
      car.turnLeft();    
    }
    // collision detect
}

function animate(){
  
  carMovement(gameObject.race.cars[0]); // moves car1... need to move all cars here or causes double movement etc.
  //gameObject.race.cars[0].draw();  // draws car1.. need to draw all cars in same place i think...
  paintAll(gameObject.race);
 // car2.draw();  // draws car2
  giveStats();  // writes info to infoPlace.innerHTML
  window.requestAnimationFrame(animate);
}

function giveStats() {  // just informal stuff in development and bugfix purposes...
  const infoPlace = document.getElementById('infoPlace');
  
  infoPlace.innerHTML = 'speed: '+ gameObject.race.cars[0].statuses.speed+ ' HEadInG: '+ gameObject.race.cars[0].statuses.heading+
    ' isMoving, acce, bra, tL, tR '+ gameObject.race.cars[0].statuses.isMoving + ' '+ gameObject.race.cars[0].statuses.accelerate+
     gameObject.race.cars[0].statuses.accelerate + ' ' +gameObject.race.cars[0].statuses.braking + ' '+ gameObject.race.cars[0].statuses.turnLeft+
    ' '+ gameObject.race.cars[0].statuses.turnRight;
}

//  -------- ONLOAD:  ------------
window.onload = (()=> { 
  // load gameObject from localStorage:
  gameObject = JSON.parse(localStorage.getItem('Go'));  
  
  setupRace();
  //setInterval(()=> { // can use this too.. but i think this window.requestAnimationFrame works better...
  animate();
 // }, 500); 
});