
const keyDownListeners = window.addEventListener("keydown", checkKeyPressed, false); 
const keyUpListeners = window.addEventListener("keyup", checkKeyReleased, false); 
let gameObject = null;

function carMovement(car) {
  const stats = car.statuses;
  // maximum damage with one collision
  const maxDam = car.maxHitPoints / 2;
  // need these old values if collisions
  let oldX = JSON.parse(JSON.stringify(car.x));
  let oldY = JSON.parse(JSON.stringify(car.y));

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
        
        const speedsWithSlide = getSpeedsSliding(stats.heading, stats.speed, slideValue) 
        const collisionTestResult = collisionTest(car);
        
        stats.outOfControl = true;
        // sliding
        car.x += -speedsWithSlide.x;
        car.y += speedsWithSlide.y;
        // collision test:
        updateXandY(gameObject.race.cars);
        const colTest = collisionTest(car);
        
        if (colTest !== false){ 
          
          car.x = oldX;
          car.y = oldY;
          updateXandY(gameObject.race.cars);
          stats.speed = 0;
          stats.isMoving = false;
          //document.getElementById('collisionPlace').innerHTML = 'collision: '+ colTest.name;
          // damage test:
          const damageResults = damageDealer(car, colTest);
          if (damageResults.car1 > maxDam) { damageResults.car1 = maxDam; }
          if (damageResults.car2 > maxDam) { damageResults.car2 = maxDam; }
          damageResults.car1 = damageResults.car1 / 3;
          damageResults.car2 = damageResults.car2 /3;
          
          car.hitPoints = car.hitPoints - damageResults.car1;
          colTest.hitPoints = colTest.hitPoints - damageResults.car2;
          
        }
        else { 
          // no collision
        }
        // right was + to heading 
      } else {
        // not sliding
        car.x += -speeds.x;
        car.y += speeds.y;
        // collision test:
        updateXandY(gameObject.race.cars);
        const colTest = collisionTest(car);
        
        if (colTest !== false){ 
          
          car.x = oldX;
          car.y = oldY;
          updateXandY(gameObject.race.cars);
          stats.speed = 0;
          stats.isMoving = false;
          //document.getElementById('collisionPlace').innerHTML = 'collision: '+ colTest.name;
          // damage test:
          const damageResults = damageDealer(car, colTest);
          if (damageResults.car1 > maxDam) { damageResults.car1 = maxDam; }
          if (damageResults.car2 > maxDam) { damageResults.car2 = maxDam; }
          damageResults.car1 = damageResults.car1 / 3;
          damageResults.car2 = damageResults.car2 /3;
          car.hitPoints = car.hitPoints - damageResults.car1;
          colTest.hitPoints = colTest.hitPoints - damageResults.car2;
        }
        else { // no collision
        }
      }
    } else {
      // not sliding
      car.x += -speeds.x;
      car.y += speeds.y;
        // collision test:
        updateXandY(gameObject.race.cars);
        const colTest = collisionTest(car);
        
        if (colTest !== false){ 
          
          car.x = oldX;
          car.y = oldY;
          updateXandY(gameObject.race.cars);
          stats.speed = 0;
          stats.isMoving = false;
          //document.getElementById('collisionPlace').innerHTML = 'collision: '+ colTest.name;
          // damage test:
          const damageResults = damageDealer(car, colTest);
          if (damageResults.car1 > maxDam) { damageResults.car1 = maxDam; }
          if (damageResults.car2 > maxDam) { damageResults.car2 = maxDam; }
          damageResults.car1 = damageResults.car1 / 3;
          damageResults.car2 = damageResults.car2 /3;
          car.hitPoints = car.hitPoints - damageResults.car1;
          colTest.hitPoints = colTest.hitPoints - damageResults.car2;
        }
        else { // no collision
        }
    }
  
  }
    
    // if stopped
    if (stats.speed < 0 && stats.reverse === false) {
      stats.isMoving = false;    
    }
  
    // if reversing
    if (stats.speed <= 0 && stats.reverse === true && car.hitPoints > 0) {
        
      const speeds = getSpeeds(stats.heading, -0.6);
      
      car.x += -speeds.x;
      car.y += speeds.y;
      stats.isMoving = true;   
      // collision test:
      updateXandY(gameObject.race.cars);
      const colTest = collisionTest(car);
      
        if (colTest !== false) { 
           
          car.x = oldX;
          car.y = oldY;
          updateXandY(gameObject.race.cars);
          stats.speed = 0;
          stats.isMoving = false;
          document.getElementById('collisionPlace').innerHTML = 'collision: '+ colTest.name;
          // damage test:
          const damageResults = damageDealer(car, colTest);
          if (damageResults.car1 > maxDam) { damageResults.car1 = maxDam; }
          if (damageResults.car2 > maxDam) { damageResults.car2 = maxDam; }
          damageResults.car1 = damageResults.car1 / 3;
          damageResults.car2 = damageResults.car2 /3;
          car.hitPoints = car.hitPoints - damageResults.car1;
          colTest.hitPoints = colTest.hitPoints - damageResults.car2;
        }
        else { 
        
          // no collision
          
        }
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
}

function animate(){
  
  // decide ai actions
  // make them for everyone else except car[0] as that is players car.
  
  gameObject.race.cars.forEach( (vehicle) => {
    carMovement(vehicle)
  }); // moves car1... need to move all cars here or causes double movement etc.
  //gameObject.race.cars[0].draw();  // draws car1.. need to draw all cars in same place i think...
  paintAll(gameObject.race);
 // car2.draw();  // draws car2
  giveStats();  // writes info to infoPlace.innerHTML
  window.requestAnimationFrame(animate);
}

function giveStats() {  // just informal stuff in development and bugfix purposes...
  const infoPlace = document.getElementById('infoPlace');
  const infoPlace2 = document.getElementById('infoPlace2');
  
  infoPlace.innerHTML = 'currentLap: ' + gameObject.race.cars[0].currentLap + ' last/next checkPoint: ' + 
  gameObject.race.cars[0].lastCheckPoint + '/' + gameObject.race.cars[0].nextCheckPoint + 'lap time: ' +
  gameObject.race.currentLapTime.minutes + ':' + gameObject.race.currentLapTime.seconds + ':' + gameObject.race.currentLapTime.milliseconds
  
  /*
  infoPlace.innerHTML = 'speed: '+ gameObject.race.cars[0].statuses.speed+ ' HEadInG: '+ gameObject.race.cars[0].statuses.heading+
    ' isMoving, acce, bra, tL, tR '+ gameObject.race.cars[0].statuses.isMoving + ' '+ gameObject.race.cars[0].statuses.accelerate+
     gameObject.race.cars[0].statuses.accelerate + ' ' +gameObject.race.cars[0].statuses.braking + ' '+ gameObject.race.cars[0].statuses.turnLeft+
    ' '+ gameObject.race.cars[0].statuses.turnRight;
  */
}

//  -------- ONLOAD:  ------------
window.onload = (()=> { 
  // load gameObject from localStorage:
  gameObject = JSON.parse(localStorage.getItem('Go'));  
  //gameObject.race.track.obstacles[0]house1.setCorners(0);
  setupRace();
  //console.log('go t ', gameObject.race.track[0].obstacles[0].setCorners(0));
  //setInterval(()=> { // can use this too.. but i think this window.requestAnimationFrame works better...
  animate();
 // }, 500); 
});