// CARS AND ACCESSORIES

// Vehicles:
const vehicles = [
  {name: 'Rond Comet mk1', chassis: 'Rond Comet', motor: 'Rond V8', tires: 'Rockstone standard', armour: 'Defender XL',
  description: 'Classic from iconic fabricant Rond. Comet has powerful engine and good armours. Fast, but a bit clumsy.',
    },
  {name: 'Rond Comet R', chassis: 'Rond Comet lite', motor: 'Rond V10', tires: 'Rockstone racing', armour: 'Defender XL',
  description: 'Racing version of Comet mk1, somewhat lighter with better engine and racing tires.',
    }
]; 

// Chassises:
const chassises = [
  {name: 'Rond Comet', weight: 10, armour: 5, w: 37, h: 12, durability: 8, cost: 200,
    pieces: {
      hull: {name: 'hull', x: 70, y: 200, h: 12, w: 37, color: 'crimson'},
      leftFrontWindow: {name: 'leftFrontWindow', color: 'lightBlue', h: 1},
      rightFrontWindow: {name: 'rightFrontWindow', color: 'lightBlue', h: 1},
      frontWindow: {name: 'frontWindow', color: 'lightBlue', w: 1.5},
      leftRearWindow: {name: 'leftRearWindow', color: 'lightBlue', h: 1},
      rightRearWindow: {name: 'rightRearWindow', color: 'lightBlue', h: 1},
      rearWindow: {name: 'rearWindow', color: 'lightBlue', w: 1.5}
    }
  },
  {name: 'Rond Comet lite', weight: 9, armour: 4, w: 34, h: 10, durability: 9, cost: 350,
    pieces: {
      hull: {name: 'hull', x: 70, y: 200, h: 12, w: 37, color: 'crimson'},
      leftFrontWindow: {name: 'leftFrontWindow', color: 'lightBlue', h: 1},
      rightFrontWindow: {name: 'rightFrontWindow', color: 'lightBlue', h: 1},
      frontWindow: {name: 'frontWindow', color: 'lightBlue', w: 1.5},
      leftRearWindow: {name: 'leftRearWindow', color: 'lightBlue', h: 1},
      rightRearWindow: {name: 'rightRearWindow', color: 'lightBlue', h: 1},
      rearWindow: {name: 'rearWindow', color: 'lightBlue', w: 1.5}
    },
   drawPoint: null
  }
];

// Motors: 
const motors = [
  {name: 'Rond V8', power: 2.1, maxSpeed: 29, weight: 5, durability: 10, cost: 100, desc: 'Powerful and durable, but heavy motor'},
  {name: 'Rond V10', power: 2.2, maxSpeed: 34, weight: 6, durability: 8, cost: 250, desc: 'Racing version of Rond V8. Giving much more power, but not that durable as standard motor.'},
  {name: 'Beijing turbo', power: 2.2, maxSpeed: 34, weight: 7, durability: 5, cost: 100, desc: 'Racing motor with price of a normal civil motor! However, do not count on the durability.. too much'}
];

// Tires:
const tires = [
  {name: 'Rockstone standard', grip: 26, cost: 100, desc: 'solid basic tires. you can not go wrong with these ones'},
  {name: 'Rockstone racing', grip: 33, cost: 250, desc: 'racing versions of Rockstones. Pretty good set for racing indeed.'}
];

// Armours:
const armours = [
  {name: 'Defender XL', weight: 5, value: 10, cost: 100, desc: 'big armour for big protection!'},
  {name: 'Defender Racing', weight: 3, value: 9, cost: 150, desc: 'good protection with reduced weight'}
];