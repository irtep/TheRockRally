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


// key Listeners
function checkKeyPressed(pressed){ 
  
  switch (pressed.code) {
  
    // up  
    case 'ArrowUp': 
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

// updating weight, cost and car handling stats.
function updateCar(carOnCase) {

  carOnCase.weight = carOnCase.chassis.weight + carOnCase.armour.weight + carOnCase.motor.weight;
  carOnCase.cost = carOnCase.chassis.cost + carOnCase.armour.cost + carOnCase.tires.cost + carOnCase.motor.cost;
  carOnCase.statuses.power = carOnCase.motor.power - (carOnCase.weight/10);
  carOnCase.statuses.maxSpeed = carOnCase.motor.maxSpeed - carOnCase.weight;
  carOnCase.statuses.grip = carOnCase.tires.grip - carOnCase.weight;
  carOnCase.pieces.hull.color = carOnCase.color;
  
  return carOnCase;
}

function createNewPlayerCar(newCar){
//  car: {driver: null, name: null, color: null, chassis: null, motor: null, tires: null, armour: null, pieces: null, statuses: null}
  // search chassis, motor, tires, armour and pieces by cars name:
  
  const stats = vehicles.filter( (cars) => newCar.name === cars.name);
  
  // chassis has pieces
  const chassis = chassises.filter( (chas) => stats[0].chassis === chas.name);
  
  const mot = motors.filter( (moto) => stats[0].motor === moto.name);
  const tire = tires.filter( (tir) => stats[0].tires === tir.name);
  const armour = armours.filter( (armo) => stats[0].armour === armo.name);
  
  newCar.chassis = chassis[0]; newCar.motor = mot[0]; newCar.tires = tire[0]; newCar.armour = armour[0];
  newCar.pieces = chassis[0].pieces;
  
  newCar = updateCar(newCar);
  
  // array for pieceList
  newCar.pieces.parts = [];
  
  // add stats that will be needed to paint the car.
  newCar.pieces.drawPoint = newCar.chassis.drawPoint;
  
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
    console.log('left front w defined');
    newCar.pieces.rearWindow.x = newCar.pieces.drawPoint.x + (newCar.pieces.hull.w / 6);
    newCar.pieces.rearWindow.y = newCar.pieces.drawPoint.y + 1.5;
    newCar.pieces.rearWindow.h = newCar.pieces.hull.h - 3;
    newCar.pieces.parts.push(newCar.pieces.rearWindow);
  }
  if (newCar.pieces.speedStripe !== undefined) {
    console.log('not undefined!');    
  } else {console.log('undefined!');}
  //console.log('car: ', newCar);
  // need to fix that below... doesnt add cost and weight! weight at least is mandatory
  const carsRootStats = {name: newCar.name, cost: newCar.cost, weight: newCar.weight};
  gameObject.race.cars.push(new Car(carsRootStats, newCar.pieces, newCar.statuses));
  console.log('new car created: gameObject ', gameObject);
}

function setupRace(){
  // ok, i need atleast: statuses: power, maxSpeed, turnRate, grip, weight, armour.. all else to default values
  
  // players car:
  createNewPlayerCar(gameObject.car);
  // ai cars: just to test using creatNewPlayerCar function and giving new x and y
  /* doesnt work yet.
  const cloneCar = _.cloneDeep(gameObject.car);
  createNewPlayerCar(cloneCar);
  gameObject.race.cars[1].pieces.hull.x = 333;
  gameObject.race.cars[1].pieces.hull.y = 333;
  */
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