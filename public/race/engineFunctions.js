
// with grip
function getSpeeds (rotation, speed) {
  const to_angles = Math.PI/180;
  
  return {
		y: Math.sin(rotation * to_angles) * speed,
		x: Math.cos(rotation * to_angles) * speed * -1,
	};
}
// when lost grip:
function getSpeedsSliding (rotation, speed, slide) {
  const to_angles = Math.PI/180;
  let speedX = Math.cos(rotation * to_angles) * speed * -1;
  let speedY = Math.sin(rotation * to_angles) * speed;
  const absolutes = {x: Math.abs(speedX), y: Math.abs(speedY)};
  
  // add slide value to that who has smaller absolute number
  if (absolutes.x >= absolutes.y) {
    const posOrNeg = Math.sign(speedY);
    
    if (posOrNeg == -1) {
      speedY -= slide;     
    } else {
      speedY += slide;
    }
       
  } else {
    const posOrNeg = Math.sign(speedX);
    
    if (posOrNeg == -1) {
      speedX -= slide;     
    } else {
      speedX += slide;
    }  
    
  }
  
  return {
		y: speedY,
		x: speedX,
	};
}


// key Listeners, gameObject.race.cars[0] is players car
function checkKeyPressed(pressed){ 
  
  switch (pressed.code) {
  
    // up  
    case 'ArrowUp': 
      gameObject.race.cars[0].statuses.accelerate = true;
    break;
    
      // shift, for alternative acceleration 
    case 'ShiftRight': 
      gameObject.race.cars[0].statuses.accelerate = true;
    break;
      
    // down
    case 'ArrowDown': 
      gameObject.race.cars[0].statuses.braking = true;
    break;
      
    // left  
    case 'ArrowLeft': 
      gameObject.race.cars[0].statuses.turnLeft = true;
    break;
      
    // right  
    case 'ArrowRight': 
      gameObject.race.cars[0].statuses.turnRight = true;
    break;
      
    // 'r' for reverse:
    case 'KeyR':
      gameObject.race.cars[0].statuses.reverse = true;  
    break;
      
    default: console.log('not found this key(pressed)');  
  }
}
function checkKeyReleased(released){
  
  switch (released.code) {
  
    // up  
    case 'ArrowUp': 
      gameObject.race.cars[0].statuses.accelerate = false;     
      
    // shift, for alternative acceleration 
    case 'ShiftRight': 
      gameObject.race.cars[0].statuses.accelerate = false;
    break;
    break;
    
    // down
    case 'ArrowDown': 
      gameObject.race.cars[0].statuses.braking = false;
    break;
      
    // left  
    case 'ArrowLeft': 
      gameObject.race.cars[0].statuses.turnLeft = false;
    break;
      
    // right  
    case 'ArrowRight': 
      gameObject.race.cars[0].statuses.turnRight = false;
    break;      
    // 'r' for reverse:
    case 'KeyR':
      gameObject.race.cars[0].statuses.reverse = false;  
    break;
      
    default: console.log('not found this key(released) ');  
  }
}

// updating weight, color, cost, armour, hitPoints and car handling stats.
function updateCar(carOnCase) {
  
  carOnCase.weight = carOnCase.chassis.weight + carOnCase.armour.weight + carOnCase.motor.weight + carOnCase.tires.weight;
  carOnCase.cost = carOnCase.chassis.cost + carOnCase.armour.cost + carOnCase.tires.cost + carOnCase.motor.cost;
  carOnCase.statuses.power = carOnCase.motor.power - (carOnCase.weight/10);
  carOnCase.statuses.maxSpeed = carOnCase.motor.maxSpeed - carOnCase.weight;
  carOnCase.statuses.grip = carOnCase.tires.grip - carOnCase.weight;
  carOnCase.pieces.hull.color = carOnCase.color;
  carOnCase.armourValue = carOnCase.chassis.armour + carOnCase.armour.value;
  // giving 0 hit points as a starting stats:
  carOnCase.hitPoints = 0;
  //carOnCase.hitPoints = carOnCase.chassis.durability + carOnCase.motor.durability;
  carOnCase.maxHitPoints = carOnCase.chassis.durability + carOnCase.motor.durability;
  
  return carOnCase;
}

