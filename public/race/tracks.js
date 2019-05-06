
const tracks = [
  {name: 'factory', checkPoints: null, obstacles: [
    new RectObstacle(100, 150, 100, 100, 'black', 1000, 0, 'house1'), // rects need their circles for collision detect.
    new RectObstacle(340, 250, 100, 100, 'black', 1000, 0, 'house2'),
    new RectObstacle(130, 400, 550, 20, 'black', 1000, 0, 'house3'),
    new RectObstacle(680, 100, 20, 300, 'black', 1000, 0, 'house4')
  ]}

];

/*
x: 130
y: 500
*/

