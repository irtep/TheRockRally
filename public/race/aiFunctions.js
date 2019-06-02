
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
/*

 //    newCar.lastAiCp = 0;
 //   newCar.nextAiCp = 1;
*/
function aiDriverBrain(aiCar) {
  const ip2 = document.getElementById('infoPlace2');
  ip2.innerHTML = '';
  const aiCheckPoints = gameObject.race.track[0].aiCheckPoints;
  const centerOfCar = {x: aiCar.leftTopCorner.x + (aiCar.w / 2), y: aiCar.leftTopCorner.y + (aiCar.h / 2)};
  let nextCp = aiCheckPoints.filter(cp => cp.number === aiCar.nextAiCp);
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
  let shortestDistance = null;
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
  if (distanceIfForward > distanceIfLeft) { 
    
    bestResult = 'turn left';
    /*
    shortestDistance = 'turn left';
    
    if (mLeft === 'clear' && fLeft === 'clear') {
      bestResult = 'turn left';   
    } 
    */
  }
  if (distanceIfForward > distanceIfRight) { 
    
    bestResult = 'turn right';
    /*
    shortestDistance = 'turn right';
    
    if (mRight === 'clear' && fRight === 'clear') {
        
      bestResult = 'turn right';   
    }
    */
  }
  
  // gas!
  if (nForward === 'clear') {
    
   aiCar.statuses.accelerate = true;
  } else {
    /*
    bestResult = 'turn right';
    
    if (nForward !== 'clear') {
      aiCar.statuses.break = true;  
    }
    */
  }
  
  // cant go forward soon, need to turn
  /*
  if (mForward !== 'clear' || fForward !== 'clear') {
    
    if (mRight === 'clear') {
      bestResult = 'turn right';    
    } else {
      bestResult = 'turn left';
    } 
  } 
  */
  // here if all "fars" are other than clear, need to take shortestDistance
  /*
  if (fForward !== 'clear' && fLeft !== 'clear' && fRight !== 'clear') {
      
    aiCar.statuses.accelerate = false;
    
    if (aiCar.statuses.speed > 1) {
      
      aiCar.statuses.brake = true;
    }
  }
  */
  // stuck!
  
  if (nForward !== 'clear' && nLeft !== 'clear' && nRight !== 'clear' && 
     mForward !== 'clear' && mLeft !== 'clear' && mRight !== 'clear' && 
     fForward !== 'clear' && fLeft !== 'clear' && fRight !== 'clear') {
      
    aiCar.statuses.break = false;
    aiCar.statuses.reverse = true;
  }  
  
  /*
  if (fLeft === 'clear' && shortestDistance === 'turn left' && aiCar.statuses.speed > 1) {
    console.log('t l t l');
    bestResult = 'turn left';
  }
  */
  // 
  /*
  if (aiCar.statuses.speed < 1 && aiCar.statuses.break === false) {
    
    aiCar.statuses.accelerate = true;
  }
  */
  // execute wheel turning.
  switch (bestResult) {
  
    case 'turn left': aiCar.statuses.turnLeft = true; break;
    case 'turn right': aiCar.statuses.turnRight = true; break; 
  }

//  ip2.innerHTML = 'f: '/*+nForward+' '+mForward+' '+fForward+*/ +distanceIfForward+' l: '+
 //   /*nLeft+' '+mLeft+' '+fLeft+*/distanceIfLeft+' r: '+
  //  /*nRight+' '+mRight+' '+fRight+ */distanceIfRight+' best dir: '+ bestResult;
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
/*gameObject.race.tests.radarBars*/
function radarCheckForward(centerOfCar, heading, speed) {
  /*
  const rBarF = gameObject.race.tests.radarBars[0];
  return {x: rBarF.x + rBarF.w, y: rBarF.y}
  */
  
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
  let coords = {x: JSON.parse(JSON.stringify(aiCar.x)), y: JSON.parse(JSON.stringify(aiCar.y - aiCar.h/2))};
  gameObject.race.tests.radarBars = [ // (x, y, w, h, color, angle, name){x: aiCar.x, y: aiCar.y, w: 250, h: 10, heading: 
    // {x: aiCar.x, y: aiCar.y, w: 40, h: 10, heading: aiCar.statuses.heading
    //new TestBar(coords.x, coords.y - 10, 250, 20, 'yellow', aiCar.statuses.heading, 'forwardLong', 'forward'),
    //new TestBar(coords.x, coords.y - 10, 110, 20, 'yellow', aiCar.statuses.heading, 'forwardMid', 'forward'),
    new TestBar(coords.x, coords.y - 10, 40, 20, 'yellow', aiCar.statuses.heading, 'forwardShort', 'forward'),
    //new TestBar(coords.x, coords.y, 200, 10, 'red', aiCar.statuses.heading - 30, 'leftLong', 'left'),
    //new TestBar(coords.x, coords.y, 100, 10, 'red', aiCar.statuses.heading - 30, 'leftMid', 'left'),
    new TestBar(coords.x, coords.y, 40, 10, 'red', aiCar.statuses.heading - 30, 'leftShort', 'left'),
    //new TestBar(coords.x, coords.y, 200, 10, 'green', aiCar.statuses.heading + 30, 'rightLong', 'right'),
    //new TestBar(coords.x, coords.y, 100, 10, 'green', aiCar.statuses.heading + 30, 'rightMid', 'right'),
    new TestBar(coords.x, coords.y, 40, 10, 'green', aiCar.statuses.heading + 30, 'rightShort', 'right'),
  ];

  gameObject.race.tests.radarBars.forEach( (bar) => {
    bar.driver = aiCar.driver; // so that will not check against own car.
    testBarsXandY(aiCar, bar);
    updateXandY(gameObject.race.cars);
    const colResults = collisionTest(bar);
    
    if (colResults !== false) {
     // console.log('not false ', JSON.parse(JSON.stringify(colResults)), JSON.parse(JSON.stringify(bar.name)));
      if (bar.name === 'forwardLong') {fForward = 'hit!'}
      if (bar.name === 'forwardMid') {mForward = 'hit!'}
      if (bar.name === 'forwardShort') {nForward = 'hit!'}
      if (bar.name === 'leftLong') {fLeft = 'hit!'}
      if (bar.name === 'leftMid') {mLeft = 'hit!'}
      if (bar.name === 'leftShort') {nLeft = 'hit!'}
      if (bar.name === 'rightLong') {fRight = 'hit!'}
      if (bar.name === 'rightMid') {mRight = 'hit!'}
      if (bar.name === 'rightShort') {nRight = 'hit!'}
    } else {
      
      if (bar.name === 'forwardLong') {fForward = 'clear'}
      if (bar.name === 'forwardMid') {mForward = 'clear'}
      if (bar.name === 'forwardShort') {nForward = 'clear'}
      if (bar.name === 'leftLong') {fLeft = 'clear'}
      if (bar.name === 'leftMid') {mLeft = 'clear'}
      if (bar.name === 'leftShort') {nLeft = 'clear'}
      if (bar.name === 'rightLong') {fRight = 'clear'}
      if (bar.name === 'rightMid') {mRight = 'clear'}
      if (bar.name === 'rightShort') {nRight = 'clear'}
    } 
  });
}

function callDice(max){
    const result =  1 + Math.floor(Math.random() * max);
    return result;
}  
