console.log('engine');  // (name, pieces, statuses) 


const keyDownListeners = window.addEventListener("keydown", checkKeyPressed, false); 
const keyUpListeners = window.addEventListener("keyup", checkKeyReleased, false); 

function carMovement(car) {

  // if advancing
  if (car.statuses.speed > 0) {
    // decrease of speed by friction
    car.statuses.isMoving = true;
    car.statuses.speed -= car.statuses.friction; 
    
    const speeds = getSpeeds(car.statuses.heading, car.statuses.speed);
    const moveX = car.statuses.speed;
    const moveY = car.statuses.speed * car.statuses.heading;
    
    car.pieces.hull.x += -speeds.x;
    car.pieces.hull.y += speeds.y;

    }
    /*
    // if reversing
    if (car.statuses.speed < 0) {
      car.statuses.isMoving = true;

      car.pieces.hull.x += car.statuses.speed;
    }
    */
    if (car.statuses.speed < 0) {
      car.statuses.isMoving = false;    
    }
  
    
    /*
      controls: {accelerate: false, braking: false, turnLeft: false, turnRight: false}
    */
    // if accelerating
    if (car.statuses.accelerate === true) { 
      car.accelerate();    
    }
    // if braking
    if (car.statuses.braking === true && car.statuses.speed > -1) { 
      car.brake();    
    } else {
      // release breaks
      car.statuses.friction = car.statuses.originalFriction;
    }

    // if turning
    if (car.statuses.turnRight === true) { 
      car.turnRight();    
    }

    // if turning
    if (car.statuses.turnLeft === true) { 
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
    ' isMoving, acce, bra, tL, tR '+ car1.statuses.isMoving + ' '+ car1.statuses.controls.accelerate+
     car1.statuses.controls.accelerate + ' ' +car1.statuses.controls.braking + ' '+ car1.statuses.controls.turnLeft+
    ' '+ car1.statuses.controls.turnRight;
}

//  -------- ONLOAD:  ------------
window.onload = (()=> { 
  //setInterval(()=> { // temporary solution to slow things up until few solutions...
    animate();
 // }, 500); 
  
});