/*
      CREATE NEW CAR
*/
// this will create car to racetrack. playerCar indicates if this is for player or ai
function createNewCar(newCar, playerCar){
  // search chassis, motor, tires, armour and pieces by cars name:
  const allPieces = {
    vehicles: JSON.parse(JSON.stringify(vehicles)),
    chassises: JSON.parse(JSON.stringify(chassises)),
    motors: JSON.parse(JSON.stringify(motors)),
    tires: JSON.parse(JSON.stringify(tires)),
    armours: JSON.parse(JSON.stringify(armours))
  };
  
  const stats = allPieces.vehicles.filter( (cars) => newCar.name === cars.name);
  
  // chassis has pieces
  const chassis = allPieces.chassises.filter( (chas) => stats[0].chassis === chas.name);
  
  const mot = allPieces.motors.filter( (moto) => stats[0].motor === moto.name);
  const tire = allPieces.tires.filter( (tir) => stats[0].tires === tir.name);
  const armour = allPieces.armours.filter( (armo) => stats[0].armour === armo.name);
  newCar.chassis = chassis[0]; newCar.motor = mot[0]; newCar.tires = tire[0]; newCar.armour = armour[0];
  newCar.pieces = chassis[0].pieces;

  // updates weight, color, cost, handling stats from pieces. 
  // separates, as can use that same for example, if someone changes motor/tires etc.
  newCar = updateCar(newCar);
  
  // if not first car, lets change x and y:
  playerCar ? newCar.pieces.hull.x = 10 : newCar.pieces.hull.x += gameObject.race.cars.length * 100; 
  
  // add statuses.dodgeLeft and statuses.dodgeRight for ai purposes also aiCheckPoints
  if (playerCar !== true) {
    newCar.statuses.dodgeLeft = false; newCar.statuses.dodgeRight = false; newCar.statuses.dodgeReverse = false;
    newCar.lastAiCp = 0;
    newCar.nextAiCp = 1;
  }
  
  // array for pieceList
  newCar.pieces.parts = [];
  
  // add stats that will be needed to paint the car. For all different parts.
  newCar.pieces.drawPoint = newCar.chassis.drawPoint;
  
  if (newCar.pieces.speedStripe !== undefined) {
    
    newCar.pieces.speedStripe.x = newCar.pieces.drawPoint.x;
    newCar.pieces.speedStripe.y = newCar.pieces.drawPoint.y + (newCar.pieces.hull.h / 2) - 1.5;   
    newCar.pieces.speedStripe.w = newCar.pieces.hull.w;
    // if secondary color is selected, apply it:
    if (newCar.color2 !== 'Choose a color 2') {
      
      newCar.pieces.speedStripe.color = newCar.color2;
    }
    newCar.pieces.parts.push(newCar.pieces.speedStripe);
  } 
  
  if (newCar.pieces.leftFrontWindow !== undefined) {
    
    newCar.pieces.leftFrontWindow.x = newCar.pieces.drawPoint.x + (newCar.pieces.hull.w / 2);
    newCar.pieces.leftFrontWindow.y = newCar.pieces.drawPoint.y + 1;
    newCar.pieces.leftFrontWindow.w = (newCar.pieces.hull.w / 4) / 2;
    newCar.pieces.parts.push(newCar.pieces.leftFrontWindow);
  }
  if (newCar.pieces.rightFrontWindow !== undefined) {
    
    newCar.pieces.rightFrontWindow.x = newCar.pieces.leftFrontWindow.x;
    newCar.pieces.rightFrontWindow.y = newCar.pieces.drawPoint.y + newCar.pieces.hull.h - newCar.pieces.rightFrontWindow.h - 1;
    newCar.pieces.rightFrontWindow.w = (newCar.pieces.hull.w / 4) / 2;
    newCar.pieces.parts.push(newCar.pieces.rightFrontWindow);
  }
  if (newCar.pieces.leftRearWindow !== undefined) {
    
    newCar.pieces.leftRearWindow.x = newCar.pieces.drawPoint.x + (newCar.pieces.hull.w / 4);
    newCar.pieces.leftRearWindow.y = newCar.pieces.drawPoint.y + 1;
    newCar.pieces.leftRearWindow.w = (newCar.pieces.hull.w / 4) / 2;
    newCar.pieces.parts.push(newCar.pieces.leftRearWindow);
  }
  if (newCar.pieces.rightRearWindow !== undefined) {
    
    newCar.pieces.rightRearWindow.x = newCar.pieces.leftRearWindow.x;
    newCar.pieces.rightRearWindow.y = newCar.pieces.drawPoint.y + newCar.pieces.hull.h - newCar.pieces.rightRearWindow.h - 1;
    newCar.pieces.rightRearWindow.w = (newCar.pieces.hull.w / 4) / 2;
    newCar.pieces.parts.push(newCar.pieces.rightRearWindow);
  }
  if (newCar.pieces.frontWindow !== undefined) {
    
    newCar.pieces.frontWindow.x = newCar.pieces.drawPoint.x + newCar.pieces.hull.w - (newCar.pieces.hull.w / 3);
    newCar.pieces.frontWindow.y = newCar.pieces.drawPoint.y + 1.5;
    newCar.pieces.frontWindow.h = newCar.pieces.hull.h - 3;
    newCar.pieces.parts.push(newCar.pieces.frontWindow);
  }
  if (newCar.pieces.rearWindow !== undefined) {
    
    newCar.pieces.rearWindow.x = newCar.pieces.drawPoint.x + (newCar.pieces.hull.w / 6);
    newCar.pieces.rearWindow.y = newCar.pieces.drawPoint.y + 1.5;
    newCar.pieces.rearWindow.h = newCar.pieces.hull.h - 3;
    newCar.pieces.parts.push(newCar.pieces.rearWindow);
  }
  
  const carsRootStats = {name: newCar.name, cost: newCar.cost, weight: newCar.weight, armourValue: newCar.armourValue, hitPoints: newCar.hitPoints,
                        maxHitPoints: newCar.maxHitPoints};
  
  //console.log('new car created, gO: ', gameObject);
  return new Car(newCar.driver, carsRootStats, newCar.pieces, newCar.statuses);
  
}

