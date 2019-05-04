
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

// updating weight, color, cost and car handling stats.
function updateCar(carOnCase) {
  
  carOnCase.weight = carOnCase.chassis.weight + carOnCase.armour.weight + carOnCase.motor.weight;
  carOnCase.cost = carOnCase.chassis.cost + carOnCase.armour.cost + carOnCase.tires.cost + carOnCase.motor.cost;
  carOnCase.statuses.power = carOnCase.motor.power - (carOnCase.weight/10);
  carOnCase.statuses.maxSpeed = carOnCase.motor.maxSpeed - carOnCase.weight;
  carOnCase.statuses.grip = carOnCase.tires.grip - carOnCase.weight;
  carOnCase.pieces.hull.color = carOnCase.color;
  
  return carOnCase;
}

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
  
  const carsRootStats = {name: newCar.name, cost: newCar.cost, weight: newCar.weight};
  gameObject.race.cars.push(new Car(newCar.driver, carsRootStats, newCar.pieces, newCar.statuses));
  
  console.log('new car created: gameObject ', gameObject);
}

/*  NEW RECTANGLE BASED COLLISION TEST: */
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
            
  this.getCorners().forEach((corner) => {
    var isCollided = pointInPoly(rectangle.getCorners(), corner.x, corner.y);
                
    if (isCollided) collision = true;
  });
  return collision;
}

// bring "full objects" like car or gameObject.race.track[0].obstacles[0]
// example: checkRectangleCollision(car, gameObject.race.track[0].obstacles[0]);
function checkRectangleCollision(rect, rect2) {

  if (testCollision.call(rect, rect2)) return true;
  else if (testCollision.call(rect2, rect)) return true;
  return false;
}

// collision test starts here
function collisionTest(car) {
  const noCollision = false;
  
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
    carInTurn.x = carInTurn.pieces.hull.x;
    carInTurn.y = carInTurn.pieces.hull.y;
    carInTurn.w = carInTurn.pieces.hull.w;
    carInTurn.h = carInTurn.pieces.hull.h;
    carInTurn.angle = carInTurn.statuses.heading;
    carInTurn.setCorners(carInTurn.angle);
  });
  // rectangles in track:
  gameObject.race.track[0].obstacles.forEach((obsInTurn) => {  
    obsInTurn.setCorners(obsInTurn.angle);
  });
}

function setupRace(){
  // ok, i need atleast: statuses: power, maxSpeed, turnRate, grip, weight, armour.. all else to default values
  
  // players car:
  createNewCar(gameObject.car, true);
  // ai cars:
  createNewCar(aiCars[0], false);
  createNewCar(aiCars[1], false);
  createNewCar(aiCars[2], false); 
  // get track... now only one track
  gameObject.race.track.push(tracks[0]);
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