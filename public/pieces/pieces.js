// CARS AND ACCESSORIES

// Vehicles:
const vehicles = [
  {name: 'Rond Comet mk1', chassis: 'Rond Comet', motor: 'Rond V8', tires: 'Rockstone standard', armour: 'Defender XL',
  description: 'Classic from iconic fabricant Rond. Comet has powerful engine and good armours. Fast, but a bit clumsy.',
    }
]; 

// Chassises:
const chassis = [
  {name: 'Rond Comet', weight: 10, armour: 5, w: 37, h: 12, 
    pieces: {
      hull: {name: 'hull', x: 70, y: 200, h: 12, w: 37, color: 'crimson'},
      leftFrontWindow: {name: 'leftFrontWindow', color: 'lightBlue', h: 1},
      rightFrontWindow: {name: 'rightFrontWindow', color: 'lightBlue', h: 1},
      frontWindow: {name: 'frontWindow', color: 'lightBlue', w: 1.5},
      leftRearWindow: {name: 'leftRearWindow', color: 'lightBlue', h: 1},
      rightRearWindow: {name: 'rightRearWindow', color: 'lightBlue', h: 1},
      rearWindow: {name: 'rearWindow', color: 'lightBlue', w: 1.5}
    }
  }
];

// Motors: 
const motors = [
  {name: 'Rond V8', power: 1, weight: 5, durability: 10}
];

// Tires:
const tires = [
  {name: 'Rockstone standard', grip: 3}
];

// Armours:
const armours = [
  {name: 'Defender XL', weight: 5, value: 10}
];