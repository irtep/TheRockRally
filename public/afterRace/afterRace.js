let gameObject = null;

function goToStart() {
  
  window.location = "https://driveorlose.glitch.me/";
}

function nextRace() {  
  
  // resets some stuff from cars:
  gameObject.car.statuses.speed = 0;
  gameObject.car.statuses.heading = 0;
  gameObject.car.statuses.accelerate = false;
  gameObject.car.statuses.reverse = false;
  gameObject.car.statuses.turnRight = false;
  gameObject.car.statuses.turnLeft = false;
  // reset standings place:
  gameObject.standings = [];
  
  gameObject.race.cars.forEach( (theCar) => {
    const pointsEntry = {driver: theCar.driver, points: theCar.points}
    
    theCar.statuses.speed = 0;
    theCar.statuses.heading = 0;
    theCar.statuses.accelerate = false;
    theCar.statuses.reverse = false;
    theCar.statuses.turnRight = false;
    theCar.statuses.turnLeft = false;
    
    gameObject.standings.push(pointsEntry);
  });
  
  // reset stuff from previous race
  gameObject.race.cars = [];
  gameObject.race.lastLaps = [];
  gameObject.race.results = [];
  gameObject.race.started = false;
  gameObject.race.terminated = false;
    
  // save gameObject
  localStorage.setItem('Go', JSON.stringify(gameObject)); 
  // lets go to race
  window.location = "https://driveorlose.glitch.me/race";
}

//  -------- ONLOAD:  ------------
window.onload = (()=> { 
  
  // load gameObject from localStorage:
  gameObject = JSON.parse(localStorage.getItem('Go'));
  const raceType = document.getElementById('raceType');
  const showResults = document.getElementById('showResults');
  const showLapTimes = document.getElementById('showLapTimes');
  const showStandings = document.getElementById('showStandings');
  const continueButton = document.getElementById('continueButton');
  let raceTypeSummary = null;
  console.log('afterRace ', gameObject);
  
  if (gameObject.race.typeOfRace === 'LapRecordHunt') {
    
    raceTypeSummary = 'Lap record hunt summary: ';
  }
  
  if (gameObject.race.typeOfRace === 'singleRace') {
    
    raceTypeSummary = gameObject.race.track[0].name + ' grand prix summary: ';
  }
  
  if (gameObject.race.typeOfRace === 'FullRacingSeason') {
    
    raceTypeSummary = gameObject.race.track[0].name + ' grand prix summary: ';
    
    // give championship points placeholders and points
    gameObject.race.cars.forEach( (car) => {
      const oldPoints = gameObject.standings.filter( oldP => oldP.driver === car.driver );
      
      if (car.points === undefined) {
          
        car.points = 0;    
      } 
      
      //console.log('oldPoints.points', oldPoints[0].points);
      // grant points from previous grand prix
      if (oldPoints[0] !== undefined) {
        
        for (let ii = 0; ii < oldPoints.length; ii++) {
          
          car.points += oldPoints[ii].points;  
        }
      }
      
      if (gameObject.race.results.length > 0) {
        
        for (let i = 0; i < gameObject.race.results.length; i++) {
          let pointsGranted = null;
          
          switch (i) {
              
            case 0: pointsGranted = 5; break;
            case 1: pointsGranted = 3; break;
            case 2: pointsGranted = 2; break;
            case 3: pointsGranted = 1; break;
            default: pointsGranted = 0;
          }
          
          if (car.driver === gameObject.race.results[i].driver) {
            
            car.points += pointsGranted;   
            // to test champion adder:
            /*
            if (car.driver === 'superTester') {
              car.points += 11;
            }
            */
          }
        }
      }
    });
    
    // sort cars by points
    gameObject.race.cars.sort( (a, b) => {
      
      return b.points - a.points;
    });
    
    // show standings
    showStandings.innerHTML = 'Championships standings: <br><br>';
    
    for (let ix = 0; ix < gameObject.race.cars.length; ix++) {
      let rank = null;
      
      rank = ix + 1;
      
      showStandings.innerHTML = showStandings.innerHTML + rank + '. ' + gameObject.race.cars[ix].driver + ' points: '+ 
        gameObject.race.cars[ix].points + '. <br>';
    }
    
    
    // if still left races.
    if (gameObject.race.currentRace + 1 < tracks.length) {
      console.log('c r, t l', gameObject.race.currentRace, tracks.length);
     // make next race button
      
    continueButton.innerHTML = '<input type= "button" value= "Next Race" onclick= "nextRace()">';
     // change to next track 
    //gameObject.race.track[0] = tracks[gameObject.race.currentRace];
    gameObject.race.currentRace++;
    } else {
      // congratulate for completing the season.
      raceTypeSummary = 'Congratulations for completing the season!';
      // add champ if champ
      if (gameObject.car.driver === gameObject.standings[0].driver) {
          
        raceTypeSummary += 'You are the champion!';
        /*
        // add champ to test:
        //const testChamp = [{name: 'kek', car: 'ferrari', colors: ['white', 'green']}];
        //addChampion(testChamp);
        */
        const newChamp = [{name: gameObject.car.driver, car: gameObject.car.name, colors: [gameObject.car.color, gameObject.car.colo2]}];
        addChampion(newChamp);
      }
    }
  }
  
  // show lap times:
  showLapTimes.innerHTML = 'Your lap times: <br><br>';
    
  gameObject.race.lastLaps.forEach( (lap) => {
      
    showLapTimes.innerHTML += lap.minutes + ':' + lap.seconds + ':' + lap.milliseconds + '<br>';
  });
  
  raceType.innerHTML = raceTypeSummary;
  
  if (gameObject.race.results.lenght === 0) {
    
    showResults.innerHTML = 'Results: <br><br> Nobody finished the race!';
    console.log('nobody finished the race');
  } else {
    
    showResults.innerHTML = 'Results of cars that crossed the goal line: <br><br>';
    
    for (let i = 0; i < gameObject.race.results.length; i++) {
      let standing = null;
      let colors = ['black', 'white'];
      
      if (gameObject.race.results[i].driver === gameObject.car.driver) {
        
        colors[0] = gameObject.car.color;
        colors[1] = gameObject.car.color2;
      } else {
        // find colors if not player
        for (let ix = 0; ix < aiCars.length; ix++) {
          
          if (gameObject.race.results[i].driver === aiCars[ix].driver) {
              
            colors[0] = aiCars[ix].color;
            colors[1] = aiCars[ix].color2;
          }
        }
      }
      standing = i + 1;
      
      showResults.innerHTML = showResults.innerHTML + standing + '. <span class= "resultColors" style= "color:'+colors[0]+
        '; background-color:'+colors[1]+'">' + gameObject.race.results[i].driver + ' driving ' + 
        gameObject.race.results[i].name + '. </span><br>';
    }
  }
  // fetch best laps of this circuit
  updateListsFromDB();
  // compare best laps of circuit to players fresh lap times, if folder is empty or new record, add it there.
  
  // if data was modificated, make the update.
  
});