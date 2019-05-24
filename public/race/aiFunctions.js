
  // radars: (how many "steps" car can go with current speed before obstacle)
  let radarForward = 5;
  let radarLeft = 0;
  let radarRight = 0;

function aiDriverBrain(aiCar) {
  const ip2 = document.getElementById('infoPlace2');
  ip2.innerHTML = '';
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
  aiCar.statuses.accelerate = false;
  aiCar.statuses.reverse = false;
  aiCar.statuses.brake = false;
  
  const distanceNow = distanceCheck(centerOfCar, centerOfNextCheckPoint);
  
  // find the best way to go
  let bestResult = 'forward';
  // go tests: 
  radarCollisions(aiCar);
  
  const forwardTestSpeeds = radarCheckForward(centerOfCar, aiCar.statuses.heading, 5);
  const turnLeftTestSpeeds = radarCheckLeft(centerOfCar, aiCar.statuses.heading, aiCar.statuses.turnRate, 5);
  const turnRightTestSpeeds = radarCheckRight(centerOfCar, aiCar.statuses.heading, aiCar.statuses.turnRate, 5);
  
  const distanceIfForward = distanceCheck(forwardTestSpeeds, centerOfNextCheckPoint);
  const distanceIfLeft = distanceCheck(turnLeftTestSpeeds, centerOfNextCheckPoint);
  const distanceIfRight = distanceCheck(turnRightTestSpeeds, centerOfNextCheckPoint);
  
  // choose direction by checking where is next checkpoint
  if (distanceIfForward > distanceIfLeft || aiCar.statuses.dodgeLeft === true) { 
    bestResult = 'turn left';
  }
  if (distanceIfForward > distanceIfRight || aiCar.statuses.dodgeRight === true) { 
    bestResult = 'turn right';
  }
  
  if (radarForward > 30) {
    
    aiCar.statuses.accelerate = true;
  } else {
    
    bestResult = 'turn right';
    aiCar.statuses.break = true;
  }
  
  // wheel turning.
  switch (bestResult) {
  
    case 'turn left': aiCar.statuses.turnLeft = true; break;
    case 'turn right': aiCar.statuses.turnRight = true; break; 
  }

  ip2.innerHTML = radarForward + ' ' + radarLeft+ ' ' + radarRight + ' '+ bestResult;
}

// Help Functions:

// Distance check
function distanceCheck(fromWhere, toWhere){
  const a = fromWhere.x - toWhere.x // x1 - x2;
  const b = fromWhere.y - toWhere.y // y1 - y2;

  const c = Math.sqrt( a*a + b*b );
  return c;
}  

// test cars x and y for collision purposes
function testCarsYandY(aiCar, testCar) {
  
  testCar.angle = aiCar.statuses.heading;
  testCar.setCorners(testCar.angle);
}

// radar functions to help to check distances

function radarCheckForward(centerOfCar, heading, speed) {
  const newSpeeds = getSpeeds(heading, speed);
  return {x: centerOfCar.x + -newSpeeds.x, y: centerOfCar.y + newSpeeds.y};
}

function radarCheckLeft(centerOfCar, heading, turnRate, speed) {
  //const newSpeeds = getSpeeds(heading -= turnRate - (speed/4), speed);
  const newSpeeds = getSpeeds(heading -= turnRate, speed);
  return {x: centerOfCar.x + -newSpeeds.x, y: centerOfCar.y + newSpeeds.y};
}

function radarCheckRight(centerOfCar, heading, turnRate, speed) {
  //const newSpeeds = getSpeeds(heading += turnRate - (speed/4), speed);
  const newSpeeds = getSpeeds(heading += turnRate, speed);
  return {x: centerOfCar.x + -newSpeeds.x, y: centerOfCar.y + newSpeeds.y};
}

