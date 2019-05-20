

function aiDriverBrain(aiCar) {
  const checkPoints = gameObject.race.track[0].checkPoints;
  const centerOfCar = {x: aiCar.leftTopCorner.x + (aiCar.w / 2), y: aiCar.leftTopCorner.y + (aiCar.h / 2)};
  const nextCp = checkPoints.filter(cp => cp.number === aiCar.nextCheckPoint);
  const centerOfNextCheckPoint = {
    x: nextCp[0].x + (nextCp[0].w / 2), 
    y: nextCp[0].y + (nextCp[0].h / 2)
  }
  
  // release all pedals and wheelings
  aiCar.statuses.turnLeft = false;
  aiCar.statuses.turnRight = false;
  aiCar.statuses.accelarate = false;
  aiCar.statuses.reverse = false;
  aiCar.statuses.brake = false;
  
  const distanceNow = distanceCheck(centerOfCar, centerOfNextCheckPoint, 0, 0);
  
  // find the best way to go
  let bestResult = 'forward';
  // go tests:
  const forwardTestSpeeds = getSpeeds(aiCar.statuses.heading, aiCar.statuses.speed);
  const turnLeftTestSpeeds = getSpeeds(aiCar.statuses.heading -= aiCar.statuses.turnRate - (aiCar.statuses.speed/7), aiCar.statuses.speed);
  const turnRightTestSpeeds = getSpeeds(aiCar.statuses.heading += aiCar.statuses.turnRate - (aiCar.statuses.speed/7), aiCar.statuses.speed);
  const distanceIfForward = distanceCheck(centerOfCar, centerOfNextCheckPoint, forwardTestSpeeds.x, forwardTestSpeeds.y);
  const distanceIfLeft = distanceCheck(centerOfCar, centerOfNextCheckPoint, turnLeftTestSpeeds.x, turnLeftTestSpeeds.y);
  const distanceIfRight = distanceCheck(centerOfCar, centerOfNextCheckPoint, turnRightTestSpeeds.x, turnRightTestSpeeds.y);
  
  // directions
  if (distanceIfForward > distanceIfLeft) { bestResult = 'turn left' }
  if (distanceIfForward > distanceIfRight) { bestResult = 'turn right' }
  // if backside, then need to make an u turn
  if (distanceIfForward > distanceNow) { bestResult = 'turn left' }
  
  
  // accelerate, not, or break
  let ghostCar = JSON.parse(JSON.stringify(aiCar));
  if (aiCar.statuses.speed < 0.01) {
    // check if collision if goes forwards
    ghostCar.x = ghostCar.x += (forwardTestSpeeds.x * 3); // * 3 to make sure that reverses enough
    ghostCar.y = ghostCar.y += (forwardTestSpeeds.y * 3);
    const colTest = collisionTest(ghostCar);
    
    if (colTest !== false) {
      // reverse
      aiCar.statuses.reverse = true;
    } else { 
      aiCar.statuses.accelerate = true; }
  }
  
  // check if anything quite close
    ghostCar = JSON.parse(JSON.stringify(aiCar));
    ghostCar.x = ghostCar.x += (forwardTestSpeeds.x * 20); // * 3 to make sure that reverses enough
    ghostCar.y = ghostCar.y += (forwardTestSpeeds.y * 20);
    const colTest2 = collisionTest(ghostCar);
  
  if (colTest2 !== false) { aiCar.statuses.accelerate = false; } else { aiCar.statuses.accelerate = true; }
  
  // if anything quite close
    ghostCar = JSON.parse(JSON.stringify(aiCar));
    ghostCar.x = ghostCar.x += (forwardTestSpeeds.x * 7); // * 3 to make sure that reverses enough
    ghostCar.y = ghostCar.y += (forwardTestSpeeds.y * 7);
    const colTest3 = collisionTest(ghostCar);
  
  if (colTest3 !== false) { aiCar.statuses.accelerate = false; aiCar.statuses.brake = true; } else { aiCar.statuses.accelerate = true; }
  
  // wheel turning.
  switch (bestResult) {
  
    case 'turn left': aiCar.statuses.turnLeft = true; break;
    case 'turn right': aiCar.statuses.turnRight = true; break; 
  }

}

function clearControls() {

}

// Distance check
function distanceCheck(fromWhere, toWhere, modX, modY){ // modX and modY to add modifications to coords, for example in radar check
  const a = (fromWhere.x + modX) - toWhere.x // x1 - x2;
  const b = (fromWhere.y + modY) - toWhere.y // y1 - y2;

  const c = Math.sqrt( a*a + b*b );
  return c;
}  

/*  turn left:
      if (this.statuses.speed < this.statuses.grip) {
        this.statuses.heading -= this.statuses.turnRate - (this.statuses.speed/7);
      } else {
        this.statuses.heading -= this.statuses.turnRate - (this.statuses.speed/7) + (this.statuses.grip/2);
      }
*/

/*
function getSpeeds (rotation, speed) {
  const to_angles = Math.PI/180;
  
  return {
		y: Math.sin(rotation * to_angles) * speed,
		x: Math.cos(rotation * to_angles) * speed * -1,
	};
}
*/

