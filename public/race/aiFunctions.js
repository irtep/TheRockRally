

function aiDriverBrain(aiCar) {
  const checkPoints = gameObject.race.track[0].checkPoints;
  const centerOfCar = {x: aiCar.leftTopCorner.x + (aiCar.w / 2), y: aiCar.leftTopCorner.y + (aiCar.h / 2)};
  let nextCp = checkPoints.filter(cp => cp.number === aiCar.nextCheckPoint);
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
  const turnLeftTestSpeeds = getSpeeds(aiCar.statuses.heading -= aiCar.statuses.turnRate - (aiCar.statuses.speed/4), aiCar.statuses.speed);
  const turnRightTestSpeeds = getSpeeds(aiCar.statuses.heading += aiCar.statuses.turnRate - (aiCar.statuses.speed/4), aiCar.statuses.speed);
  const distanceIfForward = distanceCheck(centerOfCar, centerOfNextCheckPoint, forwardTestSpeeds.x, forwardTestSpeeds.y);
  const distanceIfLeft = distanceCheck(centerOfCar, centerOfNextCheckPoint, turnLeftTestSpeeds.x, turnLeftTestSpeeds.y);
  const distanceIfRight = distanceCheck(centerOfCar, centerOfNextCheckPoint, turnRightTestSpeeds.x, turnRightTestSpeeds.y);
  
  // directions
  if (distanceIfForward > distanceIfLeft) { bestResult = 'turn left' }
  if (distanceIfForward > distanceIfRight) { bestResult = 'turn right' }
  // if backside, then need to make an u turn
  if (distanceIfForward > distanceNow) { bestResult = 'turn left' }
  
  document.getElementById('infoPlace2').innerHTML = bestResult;
  // accelerate, not, or break
  let ghostCar = JSON.parse(JSON.stringify(aiCar)); // to get place to copy x and y
  let testCar = createNewCar(aiCars[2], false); // should not matter what aiCar is used...
  
  if (aiCar.statuses.speed < 0.01) {
    // check if collision if goes forwards
    ghostCar.x = ghostCar.x += (forwardTestSpeeds.x * 3); // * 3 to make sure that reverses enough
    ghostCar.y = ghostCar.y += (forwardTestSpeeds.y * 3);
    testCar.x = ghostCar.x; testCar.y = ghostCar.y;
    updateXandY(gameObject.race.cars);
    testCarsYandY(testCar);
    const colTest = collisionTest(testCar);
    
    if (colTest !== false) {
      // reverse
      aiCar.statuses.reverse = true;
    } else { 
      aiCar.statuses.accelerate = true; }
  }
  
  // check if anything quite close
    ghostCar = JSON.parse(JSON.stringify(aiCar));
    ghostCar.x = ghostCar.x += (forwardTestSpeeds.x * 20); 
    ghostCar.y = ghostCar.y += (forwardTestSpeeds.y * 20);
    testCar.x = ghostCar.x; testCar.y = ghostCar.y;
    updateXandY(gameObject.race.cars);
    testCarsYandY(testCar);
    const colTest2 = collisionTest(testCar);
  
  if (colTest2 !== false) { 
    aiCar.statuses.accelerate = false; 
    aiCar.statuses.turnRight = true;
  } else { 
    aiCar.statuses.accelerate = true; 
  }
  
  // if anything quite close
    ghostCar = JSON.parse(JSON.stringify(aiCar));
    ghostCar.x = ghostCar.x += (forwardTestSpeeds.x * 7); 
    ghostCar.y = ghostCar.y += (forwardTestSpeeds.y * 7);
    testCar.x = ghostCar.x; testCar.y = ghostCar.y;
    updateXandY(gameObject.race.cars);
    testCarsYandY(testCar);
    const colTest3 = collisionTest(testCar);
  
  if (colTest3 !== false) { 
    aiCar.statuses.accelerate = false; 
    aiCar.statuses.brake = true; 
    aiCar.statuses.turnRight = true;
  } else { 
    aiCar.statuses.accelerate = true; 
  }
  
  // wheel turning.
  switch (bestResult) {
  
    case 'turn left': aiCar.statuses.turnLeft = true; break;
    case 'turn right': aiCar.statuses.turnRight = true; break; 
  }

}

// Distance check
function distanceCheck(fromWhere, toWhere, modX, modY){ // modX and modY to add modifications to coords, for example in radar check
  const a = (fromWhere.x + modX) - toWhere.x // x1 - x2;
  const b = (fromWhere.y + modY) - toWhere.y // y1 - y2;

  const c = Math.sqrt( a*a + b*b );
  return c;
}  

// test cars x and y for collision purposes
function testCarsYandY(testCar) {
  
  testCar.angle = testCar.statuses.heading;
  testCar.setCorners(testCar.angle);
}

