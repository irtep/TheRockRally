// Rond Comet
  let statuses = {
    speed: 0,
    power: 0.1,
    braking: 0.01,
    maxSpeed: 6,
    turnRate: 5,
    originalFriction: 0.06,
    friction: 0.06,
    heading: 0,
    grip: 4, // max speed what it can turn without slide
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

  // new car:
  let car1 = new Car('fordFocus', pieces, statuses);