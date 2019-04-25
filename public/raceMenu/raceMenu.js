
/* Globals: vehicles at public/pieces/piecesjs */

const colors = ['white','green','darkGreen','black','marine','blue','cyan','orange','gold','yellow','red','burgundy','crimson','silver','gray'];
let gameObject = {
  playersName: null,                                                             
  car: {driver: null, name: null, color: null, chassis: null, motor: null, tires: null, armour: null, pieces: null, 
         statuses: {
           speed: 0, brakingValue: 0.2, originalFriction: 0.06, turnRate: 5, friction: 0.06, heading: 0, isMoving: false, reverse: false, outOfControl: false
         }
       },
  race: {cars: []}
}

// when color is chosen, checks all fields if not empty
function checkFields() {
  const nameF = document.getElementById('yourName');
  const carF = document.getElementById('selectCar');
  const colorF = document.getElementById('selectColor');
  const colorF2 = document.getElementById('selectColor2');
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

function quickStart() {
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

