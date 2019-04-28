
const tracks = [
  {name: 'factory', checkPoints: null, obstacles: [
    new RectObstacle(100, 150, 100, 100, 'black', 1000), // rects need their circles for collision detect.
     new ArcObstacle(100+50, 150+50, 50, 0, 2 * Math.PI, 'gold', 1000),
     new ArcObstacle(100+19, 150+19, 20, 0, 2 * Math.PI, 'gold', 1000),
     new ArcObstacle(100+19, 150+19, 10, 0, 2 * Math.PI, 'gold', 1000),
     new ArcObstacle(100+50, 150+50, 50, 0, 2 * Math.PI, 'gold', 1000),
    
    new RectObstacle(340, 250, 100, 100, 'black', 1000),
     new ArcObstacle(340+50, 340+50, 50, 0, 2 * Math.PI, 'gold', 1000),
    
    new ArcObstacle(550, 175, 50, 0, 2 * Math.PI, 'black', 1000)
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