/*

    :<span id= "selectCars"></span><br>

      <span id= "selectChassis"></span><br>
      Motor: <br>
      <span id= "selectMotor"></span><br>
      Armour: <br>
      <span id= "selectArmour"></span><br>
      Tires: <br>
      <span id= "selectTires"></span><br>
      Color: <br>
      <span id= "selectColor"></span><br>
      
      arrays: vehicles, motors, chassis, armours, tires
*/

// temporary: make those to show what there is

function quickStart() {
  window.location = "https://therockrally.glitch.me/race";
}

for (let i = 0; i < vehicles.length; i++) {
  const selectItem = document.getElementById('selectCars');
  selectItem.innerHTML = selectItem.innerHTML + vehicles[i].name + '<br>';
}