// damage dealer:
function damageDealer(obj1, obj2) {
  let weightDifference = Math.abs(obj1.weight) - Math.abs(obj2.weight);
  const absDifference = Math.abs(weightDifference);
  const damages = {car1: 0, car2: 0};
  
  // lighter takes damage
  if (obj1.weight < obj2.weight) {
    let dealToObj1 = 0;
    let dealToObj2 = 1;
    dealToObj1 = absDifference - obj1.armourValue;
    if (dealToObj1 < 1) { dealToObj1 = 1} // 1 is minimum damage
    damages.car1 = dealToObj1; damages.car2 = dealToObj2
  }
  
  if (obj2.weight < obj1.weight) {
    let dealToObj1 = 1;
    let dealToObj2 = 0;
    dealToObj2 = absDifference - obj2.armourValue;
    if (dealToObj2 < 1) { dealToObj2 = 1} // 1 is minimum damage
    //console.log('dealing: ', dealToObj1, dealToObj2);
    damages.car1 = dealToObj1; damages.car2 = dealToObj2
  
  }
  
  // if same, both take
  if (obj1.weight === obj2.weight) {
    damages.car1 = 3; damages.car2 = 3;
  }
  
  return damages;
}

/*  

  RECTANGLE BASED COLLISION TEST: 

*/
function pointInPoly(verties, testx, testy) { 
  var i;
  var j;
  var c = 0;
  var nvert = verties.length;
  
  for (i = 0, j = nvert - 1; i < nvert; j = i++) {
  
    if (((verties[i].y > testy) != (verties[j].y > testy)) && (testx < (verties[j].x - verties[i].x) * (testy - verties[i].y) / (verties[j].y - verties[i].y) + verties[i].x))
                    c = !c;
  }
  return c;
}

function testCollision(rectangle) {
  var collision = false;
  //console.log('testC ', rectangle);
  this.getCorners().forEach((corner) => {
    var isCollided = pointInPoly(rectangle.getCorners(), corner.x, corner.y);
                
    if (isCollided) collision = true;
  });
  return collision;
}

