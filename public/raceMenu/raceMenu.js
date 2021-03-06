
/* Globals: vehicles at public/pieces/piecesjs */

let carForShow = null;

const colorsAll = ['white','green','darkGreen','black','navy','blue','cyan','orange','gold','yellow','red','crimson','silver','gray', 'pink', 'purple', 'cornsilk',
               'navajowhite', 'aqua', 'aquamarine', 'blueviolet', 'burlyWood', 'cadetBlue', 'cornFlowerBlue', 'coral', 'darkBlue',
               'darkMagenta', 'magenta', 'darkOrange', 'darkSeaGreen', 'deepPink', 'deepSkyBlue', 'fuchsia', 'greenYellow', 'hotPink', 'violet', 'yellowGreen'];
const colors = colorsAll.sort();

let gameObject = {
  playersName: null,                                                             
  car: {driver: null, name: null, color: null, chassis: null, motor: null, tires: null, armour: null, pieces: null, x: null, y: null, w: null, h: null, 
         statuses: {
           speed: 0, brakingValue: 0.2, originalFriction: 0.06, turnRate: 5, friction: 0.06, heading: 0, isMoving: false, reverse: false, outOfControl: false
         }
       },
  race: {cars: [], track: [], typeOfRace: 'default', tests: {radarBars: null}, results: [], terminated: false, started: false},
  standings: []
}

function typeChanged() {
  const raceType= getRadioVal(document.getElementById('typeOfRace'), 'raceType');
  const selectCircuitForm = document.getElementById('selectCircuitForm');
  
  switch (raceType) {
      
    case 'LapRecordHunt':
      selectCircuitForm.style.opacity = 1;
    break;
    case 'singleRace':
      selectCircuitForm.style.opacity = 1;
    break;
    case 'FullRacingSeason':
      selectCircuitForm.style.opacity = 0;
    break;
    default: console.log('racetype not found!');
  }
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
  const circuitF = document.getElementById('selectCircuit');
  const colorF = document.getElementById('selectColor');
  const colorF2 = document.getElementById('selectColor2');
  
              //name,  car,   color   color2
  let fields = [false, false, false, false];
  
  if (circuitF.value !== 'Choose a circuit') {
  
    gameObject.race.track = circuitF.value;
  }
  
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
    /* not showing selected car now, but maybe this can be used for something in later versions..
    //carForShow = createNewCar(gameObject.car, true);
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
    //showCar();
    */
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
  // lets go to race
  window.location = "https://driveorlose.glitch.me/race";
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
  window.location = "https://driveorlose.glitch.me/race";
}

// Dropdown menu for cars:
vehicles.forEach( (item) => { 
   const o = document.createElement("option");
  
   o.text = item.name;
   o.value = item.name;
   document.getElementById("selectCar").appendChild(o);
});

// Dropdown menu for circuits:
tracks.forEach( (item) => { 
   const o = document.createElement("option");
  
   o.text = item.name;
   o.value = item.name;
   document.getElementById("selectCircuit").appendChild(o);
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

//  -------- ONLOAD:  ------------
window.onload = (()=> { 
  const insideFoot = document.getElementById('insideFoot');
  const nameF = document.getElementById('yourName');
  const colorF = document.getElementById('selectColor');
  const colorF2 = document.getElementById('selectColor2');
  
  // Table to show car details:
  vehicles.forEach( (vehicle) => {
    insideFoot.innerHTML += '<td><b>' +vehicle.name +'</b><br>'+ vehicle.stats + '<br><br>' + vehicle.description +'</td>';
  }); 
  
  // fetch top drivers and lap records entries from database.
  showListFromDB(false); // lap records
  showListFromDB(true);  // top drivers
  // add them to their place.
  
  // get possible saved driver info
  const driverInfo = JSON.parse(localStorage.getItem('driverInfo'));
  
  if (driverInfo !== null) {
    
    nameF.value = driverInfo.name;
    colorF.value = driverInfo.color1;
    colorF2.value = driverInfo.color2;
  }
});

