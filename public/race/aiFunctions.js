

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
  const forwardTestSpeeds = radarCheckForward(centerOfCar, aiCar.statuses.heading, 5);
  const turnLeftTestSpeeds = radarCheckLeft(centerOfCar, aiCar.statuses.heading, aiCar.statuses.turnRate, 5);
  const turnRightTestSpeeds = radarCheckRight(centerOfCar, aiCar.statuses.heading, aiCar.statuses.turnRate, 5);
  
  const distanceIfForward = distanceCheck(forwardTestSpeeds, centerOfNextCheckPoint);
  const distanceIfLeft = distanceCheck(turnLeftTestSpeeds, centerOfNextCheckPoint);
  const distanceIfRight = distanceCheck(turnRightTestSpeeds, centerOfNextCheckPoint);
  
  // choose direction by checking where is next checkpoint
  if (distanceIfForward > distanceIfLeft) { 
    bestResult = 'turn left';
  }
  if (distanceIfForward > distanceIfRight) { 
    bestResult = 'turn right';
  }
  // if backside, then need to make an u turn
  if (distanceIfForward > distanceNow) { 
    bestResult = 'turn left';
  }
  
  // check collisions to adjust turning, braking etc.
  const colResults = radarCollisions(aiCar);
  /* colResults look like this. true is collision, false is free way
  results = {
    near: [null, null, null], // forward, left, right
    mid: [null, null, null], // forward, left, right 
    far: [null, null, null] // forward, left, right
  };
  */
  // far away radar
  if (colResults.far[0] === false) {
    
    aiCar.statuses.accelerate = true;
  } else {
    // speed adjust
    if (aiCar.statuses.speed > 1) {
      aiCar.statuses.brake = true;
    } else {
      aiCar.statuses.accelerate = true;
    }
    // turning adjust
    if (colResults.far[1] === false && distanceIfLeft < distanceIfRight) {
        
      bestResult = 'turn left';   
    } else {
      
      // check also if right is ok and get help from midradar...
      bestResult = 'turn right';
    }
  } 
  // mid radar
  /*
  if (colResults.mid[0] === true) {
     
      aiCar.statuses.brake = true;
    
    if (colResults.mid[1] === true) {bestResult = 'turn right'}
    if (colResults.mid[2] === true) {bestResult = 'turn left'}
  } 
  // near radar
  if (colResults.near[0] === true) {
    const diceResult = callDice(6);
    let turningWay = null;
    let alternativeWay = null;
    //aiCar.statuses.brake = true;
    
    if (diceResult < 4) {turningWay = 'turn left'; alternativeWay = 'turn right';} else {turningWay = 'turn right'; alternativeWay = 'turn left'} 
    bestResult = turningWay;
    if (colResults.near[1] === true || colResults.mid[1] === true) { bestResult = alternativeWay}
  }
  */
  // stuck!
  if (colResults.near[0] === true /*&& colResults.near[1] === true && colResults.near[2] === true*/) {
    
    aiCar.statuses.turnLeft = false;
    aiCar.statuses.turnRight = false;
    aiCar.statuses.accelerate = false;
    aiCar.statuses.reverse = true;    
  } /*else {
    
    if (aiCar.statuses.speed < 1.5) {
        
      aiCar.statuses.accelerate = true;
    }
  }*/
  /*
  if (colResults.mid[0] === true && colResults.mid[1] === true && colResults.mid[2] === true) {
    
    aiCar.statuses.accelerate = false;
    aiCar.statuses.reverse = true;    
  } */
  /*
  if (aiCar.statuses.speed < 0.5) {
    aiCar.statuses.accelerate = true;
  }
  */
  // wheel turning.
  switch (bestResult) {
  
    case 'turn left': aiCar.statuses.turnLeft = true; break;
    case 'turn right': aiCar.statuses.turnRight = true; break; 
  }

  ip2.innerHTML = colResults.near[0] + ' '+ colResults.near[1]+ ' '+ colResults.near[2] + '<br>'+
    colResults.mid[0] + ' '+ colResults.mid[1]+ ' '+ colResults.mid[2] + '<br>'+
    colResults.far[0] + ' '+ colResults.far[1]+ ' '+ colResults.far[2];
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
function testCarsYandY(testCar) {
  
  testCar.angle = testCar.statuses.heading;
  testCar.setCorners(testCar.angle);
}

