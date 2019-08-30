// reference to canvas
const canv = document.getElementById("kanveesi");

const tracks = [
  {name: 'Finse Factory', checkPoints: null, obstacles: [
    // borders: RectObstacles: x, y, w, h, color, angle, name
    new RectObstacle(0, -55, canv.width, 60, 'black', 0, 'borderUp'),
    new RectObstacle(0, canv.height -5, canv.width, 30, 'black', 0, 'borderBottom'),
    new RectObstacle(-25, 0, 30, canv.height, 'black', 0, 'borderLeft'),
    new RectObstacle(canv.width-5, 0, 30, canv.height, 'black', 0, 'borderRight'),
    // buildings:
    new RectObstacle(100, 150, 100, 100, 'black', 0, 'house1'), 
    new RectObstacle(340, 250, 100, 100, 'black', 0, 'house2'),
    new RectObstacle(130, 400, 550, 20, 'black', 0, 'house3'),
    new RectObstacle(680, 100, 20, 300, 'black', 0, 'house4')/*,
    new RectObstacle(880, 0, 20, 600, 'black', 0, 'house5')*/
  ],
  trackMarkings: [
    // finish line:
    new RectObstacle(630, 420, 10, 180, 'white', 0, 'finishLine'),
    // indicator arrows: 
    /*
    new RectObstacle(235, 505, 50, 5, 'white', 0, 'arrowShaft'),
    new RectObstacle(275, 490, 22, 5, 'white', 45, 'arrowPoint1'),
    new RectObstacle(275, 520, 22, 5, 'white', -45, 'arrowPoint2') */
  ],
  arrows: [ // arrows: fromX, fromY, toX, toY, r
    new Arrow(235, 515, 295, 515, 10),
    new Arrow(300, 515, 395, 515, 10), 
    new Arrow(223, 240, 300, 240, 10),
    new Arrow(240, 200, 340, 210, 10)
  ],
  checkPoints: [ // x, y, w, h, order number
    new CheckPoint(640, 400, 190, 160, 1),
    new CheckPoint(700, 35, 180, 60, 2),
    new CheckPoint(10, 430, 180, 60, 3)
  ], 
  aiCheckPoints: [ // x, y, w, h, order number
    new CheckPoint(660, 430, 150, 160, 1),
    new CheckPoint(720, 320, 100, 100, 2),
    new CheckPoint(750, 80, 100, 60, 3),
    new CheckPoint(680, 25, 100, 60, 4),
    new CheckPoint(440, 35, 80, 60, 5),
    new CheckPoint(240, 220, 100, 60, 6),
    new CheckPoint(45, 350, 60, 60, 7),
    new CheckPoint(40, 435, 100, 60, 8),
    new CheckPoint(320, 470, 100, 60, 9),
  ],
  dangerZones: [
  ],
  dangerClear: [
  ]
  },
  {name: 'City Centre', checkPoints: null, obstacles: [
    // borders: RectObstacles: x, y, w, h, color, angle, name
    new RectObstacle(0, -55, canv.width, 60, 'black', 0, 'borderUp'),
    new RectObstacle(0, canv.height -5, canv.width, 30, 'black', 0, 'borderBottom'),
    new RectObstacle(-25, 0, 30, canv.height, 'black', 0, 'borderLeft'),
    new RectObstacle(canv.width-5, 0, 30, canv.height, 'black', 0, 'borderRight'),
    // buildings:
    new RectObstacle(10, 200, 450, 100, 'black', 0, 'house1'), 
    new RectObstacle(130, 400, 550, 20, 'black', 0, 'house3'),
    new RectObstacle(130, 100, 570, 20, 'black', 0, 'house4'),
    new RectObstacle(680, 100, 20, 300, 'black', 0, 'house5')/*,
    new RectObstacle(880, 0, 20, 600, 'black', 0, 'house5')*/
  ],
  trackMarkings: [
    // finish line:
    new RectObstacle(630, 420, 10, 180, 'white', 0, 'finishLine'),
    // indicator arrows: 
    /*
    new RectObstacle(235, 505, 50, 5, 'white', 0, 'arrowShaft'),
    new RectObstacle(275, 490, 22, 5, 'white', 45, 'arrowPoint1'),
    new RectObstacle(275, 520, 22, 5, 'white', -45, 'arrowPoint2') */
  ],
  arrows: [ // arrows: fromX, fromY, toX, toY, r
    new Arrow(235, 515, 295, 515, 10),
    new Arrow(300, 515, 395, 515, 10), 
    new Arrow(223, 240, 300, 240, 10),
    new Arrow(240, 200, 340, 210, 10)
  ],
  checkPoints: [ // x, y, w, h, order number
    new CheckPoint(640, 430, 180, 160, 1),
    new CheckPoint(700, 35, 180, 60, 2),
    new CheckPoint(465, 180, 210, 60, 3),
    new CheckPoint(10, 430, 180, 60, 4)
  ], 
  aiCheckPoints: [ // x, y, w, h, order number
    new CheckPoint(660, 430, 150, 160, 1),
    new CheckPoint(720, 320, 100, 100, 2),
    new CheckPoint(750, 80, 100, 60, 3),
    new CheckPoint(680, 25, 100, 60, 4),
    new CheckPoint(125, 5, 80, 50, 5),
    new CheckPoint(10, 80, 100, 60, 6),
    new CheckPoint(135, 149, 70, 60, 7),
    new CheckPoint(455, 140, 100, 60, 8),
    new CheckPoint(500, 220, 100, 60, 9),
    new CheckPoint(455, 320, 100, 60, 10),
    new CheckPoint(65, 340, 60, 60, 11),
    new CheckPoint(40, 435, 100, 60, 12),
    new CheckPoint(320, 470, 100, 60, 13),
  ],
  dangerZones: [ // x, y, w, h, order number
    new CheckPoint(355, 6, 80, 80, 14),
    new CheckPoint(355, 145, 100, 60, 15),
    new CheckPoint(690, 125, 150, 60, 18)
  ],
  dangerClear: [ // x, y, w, h, order number
    new CheckPoint(235, 129, 70, 90, 16),
    new CheckPoint(125, 450, 100, 120, 17),
    new CheckPoint(650, 15, 100, 90, 19)
  ]
  },
  {name: 'Las Curvas', checkPoints: null, obstacles: [
    // borders: RectObstacles: x, y, w, h, color, angle, name
    new RectObstacle(0, -55, canv.width, 60, 'black', 0, 'borderUp'),
    new RectObstacle(0, canv.height -5, canv.width, 30, 'black', 0, 'borderBottom'),
    new RectObstacle(-25, 0, 30, canv.height, 'black', 0, 'borderLeft'),
    new RectObstacle(canv.width-5, 0, 30, canv.height, 'black', 0, 'borderRight'),
    // buildings:
    new RectObstacle(460, 200, 450, 100, 'black', 0, 'house1'), 
    new RectObstacle(130, 400, 550, 20, 'black', 0, 'house3'),
    new RectObstacle(130, 100, 570, 20, 'black', 0, 'house4'),
    new RectObstacle(300, 100, 20, 300, 'black', 0, 'house5'),
    new RectObstacle(10, 200, 150, 100, 'black', 0, 'house1')/*,
    new RectObstacle(880, 0, 20, 600, 'black', 0, 'house5')*/
  ],
  trackMarkings: [
    // finish line:
    new RectObstacle(630, 420, 10, 180, 'white', 0, 'finishLine'),
    // indicator arrows: 
    /*
    new RectObstacle(235, 505, 50, 5, 'white', 0, 'arrowShaft'),
    new RectObstacle(275, 490, 22, 5, 'white', 45, 'arrowPoint1'),
    new RectObstacle(275, 520, 22, 5, 'white', -45, 'arrowPoint2') */
  ],
  arrows: [ 
  ],
  checkPoints: [ // x, y, w, h, order number
    new CheckPoint(640, 430, 180, 160, 1),
    new CheckPoint(700, 35, 180, 60, 2),
    new CheckPoint(160, 180, 150, 60, 3),
    new CheckPoint(10, 430, 180, 60, 4)
  ], 
  aiCheckPoints: [ // x, y, w, h, order number
    new CheckPoint(660, 430, 150, 160, 1),
    new CheckPoint(720, 320, 100, 80, 2),
    new CheckPoint(350, 320, 100, 60, 3),
    new CheckPoint(355, 130, 100, 60, 4),
    new CheckPoint(710, 125, 80, 50, 5),
    new CheckPoint(700, 30, 100, 60, 6),
    new CheckPoint(55, 35, 70, 60, 7),
    new CheckPoint(35, 130, 70, 60, 8),
    new CheckPoint(160, 130, 70, 60, 9),
    new CheckPoint(205, 290, 100, 60, 10),
    new CheckPoint(65, 340, 60, 60, 11),
    new CheckPoint(20, 435, 100, 60, 12),
    new CheckPoint(320, 470, 100, 60, 13),
  ],
  dangerZones: [ // x, y, w, h, order number
    new CheckPoint(445, 430, 151, 162, 14),
    new CheckPoint(255, 30, 100, 80, 15)
  ],
  dangerClear: [ // x, y, w, h, order number
    new CheckPoint(519, 30, 101, 90, 16),
    new CheckPoint(125, 450, 100, 120, 17)
  ]
  },
  {name: 'Alleys', checkPoints: null, obstacles: [
    // borders: RectObstacles: x, y, w, h, color, angle, name
    new RectObstacle(0, -55, canv.width, 60, 'black', 0, 'borderUp'),
    new RectObstacle(0, canv.height -5, canv.width, 30, 'black', 0, 'borderBottom'),
    new RectObstacle(-25, 0, 30, canv.height, 'black', 0, 'borderLeft'),
    new RectObstacle(canv.width-5, 0, 30, canv.height, 'black', 0, 'borderRight'),
    // buildings:
    new RectObstacle(100, 150, 300, 100, 'black', 0, 'house1'), 
    new RectObstacle(240, 250, 400, 150, 'black', 0, 'house2'),
    new RectObstacle(720, 80, 200, 200, 'black', 0, 'house4')/*,
    new RectObstacle(880, 0, 20, 600, 'black', 0, 'house5')*/
  ],
  trackMarkings: [
    // finish line:
    new RectObstacle(630, 420, 10, 180, 'white', 0, 'finishLine'),
    // indicator arrows: 
    /*
    new RectObstacle(235, 505, 50, 5, 'white', 0, 'arrowShaft'),
    new RectObstacle(275, 490, 22, 5, 'white', 45, 'arrowPoint1'),
    new RectObstacle(275, 520, 22, 5, 'white', -45, 'arrowPoint2') */
  ],
  arrows: [ // arrows: fromX, fromY, toX, toY, r
    new Arrow(235, 515, 295, 515, 10),
    new Arrow(300, 515, 395, 515, 10), 
    new Arrow(223, 240, 300, 240, 10),
    new Arrow(240, 200, 340, 210, 10)
  ],
  checkPoints: [ // x, y, w, h, order number
    new CheckPoint(650, 350, 300, 160, 1),
    new CheckPoint(550, 205, 180, 60, 2),
    new CheckPoint(10, 350, 380, 60, 3)
  ], 
  aiCheckPoints: [ // x, y, w, h, order number
    new CheckPoint(660, 430, 150, 160, 1),
    new CheckPoint(630, 110, 100, 100, 2),
    new CheckPoint(220, 30, 100, 60, 3),
    new CheckPoint(10, 85, 70, 60, 4),
    new CheckPoint(15, 250, 80, 60, 5),
    new CheckPoint(240, 520, 100, 60, 6)
  ],
  dangerZones: [ // x, y, w, h, order number
    new CheckPoint(455, 430, 151, 162, 14),
    new CheckPoint(255, 30, 100, 80, 15)
  ],
  dangerClear: [ // x, y, w, h, order number
    new CheckPoint(459, 30, 151, 190, 16),
    new CheckPoint(135, 350, 150, 150, 17)
  ]
  }
];



