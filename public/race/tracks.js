
const tracks = [
  {name: 'factory', checkPoints: null, obstacles: [
    new RectObstacle(100, 150, 100, 100, 'black', 1000, 0, 'house1'), // rects need their circles for collision detect.
    new RectObstacle(340, 250, 100, 100, 'black', 1000, 0, 'house2')
  ]}

];

/*
  ctx.beginPath();
  ctx.fillStyle = 'black';
  ctx.rect(100, 150, 100, 100);
  ctx.fill();
  ctx.closePath();
  
  ctx.beginPath();
  ctx.fillStyle = 'black';
  ctx.rect(340, 250, 100, 100);
  ctx.fill();
  ctx.closePath();
  
  ctx.beginPath();
  ctx.arc(550, 175, 50, 0, 2 * Math.PI);
  ctx.stroke();
  
  RectObstacle {
  constructor(x, y, w, h, color, weight)

*/