// CARS AND ACCESSORIES

// Vehicles:
const vehicles = [
  {name: 'Rond Comet mk1', chassis: 'Rond Comet', motor: 'Rond V8', tires: 'Rockstone standard', armour: 'Defender XL',
  description: 'Classic from iconic fabricant Rond. Comet has powerful engine and good armours. Fast, but heavy.',
   stats: 'Acceleration: ** <br> TopSpeed: **** <br> Grip: ** <br> Recommendation: Good for practice, hard to make records.'
    },
  {name: 'Rond Comet R', chassis: 'Rond Comet lite', motor: 'Rond V10', tires: 'Rockstone racing', armour: 'Defender XL',
  description: 'Racing version of Comet mk1, somewhat lighter with better engine and racing tires. It is a racing car, so while it is fast, it is not easy to drive!',
   stats: 'Acceleration: *** <br> TopSpeed: **** <br> Grip: **** <br> Recommendation: Good car for any use!'
    },
  {name: 'Zermeces E', chassis: 'Zermeces standard', motor: 'Zermeces-Lenz 2.5', tires: 'Rockstone standard', armour: 'Defender Lite',
  description: 'Quick racing car from "leading star" Zermeces-Lenz. Not recommended for inexperienced drivers, but in experienced hands this is fast.',
   stats: 'Acceleration: ***** <br> TopSpeed: *** <br> Grip: ***** <br> Recommendation: Quick, but so quick that it is hard to drive.'
    },
  {name: 'Lion 205', chassis: 'Lion 205S', motor: 'Lion 1.6', tires: 'Mechelen Energy', armour: 'Defender Lite',
  description: 'Basic car from traditional french manufacturer. Good for a new driver as it is very easy to drive.',
   stats: 'Acceleration: * <br> TopSpeed: * <br> Grip: ***** <br> Recommendation: Good for practice, hard to make records.'
    },
  {name: 'Juggernaut', chassis: 'Juggernaut XL', motor: 'Vodkanov HD', tires: 'Tank tracks', armour: 'Burton Military',
  description: 'Huge monster of a vehicle running on rubber tracks. Build mostly of parts of tank so if you are a friend of brutal power, this is a "car" for you.',
   stats: 'Acceleration: ** <br> TopSpeed: ** <br> Grip: *** <br> Recommendation: Good for practice, hard to make records. Survives damage quite ok'
    },
  {name: 'Ferrgini Enzolago', chassis: 'Enzolago', motor: 'Ferrgini V12', tires: 'Rockstone racing', armour: 'Defender Lite',
  description: 'Latest masterpiece from italian supercar legend. This fast car is extremely difficult to drive, so be careful, champ!.',
   stats: 'Acceleration: ***** <br> TopSpeed: ***** <br> Grip: ***** <br> Recommendation: Super fast, but very hard to drive.'
    }
];
// ideas: high ace, MBW, Ozel Sorca

