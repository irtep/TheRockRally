// CARS AND ACCESSORIES

// Vehicles:
const vehicles = [
  {name: 'Rond Comet mk1', chassis: 'Rond Comet', motor: 'Rond V8', tires: 'Rockstone standard', armour: 'Defender XL',
  description: 'Classic from iconic fabricant Rond. Comet has powerful engine and good armours. Fast, but a bit clumsy.',
    },
  {name: 'Rond Comet R', chassis: 'Rond Comet lite', motor: 'Rond V10', tires: 'Rockstone racing', armour: 'Defender XL',
  description: 'Racing version of Comet mk1, somewhat lighter with better engine and racing tires.',
    },
  {name: 'Zermeces E', chassis: 'Zermeces standard', motor: 'Zermeces-Lenz 2.5', tires: 'Rockstone standard', armour: 'Defender Lite',
  description: 'Quick and reliable car from traditional "leading star" Zermeces-Lenz.',
    }
];
// ideas: juggernaut, lion 205, ferrargini, high ace, MBW, Ozel Sorca

// Chassises:
const chassises = [
  {name: 'Rond Comet', weight: 10, armour: 5, durability: 8, cost: 200,
    pieces: {
      hull: {name: 'hull', x: 30, y: 500, h: 12, w: 37, color: 'crimson'},
      leftFrontWindow: {name: 'leftFrontWindow', color: 'lightBlue', h: 1},
      rightFrontWindow: {name: 'rightFrontWindow', color: 'lightBlue', h: 1},
      frontWindow: {name: 'frontWindow', color: 'lightBlue', w: 1.5},
      leftRearWindow: {name: 'leftRearWindow', color: 'lightBlue', h: 1},
      rightRearWindow: {name: 'rightRearWindow', color: 'lightBlue', h: 1},
      rearWindow: {name: 'rearWindow', color: 'lightBlue', w: 1.5}
    },
   drawPoint: {x: 1.5, y: -1.5} // {x: -(partsToPaint.hull.w/1.5), y: -(partsToPaint.hull.h/1.5)}
  },
  {name: 'Rond Comet lite', weight: 9, armour: 4, durability: 9, cost: 350,
    pieces: {
      hull: {name: 'hull', x: 30, y: 500, h: 12, w: 37, color: 'crimson'},
      leftFrontWindow: {name: 'leftFrontWindow', color: 'lightBlue', h: 1},
      rightFrontWindow: {name: 'rightFrontWindow', color: 'lightBlue', h: 1},
      frontWindow: {name: 'frontWindow', color: 'lightBlue', w: 1.5},
      leftRearWindow: {name: 'leftRearWindow', color: 'lightBlue', h: 1},
      rightRearWindow: {name: 'rightRearWindow', color: 'lightBlue', h: 1},
      rearWindow: {name: 'rearWindow', color: 'lightBlue', w: 1.5},
      speedStripe: {name: 'speedStripe', color: 'black', h: 3}
    },
   drawPoint: {x: 1.5, y: -1.5}
  },
  {name: 'Zermeces standard', weight: 5, armour: 2, durability: 9, cost: 270,
    pieces: {
      hull: {name: 'hull', x: 30, y: 500, h: 10, w: 30, color: 'silver'},
      leftFrontWindow: {name: 'leftFrontWindow', color: 'lightBlue', h: 1},
      rightFrontWindow: {name: 'rightFrontWindow', color: 'lightBlue', h: 1},
      frontWindow: {name: 'frontWindow', color: 'lightBlue', w: 1.5},
      leftRearWindow: {name: 'leftRearWindow', color: 'lightBlue', h: 1},
      rightRearWindow: {name: 'rightRearWindow', color: 'lightBlue', h: 1},
      rearWindow: {name: 'rearWindow', color: 'lightBlue', w: 1.5}
    },
   drawPoint: {x: 1.7, y: -1.5} // {x: -(partsToPaint.hull.w/1.5), y: -(partsToPaint.hull.h/1.5)}
  }
];

// Motors: 
const motors = [
  {name: 'Rond V8', power: 2.1, maxSpeed: 29, weight: 5, durability: 10, cost: 100, desc: 'Powerful and durable, but heavy motor'},
  {name: 'Rond V10', power: 2.2, maxSpeed: 34, weight: 6, durability: 8, cost: 250, desc: 'Racing version of Rond V8. Giving much more power, but not that durable as standard motor.'},
  {name: 'Beijing turbo', power: 2.2, maxSpeed: 34, weight: 7, durability: 5, cost: 100, desc: 'Racing motor with price of a normal civil motor! However, do not count on the durability.. too much'},
  {name: 'Zermeces-Lenz 2.5', power: 2.1, maxSpeed: 20, weight: 3, durability: 10, cost: 200, desc: 'Very light and reliable motor, with enough power for lighter cars.'}
];

// Tires:
const tires = [
  {name: 'Rockstone standard', grip: 26, cost: 100, desc: 'solid basic tires. you can not go wrong with these ones'},
  {name: 'Rockstone racing', grip: 33, cost: 250, desc: 'racing versions of Rockstones. Pretty good set for racing indeed.'}
];

// Armours:
const armours = [
  {name: 'Defender XL', weight: 5, value: 10, cost: 100, desc: 'big armour for big protection!'},
  {name: 'Defender Racing', weight: 3, value: 9, cost: 150, desc: 'good protection with reduced weight'},
  {name: 'Defender Lite', weight: 4, value: 6, cost: 90, desc: 'Standard solution for most civil based cars.'}
];