// bring "full objects" like car or gameObject.race.track[0].obstacles[0]
// example: checkRectangleCollision(car, gameObject.race.track[0].obstacles[0]);
function checkRectangleCollision(rect, rect2) {
  //console.log('cRC ', rect, rect2);
  if (testCollision.call(rect, rect2)) return true;
  else if (testCollision.call(rect2, rect)) return true;
  return false;
}

// collision test starts here
function collisionTest(car) {
  const noCollision = false;
  
  // AI cars own guide checkpoints:
    // ai guide checkPoints check
    for (let ix1 = 0; ix1 < gameObject.race.track[0].aiCheckPoints.length; ix1++) {
      const testResult = checkRectangleCollision(car, gameObject.race.track[0].aiCheckPoints[ix1]);

      if (testResult) {
        
        if (car.nextAiCp === gameObject.race.track[0].aiCheckPoints[ix1].number) {
          
          car.lastAiCp = gameObject.race.track[0].aiCheckPoints[ix1].number;
          // check if last check points of track reached.
          if (car.lastAiCp + 1 > gameObject.race.track[0].aiCheckPoints.length) {
            
            car.nextAiCp = 1;
          } else { 
            
            car.nextAiCp++;
          }
        }
      }
    }
    // AIs danger zones
    for (let ix1 = 0; ix1 < gameObject.race.track[0].dangerZones.length; ix1++) {
      const testResult = checkRectangleCollision(car, gameObject.race.track[0].dangerZones[ix1]);

      if (testResult) {
        
        // cars start with undefined, so when entering first time set inDangerZone to 1.
        // 0 and undefined is not in danger, all others yes.
        /*if (car.inDangerZone === undefined || car.inDangerZone === false) {
        */
          car.inDangerZone = true;
        //}
      }
    }
    // AIs danger is clear
    for (let ix2 = 0; ix2 < gameObject.race.track[0].dangerClear.length; ix2++) {
      const testResult = checkRectangleCollision(car, gameObject.race.track[0].dangerClear[ix2]);

      if (testResult) {
        
        // cars start with undefined, so when entering first time set inDangerZone to 1.
        // 0 and undefined is not in danger, all others yes.
        //if (car.inDangerZone === undefined || car.inDangerZone === false) {
        
          car.inDangerZone = false;
        //}
      }
    }       
  
  // check with checkPoints
  for (let ind = 0; ind < gameObject.race.track[0].checkPoints.length; ind++) {
    const testResult = checkRectangleCollision(car, gameObject.race.track[0].checkPoints[ind]);
    
    if (testResult) {
      
      if (car.nextCheckPoint === gameObject.race.track[0].checkPoints[ind].number) {
        
        car.lastCheckPoint = gameObject.race.track[0].checkPoints[ind].number;
        
        // check if last check points of track reached.
        if (car.lastCheckPoint + 1 > gameObject.race.track[0].checkPoints.length) {
         
          car.nextCheckPoint = 1;
        } else { 
          
          car.nextCheckPoint++; 
        }
        
        // if start of new lap
        if (car.lastCheckPoint === 1) {
         
          // if players car
          if (car.driver  === gameObject.car.driver) { 
            // push result of lap clock to 
            if (car.currentLap > 0) {
              
              gameObject.race.lastLaps.push(JSON.parse(JSON.stringify(gameObject.race.currentLapTime)));
            }
            // reset currentLapTime
            gameObject.race.currentLapTime.minutes = 0;
            gameObject.race.currentLapTime.seconds = 0;
            gameObject.race.currentLapTime.milliseconds = 0;

            // write lap times:
            if (gameObject.race.totalLaps + 1 > car.currentLap) {
              let lapTimes = '';

              gameObject.race.lastLaps.forEach( (times) => {

                lapTimes = lapTimes + times.minutes + ':' + times.seconds + ':' + times.milliseconds + '<br>';
              });

              infoPlace2.innerHTML = lapTimes;
            }
          }
          
          car.currentLap++  
          
          // check if this was last lap
          if (gameObject.race.totalLaps === car.currentLap) {
           
            gameObject.race.results.push(car);
            
            // check if all are finished:
            const finishedCars = gameObject.race.cars.filter(carrito => gameObject.race.totalLaps == carrito.currentLap);
            const disabledCars = gameObject.race.cars.filter(carrito => 0.1 > carrito.hitPoints);
            
            // race is finished
            if (finishedCars.length + disabledCars.length === gameObject.race.cars.length) {
              const infoPlace = document.getElementById('infoPlace');
              
              infoPlace.innerHTML = 'RACE FINISHED! Results: ';
              for (let i = 0; i < gameObject.race.results.length; i++) {
                const place = i + 1;
                
                infoPlace.innerHTML = infoPlace.innerHTML + place + '. ' + gameObject.race.results[i].driver + '. ';
                
                gameObject.race.terminated = true;
              }
            }
          } else {
          
            // continues
          }
        } // first checkpoint
      }
    }
  }
  
  // check if collision with cars
  for (let i = 0; i < gameObject.race.cars.length; i++) {

      // lets not compare with same car.
      if (car.driver !== gameObject.race.cars[i].driver) {
        const testResult = checkRectangleCollision(car, gameObject.race.cars[i]);
        //console.log('test: ', gameObject.race.cars[i]);
        if (testResult) { return gameObject.race.cars[i]; } 
      }  
  }
  
  // check with track obstacles:
  for (let iv = 0; iv < gameObject.race.track[0].obstacles.length; iv++) {
    const testResult = checkRectangleCollision(car, gameObject.race.track[0].obstacles[iv]);  
    //console.log('test: ', gameObject.race.track[0].obstacles[iv]);
    if (testResult) { return gameObject.race.track[0].obstacles[iv]; } 
  }
  
  // if no collisions:
  return noCollision;
}

