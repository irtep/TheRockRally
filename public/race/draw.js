// this can be used when you need grid to canvas
// from http://usefulangle.com/post/19/html5-canvas-tutorial-how-to-draw-graphical-coordinate-system-with-grids-and-axis
// can be used in testing to check distances etc.
// disabled when game is online.
function drawGrid(){
    const grid_size = 10;
    const x_axis_distance_grid_lines = 5;
    const y_axis_distance_grid_lines = 5;
    const x_axis_starting_point = { number: 1, suffix: '\u03a0' };
    const y_axis_starting_point = { number: 1, suffix: '' };

    const canvas = document.getElementById("kanveesi");
    const ctx = canvas.getContext("2d");

    // canvas width
    const canvas_width = canvas.width;

    // canvas height
    const canvas_height = canvas.height;

    // no of vertical grid lines
    const num_lines_x = Math.floor(canvas_height/grid_size);

    // no of horizontal grid lines
    const num_lines_y = Math.floor(canvas_width/grid_size);
  
  // Draw grid lines along X-axis
    for(let i = 0; i <= num_lines_x; i++) {
        ctx.beginPath();
        ctx.lineWidth = 1;

        // If line represents X-axis draw in different color
        if(i == x_axis_distance_grid_lines) 
            ctx.strokeStyle = "#000000";
        else
            ctx.strokeStyle = "#e9e9e9";

        if(i == num_lines_x) {
            ctx.moveTo(0, grid_size*i);
            ctx.lineTo(canvas_width, grid_size*i);
        }
        else {
            ctx.moveTo(0, grid_size*i+0.5);
            ctx.lineTo(canvas_width, grid_size*i+0.5);
        }
        ctx.stroke();
    }
    // Draw grid lines along Y-axis
    for (let i = 0; i <= num_lines_y; i++) {
        ctx.beginPath();
        ctx.lineWidth = 1;

        // If line represents Y-axis draw in different color
        if(i == y_axis_distance_grid_lines) 
            ctx.strokeStyle = "#000000";
        else
            ctx.strokeStyle = "#e9e9e9";

        if(i == num_lines_y) {
            ctx.moveTo(grid_size*i, 0);
            ctx.lineTo(grid_size*i, canvas_height);
        }
        else {
            ctx.moveTo(grid_size*i+0.5, 0);
            ctx.lineTo(grid_size*i+0.5, canvas_height);
        }
        ctx.stroke();
    }  
}

function clearCanvas(){
  const canvas = document.getElementById('kanveesi');
  const ctx = canvas.getContext("2d");
  
  ctx.clearRect(0,0,canvas.width,canvas.height);  // clear all 
}

