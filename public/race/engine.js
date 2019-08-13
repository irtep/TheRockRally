
const keyDownListeners = window.addEventListener("keydown", checkKeyPressed, false); 
const keyUpListeners = window.addEventListener("keyup", checkKeyReleased, false); 
let gameObject = null;

function carMovement(car) {
  const stats = car.statuses;
  let slipFactory = 0;
  
  // maximum damage with one collision
  const maxDam = car.maxHitPoints / 4;
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
      
      slipFactory = stats.speed - stats.grip;
    }
     
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
      // no collision, nothing special happens 
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
    // modifications caused by possibly too much speed:
    // save original value:
    const origVal = JSON.parse(JSON.stringify(car.statuses.turnRate));
    car.statuses.turnRate -= slipFactory;
    
    if (stats.turnRight === true && stats.outOfControl === false) { 
      car.turnRight();
    }

    // if turning
    if (stats.turnLeft === true && stats.outOfControl === false) { 
      car.turnLeft();    
    }
    
    // reset value:
    car.statuses.turnRate = origVal;    
}

function terminateRace(gameObj) {
  
  // save gameObject
  localStorage.setItem('Go', JSON.stringify(gameObj)); 
  
  window.setInterval( () => {
    // to next screen
    window.location = "https://driveorlose.glitch.me/afterRace";
  }, 5000);
  
}

function animate(){
  
  if (gameObject.race.terminated !== true) {
    // decide ai actions
    // make them for everyone else except car[0] as that is players car. So i = 1, because of that.
    for (let i = 1; i < gameObject.race.cars.length; i++) {

      aiDriverBrain(gameObject.race.cars[i]);
    }

    gameObject.race.cars.forEach( (vehicle) => {
      
      if (vehicle.hitPoints > 0) {
        carMovement(vehicle);
      }
    }); 

    // check if all cars are disabled
    if (gameObject.race.started) {

      const carsInGoal = gameObject.race.cars.filter(car => gameObject.race.totalLaps == car.currentLap);
      const brokenCars = gameObject.race.cars.filter(car => 0.1 > car.hitPoints);

      // race is finished
      if (carsInGoal.length + brokenCars.length === gameObject.race.cars.length)  {

        gameObject.race.terminated = true;
      }
    }

    paintAll(gameObject.race);
    //giveStats();  // writes info to infoPlace.innerHTML as for bugfix purpose

    window.requestAnimationFrame(animate);


    if (gameObject.race.terminated) {

      terminateRace(gameObject);
    }
  }
}

function giveStats() {  // just informal stuff in development and bugfix purposes...
  const infoPlace = document.getElementById('infoPlace');
  const infoPlace2 = document.getElementById('infoPlace2');
  /*
  infoPlace.innerHTML = 'currentLap: ' + gameObject.race.cars[0].currentLap + ' last/next checkPoint: ' + 
  gameObject.race.cars[0].lastCheckPoint + '/' + gameObject.race.cars[0].nextCheckPoint + 'lap time: ' +
  gameObject.race.currentLapTime.minutes + ':' + gameObject.race.currentLapTime.seconds + ':' + gameObject.race.currentLapTime.milliseconds
  */
  
  infoPlace.innerHTML = 'speed: '+ gameObject.race.cars[0].statuses.speed+ ' turnRate: '+ gameObject.race.cars[0].statuses.turnRate;
  
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