// sets x and y to all cars for collision purposes
function updateXandY(cars) {
  // cars:
  cars.forEach((carInTurn) => {  
    carInTurn.angle = carInTurn.statuses.heading;
    carInTurn.setCorners(carInTurn.angle);
  }); 
  // rectangles in track:
  gameObject.race.track[0].obstacles.forEach((obsInTurn) => {  
    obsInTurn.setCorners(obsInTurn.angle);
  });
  // checkpoints:
  gameObject.race.track[0].checkPoints.forEach((cpInTurn) => {  
    cpInTurn.setCorners(cpInTurn.angle);
  });  
  // ai guide checkpoints:
  gameObject.race.track[0].aiCheckPoints.forEach((cpInTurn) => {  
    cpInTurn.setCorners(cpInTurn.angle);
  }); 
  // ai danger zones
  gameObject.race.track[0].dangerZones.forEach((cpInTurn) => {  
    cpInTurn.setCorners(cpInTurn.angle);
  });  
  // ai danger clear
  gameObject.race.track[0].dangerClear.forEach((cpInTurn) => {  
    cpInTurn.setCorners(cpInTurn.angle);
  });
  
}

function nameChecker(name1, name2) {
  
  if (name1 === name2) {
    
    return true;
  } else {
    
    return false;
  }
}