// Chassises:
const chassises = [
  {name: 'Rond Comet', weight: 10, armour: 5, durability: 8, cost: 200,
    pieces: {
      hull: {name: 'hull', x: 10, y: 450, h: 12, w: 37, color: 'crimson'},
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
      hull: {name: 'hull', x: 10, y: 450, h: 12, w: 37, color: 'crimson'},
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
  {name: 'Zermeces standard', weight: 5, armour: 1, durability: 9, cost: 270,
    pieces: {
      hull: {name: 'hull', x: 10, y: 450, h: 10, w: 30, color: 'white'},
      leftFrontWindow: {name: 'leftFrontWindow', color: 'lightBlue', h: 1},
      rightFrontWindow: {name: 'rightFrontWindow', color: 'lightBlue', h: 1},
      frontWindow: {name: 'frontWindow', color: 'lightBlue', w: 1.5},
      leftRearWindow: {name: 'leftRearWindow', color: 'lightBlue', h: 1},
      rightRearWindow: {name: 'rightRearWindow', color: 'lightBlue', h: 1},
      rearWindow: {name: 'rearWindow', color: 'lightBlue', w: 1.5}
    },
   drawPoint: {x: 1.7, y: -1.5} // {x: -(partsToPaint.hull.w/1.5), y: -(partsToPaint.hull.h/1.5)}
  },
  {name: 'Enzolago', weight: 5, armour: 1, durability: 9, cost: 270,
    pieces: {
      hull: {name: 'hull', x: 10, y: 450, h: 13, w: 30, color: 'red'},
      leftFrontWindow: {name: 'leftFrontWindow', color: 'lightBlue', h: 1},
      rightFrontWindow: {name: 'rightFrontWindow', color: 'lightBlue', h: 1},
      frontWindow: {name: 'frontWindow', color: 'lightBlue', w: 2.5},
      leftRearWindow: {name: 'leftRearWindow', color: 'lightBlue', h: 0.2},
      rightRearWindow: {name: 'rightRearWindow', color: 'lightBlue', h: 0.2},
      rearWindow: {name: 'rearWindow', color: 'lightBlue', w: 0.5}
    },
   drawPoint: {x: 1.7, y: -1.5} // {x: -(partsToPaint.hull.w/1.5), y: -(partsToPaint.hull.h/1.5)}
  },
  {name: 'Lion 205S', weight: 2, armour: 1, durability: 7, cost: 50,
    pieces: {
      hull: {name: 'hull', x: 10, y: 450, h: 10, w: 25, color: 'black'},
      leftFrontWindow: {name: 'leftFrontWindow', color: 'lightBlue', h: 1},
      rightFrontWindow: {name: 'rightFrontWindow', color: 'lightBlue', h: 1},
      frontWindow: {name: 'frontWindow', color: 'lightBlue', w: 1.5},
      leftRearWindow: {name: 'leftRearWindow', color: 'lightBlue', h: 1},
      rightRearWindow: {name: 'rightRearWindow', color: 'lightBlue', h: 1},
      rearWindow: {name: 'rearWindow', color: 'lightBlue', w: 1.5}
    },
   drawPoint: {x: 1.7, y: -1.5} // {x: -(partsToPaint.hull.w/1.5), y: -(partsToPaint.hull.h/1.5)}
  },
  {name: 'Juggernaut XL', weight: 16, armour: 10, durability: 14, cost: 70,
    pieces: {
      hull: {name: 'hull', x: 10, y: 450, h: 16, w: 45, color: 'darkGreen'},
      frontWindow: {name: 'frontWindow', color: 'lightBlue', w: 1.5}
    },
   drawPoint: {x: 1.7, y: -1.5} // {x: -(partsToPaint.hull.w/1.5), y: -(partsToPaint.hull.h/1.5)}
  }
];

// Motors: 
const motors = [
  {name: 'Rond V8', power: 2.1, maxSpeed: 29, weight: 5, durability: 10, cost: 100, desc: 'Powerful and durable, but heavy motor'},
  {name: 'Rond V10', power: 2.2, maxSpeed: 36, weight: 6, durability: 8, cost: 250, desc: 'Racing version of Rond V8. Giving much more power, but not that durable as standard motor.'},
  {name: 'Beijing turbo', power: 2.2, maxSpeed: 34, weight: 7, durability: 5, cost: 100, desc: 'Racing motor with price of a normal civil motor! However, do not count on the durability.. too much'},
  {name: 'Zermeces-Lenz 2.5', power: 1.8, maxSpeed: 20, weight: 3, durability: 10, cost: 200, desc: 'Very light and reliable motor, with enough power for lighter cars.'},
  {name: 'Lion 1.6', power: 0.89, maxSpeed: 12, weight: 2, durability: 6, cost: 50, desc: 'Cheap, but not powerful or reliable.'},
  {name: 'Vodkanov HD', power: 4.3, maxSpeed: 47, weight: 10, durability: 8, cost: 90, desc: 'This is motor designed for tanks. Lots of power. Heavy solution for heavy vehicle.'},
  {name: 'Ferrgini V12', power: 2, maxSpeed: 25, weight: 5, durability: 10, cost: 300, desc: 'Powerful Ferrgini race motor.'},
];

// Tires:
const tires = [
  {name: 'Rockstone standard', grip: 26, cost: 100, weight: 0, desc: 'solid basic tires. you can not go wrong with these ones'},
  {name: 'Rockstone racing', grip: 33, cost: 250, weight: 0, desc: 'racing versions of Rockstones. Pretty good set for racing indeed.'},
  {name: 'Mechelen Energy', grip: 27, cost: 120, weight: 0, desc: 'very good basic tires.'},
  {name: 'Xinghao X', grip: 20, cost: 50, weight: 1, desc: 'Cheap tire solution for low top speeds.'},
  {name: 'Tank tracks', grip: 47, cost: 120, weight: 7, desc: 'Rubber tank tracks. Great grip but weight quite much.'}
];

// Armours:
const armours = [
  {name: 'Defender XL', weight: 5, value: 10, cost: 100, desc: 'big armour for big protection!'},
  {name: 'Defender Racing', weight: 3, value: 9, cost: 150, desc: 'good protection with reduced weight'},
  {name: 'Defender Lite', weight: 4, value: 6, cost: 90, desc: 'Standard solution for most civil based cars.'},
  {name: 'Burton Military', weight: 9, value: 20, cost: 100, desc: 'Tank class armour. Heavy and reliable.'}
];