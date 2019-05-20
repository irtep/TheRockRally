
/* Globals: vehicles at public/pieces/piecesjs */

let carForShow = null;

const colors = ['white','green','darkGreen','black','navy','blue','cyan','orange','gold','yellow','red','crimson','silver','gray', 'pink'];
let gameObject = {
  playersName: null,                                                             
  car: {driver: null, name: null, color: null, chassis: null, motor: null, tires: null, armour: null, pieces: null, x: null, y: null, w: null, h: null, 
         statuses: {
           speed: 0, brakingValue: 0.2, originalFriction: 0.06, turnRate: 5, friction: 0.06, heading: 0, isMoving: false, reverse: false, outOfControl: false
         }
       },
  race: {cars: [], track: [], typeOfRace: 'default'}
}

// get value of radioButtons
function getRadioVal(form, name) {
  const selectedValue = form.elements[name].value;
  
  return selectedValue;
}

// show selected car:
function showCar() {
  const canvas = document.getElementById('kanveesi');
  const ctx = canvas.getContext("2d");
  const partsToPaint = carForShow.pieces;
  const colorF = document.getElementById('selectColor');
  const colorF2 = document.getElementById('selectColor2');
  let color1 = 'green'; // default
  let color2 = 'gold'; // default
  
  if (colorF.value !== 'Choose a color 1') { color1 = colorF.value; }
  if (colorF2.value !== 'Choose a color 2') { color2 = colorF.value; }
  // y adjust:
  carForShow.pieces.drawPoint.y =+ 10;
  
  ctx.clearRect(0,0,canvas.width,canvas.height);  // clear all 
  
  // paint hull of car
  ctx.beginPath();
  ctx.fillStyle = color1; console.log('fill style: ', color1);
  ctx.rect(partsToPaint.drawPoint.x, partsToPaint.drawPoint.y, partsToPaint.hull.w, partsToPaint.hull.h);
  ctx.fill();
  ctx.closePath();
    
  // other parts: 
  const paintIt = partsToPaint.parts.map((part) => {
    const yAdjust = 11 // to get car little bit more down.
      
    ctx.beginPath();
    ctx.fillStyle = part.color;
    ctx.rect(part.x, part.y + yAdjust, part.w, part.h);
    ctx.fill();
  }); 
}

// when color is chosen, checks all fields if not empty
function checkFields() {
  const nameF = document.getElementById('yourName');
  const carF = document.getElementById('selectCar');
  const colorF = document.getElementById('selectColor');
  const colorF2 = document.getElementById('selectColor2');
  const carInfo = document.getElementById('carInfo');
              //name,  car,   color   color2
  let fields = [false, false, false, false];
  
  if (nameF.value !== '') {
    fields[0] = true;    
    gameObject.playersName = nameF.value;
    gameObject.car.driver = nameF.value;
  } else {
    fields[0] = false;  
  }
  
  if (carF.value !== 'Choose a car') {
    
    fields[1] = true;    
    gameObject.car.name = carF.value;
    
    // create selected car for to show it
    carForShow = createNewCar(gameObject.car, true);
    //carForShow.x = 20; carForShow.y = 70;
    const carDesc = vehicles.filter((machine) => machine.name === carF.value);
    const powerValue = carForShow.statuses.power * 10;
    carInfo.innerHTML = carForShow.name + '<br><br>'+
      'accelaration: '+ powerValue.toFixed(2) + '<br>' +
      'top speed: ' + carForShow.statuses.maxSpeed + '<br>' +
      'armour: ' + carForShow.armourValue+ '<br>' +
      'hit points: ' + carForShow.hitPoints + '<br>' +
      'weight: ' + carForShow.weight + '<br>'+
      'turning: ' + carForShow.statuses.grip + '<br>' +
      'cost: ' + carForShow.cost + '<br><br>' +
      carDesc[0].description;
    showCar();
  } else {
    fields[1] = false;  
  }  
  
  if (colorF.value !== 'Choose a color 1') {
    fields[2] = true;    
    gameObject.car.color = colorF.value
  } else {
    fields[2] = false;  
  }
  if (colorF.value !== 'Choose a color 2') {
    fields[3] = true;    
    gameObject.car.color2 = colorF2.value
  } else {
    fields[3] = false;  
  }
  
  if (fields[0] && fields[1] && fields[2] && fields[3]) {
    // show start button
    document.getElementById('startButton').style.opacity = 10;   
  } else {
    // hide start button
    document.getElementById('startButton').style.opacity = 0;
  }
}

function start() {
  // add type of race
  gameObject.race.typeOfRace = getRadioVal(document.getElementById('typeOfRace'), 'raceType');
  // save gameObject
  localStorage.setItem('Go', JSON.stringify(gameObject)); 
  window.location = "https://therockrally.glitch.me/race";
}

function quickStart() {
  
  gameObject.playersName = 'TestMan';
  gameObject.car.driver = 'TestMan';
  
  gameObject.car.name = 'Rond Comet R';
  
  gameObject.car.color = 'black';
  
  gameObject.car.color2 = 'gold';
  
  // add type of race
  gameObject.race.typeOfRace = getRadioVal(document.getElementById('typeOfRace'), 'raceType');
  // save gameObject
  localStorage.setItem('Go', JSON.stringify(gameObject)); 
  window.location = "https://therockrally.glitch.me/race";
}

// Dropdown menu for cars:
vehicles.forEach( (item) => { 
   const o = document.createElement("option");
  
   o.text = item.name;
   o.value = item.name;
   document.getElementById("selectCar").appendChild(o);
});

// Dropdown menu for colors:
colors.forEach( (item) => { 
   const o = document.createElement("option");
  
   o.text = item;
   o.value = item;
   document.getElementById("selectColor").appendChild(o);
});

colors.forEach( (item) => { 
   const o = document.createElement("option");
  
   o.text = item;
   o.value = item;
   document.getElementById("selectColor2").appendChild(o);
});

