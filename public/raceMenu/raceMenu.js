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

      // make car selection radiobuttons:
      for (let i = 0; i < vehicles.length; i++) {
        carInfo.innerHTML = carInfo.innerHTML + '<input type= "radio" name= "car1" value="'+ vehicles[i].name +'"/>'+ vehicles[i].name +'<br>';
      }
      
      // event listener for radio buttons above:
      const selector1 = document.selectCarForm.car1;
      
      // placeholders for clicked radio buttons
      let clickedCar;
      
      for (let i = 0; i < selector1.length; i++) {
        const selectItem = document.getElementById('selectCars');
        selector1[i].addEventListener('change', () => { 
          clickedCar = selector1[i].value;
          selectItem.innerHTML = selector1[i].value +' selected. <br><br>';
        });
      }

