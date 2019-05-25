
  // radars: (how many "steps" car can go with current speed before obstacle)
  let nForward = 'clear';
  let nLeft = 'clear';
  let nRight = 'clear';
  let mForward = 'clear';
  let mLeft = 'clear';
  let mRight = 'clear';  
  let fForward = 'clear';
  let fLeft = 'clear';
  let fRight = 'clear';  


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
  let radars = [nForward, nLeft, nRight, mForward, mLeft, mRight, fForward, fLeft, fRight];
  
  for (let i = 0; i < radars.length; i++) {
    
    radars[i] = 'clear';
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
  
  // distance checks
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
  
  if (bestResult === 'forward') {
    
   aiCar.statuses.accelerate = true;
  } //else {
    
  //  bestResult = 'turn right';
   // aiCar.statuses.break = true;
  //}
  
  if (mLeft !== 'clear') {
    
    bestResult = 'turn right';
  }
  
  // wheel turning.
  switch (bestResult) {
  
    case 'turn left': aiCar.statuses.turnLeft = true; break;
    case 'turn right': aiCar.statuses.turnRight = true; break; 
  }

  ip2.innerHTML = 'f: '+nForward+' '+nForward+' '+nForward+'<br> l: '+
    nLeft+' '+nLeft+' '+nLeft+'<br> r: '+
    nRight+' '+nRight+' '+nRight;
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
function testBarsXandY(aiCar, testBar) {
  
  testBar.angle = testBar.heading;
  testBar.setCorners(testBar.angle);
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
  updateXandY(gameObject.race.cars);
  let coords = {x: JSON.parse(JSON.stringify(aiCar.x)), y: JSON.parse(JSON.stringify(aiCar.y))};
  gameObject.race.tests.radarBars = [ // (x, y, w, h, color, angle, name){x: aiCar.x, y: aiCar.y, w: 250, h: 10, heading: 
    // {x: aiCar.x, y: aiCar.y, w: 40, h: 10, heading: aiCar.statuses.heading
    new TestBar(coords.x, coords.y, 250, 10, 'yellow', aiCar.statuses.heading, 'forwardLong', 'forward'),
    new TestBar(coords.x, coords.y, 110, 10, 'yellow', aiCar.statuses.heading, 'forwardMid', 'forward'),
    new TestBar(coords.x, coords.y, 40, 10, 'yellow', aiCar.statuses.heading, 'forwardShort', 'forward'),
    new TestBar(coords.x, coords.y, 250, 10, 'red', aiCar.statuses.heading - 30, 'leftLong', 'left'),
    new TestBar(coords.x, coords.y, 110, 10, 'red', aiCar.statuses.heading - 30, 'leftMid', 'left'),
    new TestBar(coords.x, coords.y, 40, 10, 'red', aiCar.statuses.heading - 30, 'leftShort', 'left'),
    new TestBar(coords.x, coords.y, 250, 10, 'green', aiCar.statuses.heading + 30, 'rightLong', 'right'),
    new TestBar(coords.x, coords.y, 110, 10, 'green', aiCar.statuses.heading + 30, 'rightMid', 'right'),
    new TestBar(coords.x, coords.y, 40, 10, 'green', aiCar.statuses.heading + 30, 'rightShort', 'right'),
  ];
  
  //radarForward = 'clear'; radarLeft = 'clear'; radarRight = 'clear';
  //let hits = [false, false, false];

  gameObject.race.tests.radarBars.forEach( (bar) => {
    bar.driver = aiCar.driver; // so that will not check against own car.
    testBarsXandY(aiCar, bar);
    updateXandY(gameObject.race.cars);
    const colResults = collisionTest(bar);
    
    if (colResults !== false) {
      
      //console.log('not false ', JSON.parse(JSON.stringify(colResults)), JSON.parse(JSON.stringify(bar.name)));
      
          if (bar.name === 'forwardLong') {fForward = 'hit!'}
          if (bar.name === 'forwardMid') {mForward = 'hit!'}
          if (bar.name === 'forwardShort') {nForward = 'hit!'}
          if (bar.name === 'leftLong') {fLeft = 'hit!'}
          if (bar.name === 'leftLong') {mLeft = 'hit!'}
          if (bar.name === 'leftLong') {nLeft = 'hit!'}
          if (bar.name === 'rightLong') {fRight = 'hit!'}
          if (bar.name === 'rightLong') {mRight = 'hit!'}
          if (bar.name === 'rightLong') {nRight = 'hit!'}
      
    } else {
      
          if (bar.name === 'forwardLong') {fForward = 'clear'}
          if (bar.name === 'forwardMid') {mForward = 'clear'}
          if (bar.name === 'forwardShort') {nForward = 'clear'}
          if (bar.name === 'leftLong') {fLeft = 'clear'}
          if (bar.name === 'leftLong') {mLeft = 'clear'}
          if (bar.name === 'leftLong') {nLeft = 'clear'}
          if (bar.name === 'rightLong') {fRight = 'clear'}
          if (bar.name === 'rightLong') {mRight = 'clear'}
          if (bar.name === 'rightLong') {nRight = 'clear'}
      
      
    }
    /*
    for (let i = 0; i < hits.length; i++) {
    
      if (hits[i] === true) {
        
        radars[i] = bar.name;
      }
    }
  */
  });
}

function callDice(max){
    const result =  1 + Math.floor(Math.random() * max);
    return result;
}  
