

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
  
  const distanceNow = distanceCheck(centerOfCar, centerOfNextCheckPoint);
  //if (aiCar.statuses.speed > 0) { console.log('dcheck now ', centerOfCar, centerOfNextCheckPoint);}
  
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
  
  //document.getElementById('infoPlace2').innerHTML = bestResult + ' ' + distanceIfForward+ ' '+ distanceIfLeft+ ' '+ distanceIfRight+ ' ' +distanceNow;
  // check collisions to adjust turning, braking etc.
  if (aiCar.statuses.speed < 5) {
    aiCar.statuses.accelerate = true;
  }
  
  const colResults = radarCollisions(aiCar);
  // wheel turning.
  switch (bestResult) {
  
    case 'turn left': aiCar.statuses.turnLeft = true; break;
    case 'turn right': aiCar.statuses.turnRight = true; break; 
  }

}

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
  const ip2 = document.getElementById('infoPlace2');
  ip2.innerHTML = '';
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
        radarCheckForward(centerOfCar, aiCar.statuses.heading, 30), 
        radarCheckLeft(centerOfCar, aiCar.statuses.heading, aiCar.statuses.turnRate, 30), 
        radarCheckRight(centerOfCar, aiCar.statuses.heading, aiCar.statuses.turnRate, 30)
      ], 
    mid: 
      [
        radarCheckForward(centerOfCar, aiCar.statuses.heading, 60), 
        radarCheckLeft(centerOfCar, aiCar.statuses.heading, aiCar.statuses.turnRate, 60), 
        radarCheckRight(centerOfCar, aiCar.statuses.heading, aiCar.statuses.turnRate, 60)
      ], 
    far: 
      [
        radarCheckForward(centerOfCar, aiCar.statuses.heading, 500), 
        radarCheckLeft(centerOfCar, aiCar.statuses.heading, aiCar.statuses.turnRate, 500), 
        radarCheckRight(centerOfCar, aiCar.statuses.heading, aiCar.statuses.turnRate, 500)
      ]
  };
  const allPositions = [radars.near, radars.mid, radars.far];
  const allResults = [results.near, results.mid, results.far];
  
  // we need a test car as it has vital functions by its class, that just a mere copy wouldnt have
  // should not matter what aiCar is used as it is kind of ok that radar is not that accurate
  let testCar = createNewCar(aiCars[2], false); 
  
  // perform tests and update if collisions
  for (let i = 0; i < allPositions.length; i++) {
    
    for (let i2 = 0; i2 < allPositions[i].length; i2++) {
      
      testCar.x = allPositions[i][i2].x;
      testCar.y = allPositions[i][i2].y;
      updateXandY(gameObject.race.cars);
      testCarsYandY(testCar);
      const colTest = collisionTest(testCar);
      //if (aiCar.statuses.speed > 0) {console.log('coltest: ', colTest, testCar.x);}
      colTest ? allResults[i][i2] = true : allResults[i][i2] = false; 
    } 
  }
  //if (ip2.innerHTML === '' && aiCar.statuses.speed > 0) { console.log('ap ar ', allPositions, allResults);}
  ip2.innerHTML = results.near[0] + ' '+ results.near[1]+ ' '+ results.near[2] + '<br>'+
    results.mid[0] + ' '+ results.mid[1]+ ' '+ results.mid[2] + '<br>'+
    results.far[0] + ' '+ results.far[1]+ ' '+ results.far[2];
  return results;
  /*
  // check if near anything
  let ghostCar = JSON.parse(JSON.stringify(aiCar)); // to get place to copy x and y
    // check if collision if goes forwards
    testCar.x = ghostCar.x + (forwardTestSpeeds.x * 3) ; testCar.y = ghostCar.y + (forwardTestSpeeds.y * 3) ;
    updateXandY(gameObject.race.cars);
    testCarsYandY(testCar);
    const colTest = collisionTest(testCar);
    
    if (colTest !== false) {
      // reverse
      if (aiCar.statuses.speed < 0.4){
        aiCar.statuses.reverse = true;
      }
    } else { 
      aiCar.statuses.accelerate = true; }
  
  
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
  */
}
