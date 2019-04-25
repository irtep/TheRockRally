
class Car { 
  constructor(rootStats, pieces, statuses) {
    this.name = rootStats.name;
    this.cost = rootStats.cost;
    this.weight = rootStats.weight;
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
    if (this.statuses.maxSpeed > this.statuses.speed){
      
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
    
      if (this.statuses.speed < this.statuses.grip) {
        this.statuses.heading += this.statuses.turnRate - (this.statuses.speed/7);
      } else {
        this.statuses.heading += this.statuses.turnRate - (this.statuses.speed/7) + (this.statuses.grip/2);
      }
  }
}

class RectBuilding {
  constructor(x, y, w, h, weight){
  
    this.x = x; this.y = y; this.w = w; this.h = h; this.weight = weight;
  };

}

class CircleBuilding {
  constructor(x, y, arc, weight){
  
  };

}

class CheckPoint {
  constructor(x, y, w, h, number){
  
    this.x = x; this.y = y; this.w = w; this.h = h; this.number = number;
  };
}