
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
  
  // set collision points.
  const cPoints = newCar.pieces.collisionPoints;
  const mediumBall = newCar.pieces.hull.h / 10;
  const bigBall = newCar.pieces.hull.h / 3;
  //
  cPoints[0].a = mediumBall;
  cPoints[0].x = newCar.pieces.drawPoint.x + (newCar.pieces.hull.w - (cPoints[0].a / 2));
  cPoints[0].y = newCar.pieces.drawPoint.y + (newCar.pieces.hull.h / 2);
  
  cPoints[1].a = mediumBall;
  cPoints[1].x = newCar.pieces.drawPoint.x + (newCar.pieces.hull.w - (cPoints[1].a / 2));
  cPoints[1].y = newCar.pieces.drawPoint.y + (newCar.pieces.hull.h / 2) - (mediumBall * 3); 
  
  cPoints[2].a = mediumBall;
  cPoints[2].x = newCar.pieces.drawPoint.x + (newCar.pieces.hull.w - (cPoints[2].a / 2));
  cPoints[2].y = newCar.pieces.drawPoint.y + (newCar.pieces.hull.h / 2) + (mediumBall * 3); 
  
  cPoints[3].a = mediumBall;
  cPoints[3].x = newCar.pieces.drawPoint.x + cPoints[3].a / 2;
  cPoints[3].y = newCar.pieces.drawPoint.y + (newCar.pieces.hull.h / 2);
  
  cPoints[4].a = mediumBall;
  cPoints[4].x = newCar.pieces.drawPoint.x + cPoints[3].a / 2;
  cPoints[4].y = newCar.pieces.drawPoint.y + (newCar.pieces.hull.h / 2) - (mediumBall * 3); 
  
  cPoints[5].a = mediumBall;
  cPoints[5].x = newCar.pieces.drawPoint.x + cPoints[3].a / 2;
  cPoints[5].y = newCar.pieces.drawPoint.y + (newCar.pieces.hull.h / 2) + (mediumBall * 3); 
  
  cPoints[6].a = bigBall;
  cPoints[6].x = newCar.pieces.drawPoint.x + (newCar.pieces.hull.w / 2);
  cPoints[6].y = newCar.pieces.drawPoint.y + (newCar.pieces.hull.h / 3);
  
  cPoints[7].a = bigBall;
  cPoints[7].x = newCar.pieces.drawPoint.x + (newCar.pieces.hull.w / 2) - (cPoints[7].a * 2.5);
  cPoints[7].y = newCar.pieces.drawPoint.y + (newCar.pieces.hull.h / 3);
  
  cPoints[8].a = bigBall;
  cPoints[8].x = newCar.pieces.drawPoint.x + (newCar.pieces.hull.w / 2) + (cPoints[8].a * 2.5);
  cPoints[8].y = newCar.pieces.drawPoint.y + (newCar.pieces.hull.h / 3);
  
  cPoints[9].a = bigBall;
  cPoints[9].x = newCar.pieces.drawPoint.x + (newCar.pieces.hull.w / 2);
  cPoints[9].y = newCar.pieces.drawPoint.y + (newCar.pieces.hull.h / 1.5);
  
  cPoints[10].a = bigBall;
  cPoints[10].x = newCar.pieces.drawPoint.x + (newCar.pieces.hull.w / 2) - (cPoints[10].a * 2.5);
  cPoints[10].y = newCar.pieces.drawPoint.y + (newCar.pieces.hull.h / 1.5);
  
  cPoints[11].a = bigBall;
  cPoints[11].x = newCar.pieces.drawPoint.x + (newCar.pieces.hull.w / 2) + (cPoints[11].a * 2.5);
  cPoints[11].y = newCar.pieces.drawPoint.y + (newCar.pieces.hull.h / 1.5);
  //
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

/*  NEW COLLISION DETECT FORMULA */