// Draw function:
function paintAll(race) {
  const canvas = document.getElementById('kanveesi');
  const ctx = canvas.getContext("2d");
   
  clearCanvas();
  
  //drawGrid used only if need to test something and grid helps
  //drawGrid();
  
  // markings like finish line etc.
  const paintMarkings = race.track[0].trackMarkings.map( (mark) => {
    ctx.beginPath();
    ctx.fillStyle = mark.color;
    ctx.save(); // save coords system
    ctx.translate(mark.x, mark.y);
    ctx.rotate(mark.angle * Math.PI / 180);
    ctx.rect(0, 0, mark.w, mark.h);
    ctx.fill();
    ctx.closePath();
    ctx.restore(); // restore coords.
  });
  
  // indicator arrows to track
  const paintArrows = race.track[0].arrows.map( (arrow) => {
    const x_center = arrow.toX;
    const y_center = arrow.toY;
    let angle = Math.atan2(arrow.toY-arrow.fromY,arrow.toX-arrow.fromX);
    let x = arrow.r*Math.cos(angle) + x_center;
    let y = arrow.r*Math.sin(angle) + y_center;
    
    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.moveTo(x, y);
    angle += (1/3)*(2*Math.PI);
    x = arrow.r*Math.cos(angle) + x_center;
    y = arrow.r*Math.sin(angle) + y_center;
    ctx.lineTo(x, y);
    angle += (1/3)*(2*Math.PI)
    x = arrow.r*Math.cos(angle) + x_center;
    y = arrow.r*Math.sin(angle) + y_center;
    ctx.lineTo(x, y);
    ctx.closePath();
    ctx.fill();    
  });
  
  // paints each car
  race.cars.forEach((unit) => {
    const partsToPaint = unit.pieces;
    const drawPoint = partsToPaint.drawPoint;
    const degrees = unit.statuses.heading;
     
    // paint hull of car
    ctx.beginPath();
    ctx.fillStyle = partsToPaint.hull.color;
    ctx.save(); // save coords system
    if (unit.leftTopCorner !== undefined) {
      ctx.translate(unit.leftTopCorner.x, unit.leftTopCorner.y);}
    else {
      //ctx.translate(partsToPaint.hull.x, partsToPaint.hull.y);} // go here
      ctx.translate(unit.x, unit.y);} // go here
    ctx.rotate(degrees * Math.PI / 180);
    ctx.rect(drawPoint.x, drawPoint.y, partsToPaint.hull.w, partsToPaint.hull.h);// time to paint it
    ctx.fill();
    ctx.closePath();
    
    // other parts: 
    const paintIt = partsToPaint.parts.map((part) => {
      
      ctx.beginPath();
      ctx.fillStyle = part.color;
      ctx.rect(part.x, part.y, part.w, part.h);
      ctx.fill();
    }); 
      // write drivers name or disabled if no hps
    if (unit.hitPoints > 0) {
      
      ctx.beginPath();
      ctx.fillStyle = 'black';
      ctx.fillText (unit.driver, drawPoint.x, drawPoint.y);
      //ctx.fillText (unit.nextCheckPoint, drawPoint.x, drawPoint.y);
      ctx.fill;
    } else {
    
      ctx.beginPath();
      ctx.fillStyle = 'red';
      ctx.fillText ('DISABLED!', drawPoint.x, drawPoint.y);
      ctx.fill;      
    }
    
    ctx.restore(); // restore coords.
        
    // test radarbars:
    if (gameObject.race.tests.radarBars !== null) {
      gameObject.race.tests.radarBars.forEach( (bar) => {
        ctx.beginPath();
        ctx.strokeStyle = bar.color;
        ctx.save(); // save coords system
        if (bar.leftTopCorner !== undefined) {
          ctx.translate(bar.leftTopCorner.x, bar.leftTopCorner.y);}
          else {
          //ctx.translate(partsToPaint.hull.x, partsToPaint.hull.y);} // go here
          ctx.translate(bar.x, bar.y);
          } // go here
        ctx.rotate(bar.heading * Math.PI / 180);
        ctx.rect(0, 0, bar.w, bar.h);// time to paint it
        ctx.stroke();
        ctx.closePath(); 
        
        ctx.restore(); // restore coords.
      });
    }
    // lines from corners to canvas corners:
    // this is used to see where corners of car are in collision test purpose
    // disabled if game is online.
    /*
    if (unit.leftBottomCorner !== undefined) {
      const specialArray = [unit.leftBottomCorner, unit.leftTopCorner, unit.rightBottomCorner, unit.rightTopCorner];
      const specialArray2 = [{x: 0, y: canvas.height},{x: 0, y: 0},{x: canvas.width, y: canvas.height},{x: canvas.width, y: 0}];
      let indicator = 0;
      const drawLines = specialArray.map( (lines) => {


        ctx.beginPath();
        ctx.strokeStyle = 'red';
        ctx.moveTo(lines.x, lines.y);
        ctx.lineTo(specialArray2[indicator].x, specialArray2[indicator].y);
        ctx.stroke();

        indicator++;
      }); 
    } */
    
  });

  // some other stuff to track:
  const paintTrack = race.track[0].obstacles.map( (obsta) => {
    
    if (obsta.name === 'arcO') {
      ctx.beginPath();
      ctx.strokeStyle = obsta.color;
      ctx.arc(obsta.x, obsta.y, obsta.a, obsta.aS, obsta.aE);
      ctx.stroke();   
    }
    
    if (obsta.type === 'building'){
      ctx.beginPath();
      ctx.fillStyle = obsta.color;
      ctx.rect(obsta.x, obsta.y, obsta.w, obsta.h);
      ctx.fill();
      ctx.closePath();
    }
  });
  // paint checkpoints. only on design/test purpose will be visibles
  
  const paintCps = race.track[0].checkPoints.map( (cP) => {
       
    ctx.beginPath();
    ctx.strokeStyle = 'gold';
    ctx.strokeRect(cP.x, cP.y, cP.w, cP.h);
    ctx.stroke();
    ctx.closePath();
    
    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.fillText (cP.number, cP.x + cP.w/2, cP.y + cP.h/2);
    ctx.fill; 
    ctx.closePath();
     
  });  
  
}