/*  ------------------
    Setup the race.
    ------------------
*/  
function setupRace(){
  // players car:
  switch (gameObject.race.typeOfRace) {
  
    case 'LapRecordHunt':
      // players car:
      gameObject.race.cars.push(createNewCar(gameObject.car, true));  
       // find selected track:
      for (let i = 0; i < tracks.length; i++) {

        if (tracks[i].name === gameObject.race.track) {

          gameObject.race.track = [];
          gameObject.race.track.push(tracks[i]);

        }
      }
    break;
      
    case 'singleRace':
      // players car:
      gameObject.race.cars.push(createNewCar(gameObject.car, true));
      // ai cars:
      gameObject.race.cars.push(createNewCar(aiCars[4], false));
      gameObject.race.cars.push(createNewCar(aiCars[1], false));
      gameObject.race.cars.push(createNewCar(aiCars[2], false));
            // find selected track:
      for (let i = 0; i < tracks.length; i++) {

        if (tracks[i].name === gameObject.race.track) {

          gameObject.race.track = [];
          gameObject.race.track.push(tracks[i]);

        }
      }
    break;
      
    case 'FullRacingSeason':
      // players car:
      gameObject.race.cars.push(createNewCar(gameObject.car, true));
      // ai cars:
      gameObject.race.cars.push(createNewCar(aiCars[4], false));
      gameObject.race.cars.push(createNewCar(aiCars[1], false));
      gameObject.race.cars.push(createNewCar(aiCars[2], false));
      
      // starting from track 1
      if (gameObject.race.currentRace === undefined) {
        
        gameObject.race.track = [];
        gameObject.race.track.push(tracks[0]);
        gameObject.race.currentRace = 0;  
      } else {
        
        //gameObject.race.track[0] = tracks[gameObject.race.currentRace];
        gameObject.race.track = [];
        gameObject.race.track.push(tracks[gameObject.race.currentRace]);
        gameObject.race.currentRace++;
        //gameObject.race.track.push(tracks[0]);
      }
    break;
      
    default: console.log('not found in setupRace type of race');  
    
  }
  
  // check that no overlapping names
  // not only for clarity reasons in standings, but for collision test too.
  for (let i = 1; i < gameObject.race.cars.length; i++) {
    
    const nameMatch = nameChecker(gameObject.race.cars[0].driver, gameObject.race.cars[i].driver);
    
    nameMatch ? gameObject.race.cars[i].driver = 'Josue' : console.log('name ok');
  }
  // ai cars:
  //createNewCar(aiCars[0], false);
  //createNewCar(aiCars[1], false);
  //createNewCar(aiCars[2], false); 
   // track 0: factory, 1: city center
  // if track is not selected
  if (gameObject.race.track.length === 0) {
      
    gameObject.race.track.push(tracks[0]);
  }
  
  // finish x and y setup and get angles.
  gameObject.race.cars.forEach((carInTurn) => {  
    carInTurn.x = carInTurn.pieces.hull.x;
    carInTurn.y = carInTurn.pieces.hull.y;
    carInTurn.w = carInTurn.pieces.hull.w;
    carInTurn.h = carInTurn.pieces.hull.h;
    carInTurn.angle = carInTurn.statuses.heading;
    carInTurn.setCorners(carInTurn.angle);
    
    // checkPoint, currentLap, lapTime, bestTime
    carInTurn.lastCheckPoint = 0;
    carInTurn.nextCheckPoint = 1;
    carInTurn.lastAiCp = 0;
    carInTurn.nextAiCp = 1;
    carInTurn.currentLap = 0;
    carInTurn.lapTime = null;
    carInTurn.bestTime = null;
  });
   
  // laps and raceclock:
  gameObject.race.totalLaps = 4;
  gameObject.race.currentLapTime = {minutes: 0, seconds: 0, milliseconds: 0};
  gameObject.race.lastLaps = [];
  
  // there could be first 6 seconds countdown to start the race/time attack.
  let seconds = 6; // to start race
  const infoPlace = document.getElementById('infoPlace');
  const countDown = window.setInterval(() => {
    
    seconds--;
    infoPlace.innerHTML = 'Get ready! Race starts in: ' + seconds;
    if (seconds === 0) {
    
      infoPlace.innerHTML = 'Race is On!'
      // give cars hit points to allow it move
      gameObject.race.cars.forEach((carInTurn) => {  
      
        carInTurn.hitPoints = JSON.parse(JSON.stringify(carInTurn.maxHitPoints));
      });

      gameObject.race.started = true;
      
      // terminate this calculator:
      window.clearInterval(countDown);
    }
  }, 1000);
  
  // start lap clock
  const lapTimer = window.setInterval(() => {
              
    if (gameObject.race.cars[0].currentLap > gameObject.race.totalLaps) {window.clearInterval(lapTimer)};
              
    // update lap time
    if (gameObject.race.currentLapTime.milliseconds < 99) {gameObject.race.currentLapTime.milliseconds++;} else {
                
      gameObject.race.currentLapTime.milliseconds = 0;
                
      if (gameObject.race.currentLapTime.seconds < 59) {gameObject.race.currentLapTime.seconds++;} else {
                  
        gameObject.race.currentLapTime.seconds = 0;
        gameObject.race.currentLapTime.minutes++;
      }
    }
  }, 10);
  
  console.log('go: ', gameObject);
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