function setCorners(angle) {
  
  function getAngleForNextCorner(anc,vectorLength) {
    var alpha = Math.acos(anc/vectorLength)*(180 / Math.PI);
    return 180 - alpha*2;
  }
  
  function getVectorLength(x, y, width, height){
   var center = {
     x: x + width / 2,
     y: y + height / 2
   };
  //console.log('center: ',center);
   var vector = {
     x: (x - center.x),
    y: (y - center.y)
   };
     return Math.sqrt(vector.x*vector.x+vector.y*vector.y);
  }  
  
  function getOffset(el) {
    var _x = 0;
    var _y = 0;
    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
      _x += el.offsetLeft - el.scrollLeft;
      _y += el.offsetTop - el.scrollTop;
      el = el.offsetParent;
    }
    return {
      top: _y,
      left: _x
    };
  }
  
  this.originalPos = getOffset(this.htmlElement);
  this.leftTopCorner = getRotatedTopLeftCornerOfRect(this.originalPos.left, this.originalPos.top, this.width, this.height, angle);

  var vecLength = getVectorLength(this.originalPos.left, this.originalPos.top, this.width, this.height);
  //console.log('vecLength: ',vecLength);

  angle = angle+getAngleForNextCorner(this.width/2, vecLength);
  //console.log('angle: ',angle);
  this.rightTopCorner = getRotatedTopLeftCornerOfRect(this.originalPos.left, this.originalPos.top, this.width, this.height, angle);

  angle = angle+getAngleForNextCorner(this.height/2, vecLength);
  //console.log('angle: ',angle);
  this.rightBottomCorner = getRotatedTopLeftCornerOfRect(this.originalPos.left, this.originalPos.top, this.width, this.height, angle);

  angle = angle+getAngleForNextCorner(this.width/2, vecLength);
  //console.log('angle: ',angle);
  this.leftBottomCorner = getRotatedTopLeftCornerOfRect(this.originalPos.left, this.originalPos.top, this.width, this.height, angle);

  //console.log(this);
};

function getRotatedTopLeftCornerOfRect(x, y, width, height, angle) {
  
  function sin(x) {
    return Math.sin(x / 180 * Math.PI);
  }

  function cos(x) {
    return Math.cos(x / 180 * Math.PI);
  }
  
  var center = {
    x: x + width / 2,
    y: y + height / 2
  };
  //console.log('center: ',center);
  var vector = {
    x: (x - center.x),
    y: (y - center.y)
  };
   //console.log('vector: ',vector);
  var rotationMatrix = [[cos(angle), -sin(angle)],[sin(angle), cos(angle)]];
  //console.log('rotationMatrix: ',rotationMatrix);
  var rotatedVector = {
    x: vector.x * rotationMatrix[0][0] + vector.y * rotationMatrix[0][1],
    y: vector.x * rotationMatrix[1][0] + vector.y * rotationMatrix[1][1]
  };
   //console.log('rotatedVector: ',rotatedVector);
  return {
    x: (center.x + rotatedVector.x),
    y: (center.y + rotatedVector.y)
  };
}

// checks collision between circle 1 and 2
function checkCollision(circle1, circle2) {
// {x: 37.9, y: 4.5, a: 1.2}
const dx = circle1.x - circle2.x;
const dy = circle1.y - circle2.y;
const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < circle1.a + circle2.a) {
    //console.log('collision!!');
    // collision detected!
    return [circle1, circle2];
  } else {
    return 'no collision';
  }
}

// Collision test generator
function collisionTest(car){ 
  let collisionAt = 'no collision';
  // all collision points need to test
  for (let i = 0; i < car.pieces.collisionPoints.length; i++) {
    // check other cars
    for (let ii = 0; ii < gameObject.race.cars.length; ii++) {

      // lets not compare with same car.
      if (car.driver !== gameObject.race.cars[ii].driver) { //console.log('drivers: ', gameObject.race.cars[0], gameObject.race.cars[ii]);
        //console.log('lengt: ', gameObject.race.cars[ii].collisionPoints.length);
        for (let iii = 0; iii < gameObject.race.cars[ii].pieces.collisionPoints.length; iii++) {
          //console.log('comparing: ', car.pieces.collisionPoints[i], gameObject.race.cars[ii].collisionPoints[iii]);
          const result = checkCollision(car.pieces.collisionPoints[i], gameObject.race.cars[ii].pieces.collisionPoints[iii]);
          
          if (result !== 'no collision') {
            // can return if collision
            return result;
          }
        }
      }
    }
    
    // check with track obstacles:
    for (let iv = 0; iv < gameObject.race.track[0].obstacles.length; iv++) {
      // comparing only with arc0:s
      if (gameObject.race.track[0].obstacles[iv].name === 'arcO') {
          
        const result = checkCollision(car.pieces.collisionPoints[i], gameObject.race.track[0].obstacles[iv]);
        
        if (results !== 'no collision') {
          // can return if collision
          return results;
        }  
      }
    }
  }
  // if no collision:
  return collisionAt;
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