
// with grip
function getSpeeds (rotation, speed) {
  const TO_RADIANS = Math.PI/180;
  
  return {
		y: Math.sin(rotation * TO_RADIANS) * speed,
		x: Math.cos(rotation * TO_RADIANS) * speed * -1,
	};
}
// when lost grip:
function getSpeedsSliding (rotation, speed, slide) {
  const TO_RADIANS = Math.PI/180;
  let speedX = Math.cos(rotation * TO_RADIANS) * speed * -1;
  let speedY = Math.sin(rotation * TO_RADIANS) * speed;
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
  // array for collision points... only for testing purposes
  newCar.pieces.cPoints = [];
  
  // add stats that will be needed to paint the car. For all different parts.
  newCar.pieces.drawPoint = newCar.chassis.drawPoint;
  
  // set collision points.
  const cPoints = newCar.pieces.collisionPoints;
  const mediumBall = newCar.pieces.hull.h / 10;
  const bigBall = newCar.pieces.hull.h / 3;
  
  cPoints.frontCenter.a = mediumBall;
  cPoints.frontCenter.x = newCar.pieces.drawPoint.x + (newCar.pieces.hull.w - (cPoints.frontCenter.a / 2));
  cPoints.frontCenter.y = newCar.pieces.drawPoint.y + (newCar.pieces.hull.h / 2);
  newCar.pieces.cPoints.push(cPoints.frontCenter);
  
  cPoints.frontLeft.a = mediumBall;
  cPoints.frontLeft.x = newCar.pieces.drawPoint.x + (newCar.pieces.hull.w - (cPoints.frontLeft.a / 2));
  cPoints.frontLeft.y = newCar.pieces.drawPoint.y + (newCar.pieces.hull.h / 2) - (mediumBall * 3); 
  newCar.pieces.cPoints.push(cPoints.frontLeft);
  
  cPoints.frontRight.a = mediumBall;
  cPoints.frontRight.x = newCar.pieces.drawPoint.x + (newCar.pieces.hull.w - (cPoints.frontRight.a / 2));
  cPoints.frontRight.y = newCar.pieces.drawPoint.y + (newCar.pieces.hull.h / 2) + (mediumBall * 3); 
  newCar.pieces.cPoints.push(cPoints.frontRight); 
  
  cPoints.backCenter.a = mediumBall;
  cPoints.backCenter.x = newCar.pieces.drawPoint.x + cPoints.backCenter.a / 2;
  cPoints.backCenter.y = newCar.pieces.drawPoint.y + (newCar.pieces.hull.h / 2);
  newCar.pieces.cPoints.push(cPoints.backCenter);
  
  cPoints.backLeft.a = mediumBall;
  cPoints.backLeft.x = newCar.pieces.drawPoint.x + cPoints.backCenter.a / 2;
  cPoints.backLeft.y = newCar.pieces.drawPoint.y + (newCar.pieces.hull.h / 2) - (mediumBall * 3); 
  newCar.pieces.cPoints.push(cPoints.backLeft);
  
  cPoints.backRight.a = mediumBall;
  cPoints.backRight.x = newCar.pieces.drawPoint.x + cPoints.backCenter.a / 2;
  cPoints.backRight.y = newCar.pieces.drawPoint.y + (newCar.pieces.hull.h / 2) + (mediumBall * 3); 
  newCar.pieces.cPoints.push(cPoints.backRight);
  
  cPoints.leftCenter.a = bigBall;
  cPoints.leftCenter.x = newCar.pieces.drawPoint.x + (newCar.pieces.hull.w / 2);
  cPoints.leftCenter.y = newCar.pieces.drawPoint.y + (newCar.pieces.hull.h / 3);
  newCar.pieces.cPoints.push(cPoints.leftCenter);
  
  cPoints.leftLeft.a = bigBall;
  cPoints.leftLeft.x = newCar.pieces.drawPoint.x + (newCar.pieces.hull.w / 2) - (cPoints.leftLeft.a * 2.5);
  cPoints.leftLeft.y = newCar.pieces.drawPoint.y + (newCar.pieces.hull.h / 3);
  newCar.pieces.cPoints.push(cPoints.leftLeft);
  
  cPoints.leftRight.a = bigBall;
  cPoints.leftRight.x = newCar.pieces.drawPoint.x + (newCar.pieces.hull.w / 2) + (cPoints.leftRight.a * 2.5);
  cPoints.leftRight.y = newCar.pieces.drawPoint.y + (newCar.pieces.hull.h / 3);
  newCar.pieces.cPoints.push(cPoints.leftRight);
  
  cPoints.rightCenter.a = bigBall;
  cPoints.rightCenter.x = newCar.pieces.drawPoint.x + (newCar.pieces.hull.w / 2);
  cPoints.rightCenter.y = newCar.pieces.drawPoint.y + (newCar.pieces.hull.h / 1.5);
  newCar.pieces.cPoints.push(cPoints.rightCenter);
  
  cPoints.rightLeft.a = bigBall;
  cPoints.rightLeft.x = newCar.pieces.drawPoint.x + (newCar.pieces.hull.w / 2) - (cPoints.rightLeft.a * 2.5);
  cPoints.rightLeft.y = newCar.pieces.drawPoint.y + (newCar.pieces.hull.h / 1.5);
  newCar.pieces.cPoints.push(cPoints.rightLeft);
  
  cPoints.rightRight.a = bigBall;
  cPoints.rightRight.x = newCar.pieces.drawPoint.x + (newCar.pieces.hull.w / 2) + (cPoints.rightRight.a * 2.5);
  cPoints.rightRight.y = newCar.pieces.drawPoint.y + (newCar.pieces.hull.h / 1.5);
  newCar.pieces.cPoints.push(cPoints.rightRight);
  
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

function collisionTest(car){
/* circle to rect


*/  
  
/*
var circle1 = {radius: 20, x: 5, y: 5};
var circle2 = {radius: 12, x: 10, y: 5};

var dx = circle1.x - circle2.x;
var dy = circle1.y - circle2.y;
var distance = Math.sqrt(dx * dx + dy * dy);

if (distance < circle1.radius + circle2.radius) {
    // collision detected!
}
*/
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