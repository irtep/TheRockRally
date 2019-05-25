// this is for all rect shaped things in game.. so for about almost for everything.
// they get from here some stuff that they can be located, regardless of their angle
class AllRects {
  
  // this is needed to check "real position" to get collision detect.
  // calculates and sets corners of rotated angles.
  // this was used as reference: https://stackoverflow.com/questions/41489627/collision-between-two-elements-with-rotating/41513341#41513341
  setCorners(angle) {
    
    function getRotatedTopLeftCornerOfRect(x, y, width, height, angle) {
      //console.log('gRtLCOR ', x, y, width, height, angle);
  
      function sin(x) {
        return Math.sin(x / 180 * Math.PI);
      }

      function cos(x) { 
        return Math.cos(x / 180 * Math.PI);
      }
      
      var center = {
        x: (x + width / 2),
        y: (y + height / 2)
      };
      
      //console.log('center: ',center);
      var vector = {
        x: (x - center.x),
        y: (y - center.y)
      };

      //console.log('vector: ',vector);
      var rotationMatrix = [[cos(angle), -sin(angle)],[sin(angle), cos(angle)]];

      var rotatedVector = {
        x: vector.x * rotationMatrix[0][0] + vector.y * rotationMatrix[0][1],
        y: vector.x * rotationMatrix[1][0] + vector.y * rotationMatrix[1][1]
      };

      return {
        x: (center.x + rotatedVector.x),
        y: (center.y + rotatedVector.y)
      };
    }

    function getAngleForNextCorner(anc,vectorLength) {
      var alpha = Math.acos(anc/vectorLength)*(180 / Math.PI);
      return 180 - alpha*2;
    }

    function getVectorLength(x, y, width, height){
     var center = {
       x: x + width / 2,
       y: y + height / 2
     };
    
    //console.log('center: ',center);
     var vector = {
       x: (x - center.x),
      y: (y - center.y)
     };
       return Math.sqrt(vector.x*vector.x+vector.y*vector.y);
    }  
    /* this might be handy for non-canvas stuff in some other work so i dont delete it
    function getOffset(el) { console.log('el ', el);
      var _x = 0;
      var _y = 0;
      while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
      }
      return {
        top: _y,
        left: _x
      };
    } */

    //console.log('gOs', getOffset(this.htmlElement)); console.log('this ', this);
    
    this.leftTopCorner = getRotatedTopLeftCornerOfRect(this.x, this.y, this.w, this.h, angle);

    var vecLength = getVectorLength(this.x, this.y, this.w, this.h);
    //console.log('vecLength: ',vecLength);

    angle = angle+getAngleForNextCorner(this.w/2, vecLength);
    //console.log('angle: ',angle);
    this.rightTopCorner = getRotatedTopLeftCornerOfRect(this.x, this.y, this.w, this.h, angle);

    angle = angle+getAngleForNextCorner(this.h/2, vecLength);
    //console.log('angle: ',angle);
    this.rightBottomCorner = getRotatedTopLeftCornerOfRect(this.x, this.y, this.w, this.h, angle);

    angle = angle+getAngleForNextCorner(this.w/2, vecLength);
    //console.log('angle: ',angle);
    this.leftBottomCorner = getRotatedTopLeftCornerOfRect(this.x, this.y, this.w, this.h, angle);
    
    //console.log('created rect ', this);
  };
  
  // return calculated corners:
  getCorners() {
    
    return [this.leftTopCorner,
      this.rightTopCorner,
      this.rightBottomCorner,
      this.leftBottomCorner];
  };
}

class TestBar extends AllRects {
  constructor(x, y, w, h, color, heading, name, direction) {
    super(); // to get setCorners from allRects
    this.x = x;
    this.y = y;
    this.w = w,
    this.h = h;
    this.color = color;
    this.weight = 50; // default weight
    this.heading = heading;
    this.name = name;
    this.type = 'testBar';
    this.hitPoints = 1000;
    this.maxHitPoints = 1000;
    this.direction = direction;
  } 
}

class RectObstacle extends AllRects {
  constructor(x, y, w, h, color, angle, name) {
    super(); // to get setCorners from allRects
    this.x = x;
    this.y = y;
    this.w = w,
    this.h = h;
    this.color = color;
    this.weight = 50; // default weight
    this.angle = angle;
    this.name = name;
    this.type = 'building';
    this.hitPoints = 1000;
    this.maxHitPoints = 1000;
  }
}

class ArcObstacle {
  constructor(x, y, a, aS, aE, color) {
    this.x = x;
    this.y = y;
    this.a = a,
    this.color = color;
    this.weight = 50;
    this.aS = aS; //angleStarts
    this.aE = aE; // angleEnds
    this.name = 'arcO';
    this.hitPoints = 1000;
    this.maxHitPoints = 1000;
  }
}

class Car extends AllRects { 
  constructor(driver, rootStats, pieces, statuses) {
    super();
    this.driver = driver;
    this.name = rootStats.name;
    this.cost = rootStats.cost;
    this.weight = rootStats.weight;
    this.armourValue = rootStats.armourValue;
    this.hitPoints = rootStats.hitPoints;
    this.maxHitPoints = rootStats.maxHitPoints;
    this.pieces = pieces; // all pieces
    this.statuses = statuses;
  }
  
  /*  not used as all cars will be drawn same time with new draw function
  draw(){
    paintCar(this.pieces, this.statuses.heading, 1); 
  }
  */
  accelerate() {
    //console.log(`${this.name} accelerates.`);
    if (this.statuses.maxSpeed > this.statuses.speed && this.hitPoints > 0){
      
      this.statuses.speed += this.statuses.power;
    }
  }
  
  brake() {
    
    this.statuses.friction = this.statuses.brakingValue;
  }
  
  reverse() {
  
  }
  turnLeft() {
    
    if (this.statuses.isMoving === true) {
      
      if (this.statuses.speed < this.statuses.grip) {
        this.statuses.heading -= this.statuses.turnRate - (this.statuses.speed/7);
      } else {
        this.statuses.heading -= this.statuses.turnRate - (this.statuses.speed/7) + (this.statuses.grip/2);
      }
    }
  }
  
  turnRight() {
    if (this.statuses.isMoving === true) {
      
      if (this.statuses.speed < this.statuses.grip) {
        this.statuses.heading += this.statuses.turnRate - (this.statuses.speed/7);
      } else {
        this.statuses.heading += this.statuses.turnRate - (this.statuses.speed/7) + (this.statuses.grip/2);
      }
    }
  }
}
/*
class RectBuilding {
  constructor(x, y, w, h, weight){
  
    this.x = x; this.y = y; this.w = w; this.h = h; this.weight = weight;
    // give default armour:
    this.armour = 1000;
  };

}

class CircleBuilding {
  constructor(x, y, arc, weight){
  
  };

}
*/
class CheckPoint extends AllRects {
  constructor(x, y, w, h, number){
    super();
    this.x = x; this.y = y; this.w = w; this.h = h; this.number = number;
    this.angle = 0; this.name = 'cp';
  };
}

class Arrow {
  constructor(fromX, fromY, toX, toY, r) {
  
    this.fromX = fromX;
    this.fromY = fromY;
    this.toX = toX;
    this.toY = toY;
    this.r = r;
  }
}