// radar for checking of collisions
function radarCollisions(aiCar) {
  const maxRadar = 100;
  const radarSpeed = 1 + aiCar.statuses.speed
  // should not matter what aiCar is used as it is kind of ok that radar is not that accurate
  let testCar = createNewCar(aiCars[2], false); 
  testCar.driver = aiCar.driver;
  
  // setup the testCar:
  testCar.x = aiCar.pieces.hull.x;
  testCar.y = aiCar.pieces.hull.y;
  testCar.w = aiCar.pieces.hull.w;
  testCar.h = aiCar.pieces.hull.h;
  testCar.angle = aiCar.statuses.heading;
  testCar.setCorners(testCar.angle);
  
  // perform tests and update if collisions
  // check if going forward
  for (let i = 1; i < maxRadar; i++) {
    
    const newSpeeds = getSpeeds(aiCar.statuses.heading, radarSpeed);
    
    testCar.x = aiCar.x + -newSpeeds.x;
    testCar.y = aiCar.y + newSpeeds.y;
    updateXandY(gameObject.race.cars);
    testCarsYandY(aiCar, testCar);
    const colTest = collisionTest(testCar);
    
    if (colTest) {
      
      radarForward = i;
      return;
    }
    
    radarForward = i;
  }
  // check if turning left
  // reset testCar
  testCar.x = aiCar.pieces.hull.x;
  testCar.y = aiCar.pieces.hull.y;
  testCar.w = aiCar.pieces.hull.w;
  testCar.h = aiCar.pieces.hull.h;
  testCar.angle = aiCar.statuses.heading;
  testCar.setCorners(testCar.angle);
  
  for (let i2 = 1; i2 < maxRadar; i2++) {
    
    const newSpeeds = getSpeeds(aiCar.statuses.heading - aiCar.statuses.turnRate, radarSpeed);
    testCar.x = aiCar.x + -newSpeeds.x;
    testCar.y = aiCar.y + newSpeeds.y;
    updateXandY(gameObject.race.cars);
    testCarsYandY(aiCar, testCar);
    const colTest = collisionTest(testCar);
    
    if (colTest) {
      
      radarLeft = i2;
      return;
    }
    
    radarLeft = i2;
  } 
  // check if turning right
  // reset testCar
  testCar.x = aiCar.pieces.hull.x;
  testCar.y = aiCar.pieces.hull.y;
  testCar.w = aiCar.pieces.hull.w;
  testCar.h = aiCar.pieces.hull.h;
  testCar.angle = aiCar.statuses.heading;
  testCar.setCorners(testCar.angle);
  
  for (let i3 = 1; i3 < maxRadar; i3++) {
    
    const newSpeeds = getSpeeds(aiCar.statuses.heading + aiCar.statuses.turnRate, radarSpeed);
    testCar.x = aiCar.x + -newSpeeds.x;
    testCar.y = aiCar.y + newSpeeds.y;
    updateXandY(gameObject.race.cars);
    testCarsYandY(aiCar, testCar);
    const colTest = collisionTest(testCar);
    
    if (colTest) {
      
      radarRight = i3;
      return;
    }
    
    radarRight = i3;
  }   
  /*
  for (let i = 0; i < allPositions.length; i++) {
    
    for (let i2 = 0; i2 < allPositions[i].length; i2++) {
      
      testCar.x = allPositions[i][i2].x;
      testCar.y = allPositions[i][i2].y;
      updateXandY(gameObject.race.cars);
      testCarsYandY(testCar);
      const colTest = collisionTest(testCar);
      colTest ? allResults[i][i2] = true : allResults[i][i2] = false; 
    } 
  }
  // fix longer scanners:
  for (let ii = 0; ii < allResults[0].length; ii++) { 
    if (allResults[0][ii] === true) {allResults[1][ii] = true}
  }
  for (let ii = 0; ii < allResults[1].length; ii++) { 
    if (allResults[1][ii] === true) {allResults[2][ii] = true}
  }
  //if (ip2.innerHTML === '' && aiCar.statuses.speed > 0) { console.log('ap ar ', allPositions, allResults);}
  return results;
  */
}

function callDice(max){
    const result =  1 + Math.floor(Math.random() * max);
    return result;
}  
