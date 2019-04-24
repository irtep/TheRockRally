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
      gameObject.race[0].statuses.accelerate = true;
    break;
    
    // down
    case 'ArrowDown': 
      gameObject.race[0].statuses.braking = true;
    break;
      
    // left  
    case 'ArrowLeft': 
      gameObject.race[0].statuses.turnLeft = true;
    break;
      
    // right  
    case 'ArrowRight': 
      gameObject.race[0].statuses.turnRight = true;
    break;
      
    // 'r' for reverse:
    case 'KeyR':
      gameObject.race[0].statuses.reverse = true;  
    break;
      
    default: console.log('not found this key(pressed)');  
  }
}
function checkKeyReleased(released){
  
  switch (released.code) {
  
    // up  
    case 'ArrowUp': 
      gameObject.race[0].statuses.accelerate = false;
    break;
    
    // down
    case 'ArrowDown': 
      gameObject.race[0].statuses.braking = false;
    break;
      
    // left  
    case 'ArrowLeft': 
      gameObject.race[0].statuses.turnLeft = false;
    break;
      
    // right  
    case 'ArrowRight': 
      gameObject.race[0].statuses.turnRight = false;
    break;      
    // 'r' for reverse:
    case 'KeyR':
      gameObject.race[0].statuses.reverse = false;  
    break;
      
    default: console.log('not found this key(released) ');  
  }
}

function updateCar(carOnCase) {

  carOnCase.weight = carOnCase.chassis.weight + carOnCase.armour.weight + carOnCase.motor.weight;
  carOnCase.cost = carOnCase.chassis.cost + carOnCase.armour.cost + carOnCase.tires.cost + carOnCase.motor.cost;
  carOnCase.statuses.power = carOnCase.motor.power - (carOnCase.weight/10);
  carOnCase.statuses.maxSpeed = carOnCase.motor.maxSpeed - carOnCase.weight;
  carOnCase.statuses.grip = carOnCase.tires.grip - carOnCase.weight;
  carOnCase.pieces.hull.color = carOnCase.color;
  
  return carOnCase;
}

function createNewCar(newCar){
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
  
  //console.log('car: ', newCar);
  // need to fix that below... doesnt add cost and weight! weight at least is mandatory
  gameObject.race.push(new Car(newCar.name, newCar.pieces, newCar.statuses));
  console.log('gameObject ', gameObject);
}

function setupRace(){
  // ok, i need atleast: statuses: power, maxSpeed, turnRate, grip, weight, armour.. all else to default values
  
  // players car:
  createNewCar(gameObject.car);
  // ai cars:

}

/*

function rotatePoint (coords, angle, distance) {
  const TO_RADIANS = Math.PI/180;
	return {
		x: Math.sin(angle * TO_RADIANS) * distance + coords.x,
		y: Math.cos(angle * TO_RADIANS) * distance * -1 + coords.y,
	};
}

function drawPoint (xy) {
	context.fillRect(xy.x,xy.y,1,1);
}

function distance (from, to) {
	var a = from.x > to.x ? from.x - to.x : to.x - from.x,
		b = from.y > to.y ? from.y - to.y : to.y - from.y
		;
	return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2))
}
*/
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