// radar functions
function radarCheckForward(centerOfCar, heading, speed) {
  const newSpeeds = getSpeeds(heading, speed);
  return {x: centerOfCar.x + -newSpeeds.x, y: centerOfCar.y + newSpeeds.y};
}

function radarCheckLeft(centerOfCar, heading, turnRate, speed) {
  const newSpeeds = getSpeeds(heading -= turnRate - (speed/4), speed);
  return {x: centerOfCar.x + -newSpeeds.x, y: centerOfCar.y + newSpeeds.y};
}

function radarCheckRight(centerOfCar, heading, turnRate, speed) {
  const newSpeeds = getSpeeds(heading += turnRate - (speed/4), speed);
  return {x: centerOfCar.x + -newSpeeds.x, y: centerOfCar.y + newSpeeds.y};
}

/*
  const forwardTestSpeeds = radarCheckForward(centerOfCar, aiCar.statuses.heading, 5);
  const turnLeftTestSpeeds = radarCheckLeft(centerOfCar, aiCar.statuses.heading, aiCar.statuses.turnRate, 5);
  const turnRightTestSpeeds = radarCheckRight(centerOfCar, aiCar.statuses.heading, aiCar.statuses.turnRate, 5);
*/

function radarCollisions(aiCar) {
  const centerOfCar = {x: aiCar.leftTopCorner.x + (aiCar.w / 2), y: aiCar.leftTopCorner.y + (aiCar.h / 2)};
  // results of collision tests
  const results = {
    near: [null, null, null], // forward, left, right
    mid: [null, null, null], 
    far: [null, null, null]
  };
  // locations of car if it would move to directions and how much
  const radars = {
    near: 
      [
        radarCheckForward(centerOfCar, aiCar.statuses.heading, 50), 
        radarCheckLeft(centerOfCar, aiCar.statuses.heading, aiCar.statuses.turnRate, 30), 
        radarCheckRight(centerOfCar, aiCar.statuses.heading, aiCar.statuses.turnRate, 30)
      ], 
    mid: 
      [
        radarCheckForward(centerOfCar, aiCar.statuses.heading, 140), 
        radarCheckLeft(centerOfCar, aiCar.statuses.heading, aiCar.statuses.turnRate, 70), 
        radarCheckRight(centerOfCar, aiCar.statuses.heading, aiCar.statuses.turnRate, 70)
      ], 
    far: 
      [
        radarCheckForward(centerOfCar, aiCar.statuses.heading, 400), // added a bit more...
        radarCheckLeft(centerOfCar, aiCar.statuses.heading, aiCar.statuses.turnRate, 200), 
        radarCheckRight(centerOfCar, aiCar.statuses.heading, aiCar.statuses.turnRate, 200)
      ]
  };
  const allPositions = [radars.near, radars.mid, radars.far];
  const allResults = [results.near, results.mid, results.far];
  
  // we need a test car as it has vital functions by its class, that just a mere copy wouldnt have
  // should not matter what aiCar is used as it is kind of ok that radar is not that accurate
  let testCar = createNewCar(aiCars[2], false); 
  
  // setup the testCar:
  testCar.x = testCar.pieces.hull.x;
  testCar.y = testCar.pieces.hull.y;
  testCar.w = testCar.pieces.hull.w;
  testCar.h = testCar.pieces.hull.h;
  testCar.angle = testCar.statuses.heading;
  testCar.setCorners(testCar.angle);
  
  // perform tests and update if collisions
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
}

function callDice(max){
    const result =  1 + Math.floor(Math.random() * max);
    return result;
}  
