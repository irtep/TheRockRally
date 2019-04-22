
class Car { 
  constructor(name, pieces, statuses) {
    this.name = name;
    this.pieces = pieces; // all pieces
    this.statuses = statuses;
  }
  
  draw(){
    paintCar(this.pieces, this.statuses.heading, 1); 
  }
  
  accelerate() {
    //console.log(`${this.name} accelerates.`);
    if (this.statuses.maxSpeed > this.statuses.speed){
      
      this.statuses.speed += this.statuses.power;
    }
  }
  
  brake() {
    //this.statuses.speed -= this.statuses.braking;
    if (this.statuses.speed > 0){
      this.statuses.friction += this.statuses.braking;
    }
  }
  /*
  releaseBrake() {
    car1.statuses.braking = false;
    this.statuses.friction -= this.statuses.braking;
  }
  */
  
  reverse() {
  
  }
  turnLeft() {
    
    if (this.statuses.isMoving === true) {
      
      this.statuses.heading -= this.statuses.turnRate - (this.statuses.speed/5);
    }
  }
  // this.statuses.heading -= this.statuses.turnRate * (this.statuses.speed / this.statuses.maxSpeed);
  
  turnRight() {
    
    if (this.statuses.isMoving === true) {
      this.statuses.heading += this.statuses.turnRate - (this.statuses.speed/5);
    }
  }
}

/*
class Lion extends Cat {
  speak() {
    super.speak();
    console.log(`${this.name} roars.`);
  }
}

let l = new Lion('Fuzzy');
l.speak(); 
// Fuzzy makes a noise.
// Fuzzy roars.
*/