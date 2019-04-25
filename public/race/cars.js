/*
// Test default values:

// Rond Comet
  let statuses = {
    name: 'Rond Comet',
    speed: 0,
    power: 0.1,
    brakingValue: 0.2,
    maxSpeed: 9,
    turnRate: 5,
    originalFriction: 0.06,
    friction: 0.06,
    heading: 0,
    grip: 6, // max speed what it can turn without slide
    isMoving: false,
    reverse: false,
    weight: 10,
    outOfControl: false,
  }
  
  let pieces = {
    hull: {name: 'hull', x: 70, y: 200, h: 12, w: 37, color: 'crimson'},
    
    leftFrontWindow: {name: 'leftFrontWindow', color: 'lightBlue', h: 1},
    rightFrontWindow: {name: 'rightFrontWindow', color: 'lightBlue', h: 1},
    frontWindow: {name: 'frontWindow', color: 'lightBlue', w: 1.5},
    leftRearWindow: {name: 'leftRearWindow', color: 'lightBlue', h: 1},
    rightRearWindow: {name: 'rightRearWindow', color: 'lightBlue', h: 1},
    rearWindow: {name: 'rearWindow', color: 'lightBlue', w: 1.5},
    
    description: 'Classic from iconic fabricant Rond. Comet has powerful engine and good armours. Fast, but a bit clumsy.',
    motor: 'Rond V8',
    tires: 'Rockstone standard',
    armour: 'Defender XL',
    chassis: 'Rond Comet'
  };

  const copyOfPieces = Object.assign({}, pieces);
  const copyOfStatuses = Object.assign({}, statuses);
  //copyOfPieces.hull.y = 550
  // new car:
  let car1 = new Car(statuses.name, pieces, statuses);
  let car2 = new Car('car2', copyOfPieces, copyOfStatuses);

*/
