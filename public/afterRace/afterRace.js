let gameObject = null;

function goToStart() {
  
  
  window.location = "https://therockrally.glitch.me/";
}

function nextRace() {  
  
  gameObject.race.cars.forEach( (theCar) => {
    const pointsEntry = {driver: theCar.driver, points: theCar.points}
    
    theCar.statuses.speed = 0;
    theCar.statuses.heading = 0;
    
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
  window.location = "https://therockrally.glitch.me/race";
  /*
  cars: (4) [{…}, {…}, {…}, {…}] 
  currentLapTime: {minutes: 0, seconds: 0, milliseconds: 0}
  currentRace: 1 
  lastLaps: (3) [{…}, {…}, {…}] results: (3) [{…}, {…}, {…}] 
  started: true terminated: true 
  tests: {radarBars: null} 
  totalLaps: 4 track: [{…}] 
  typeOfRace: "FullRacingSeason"
  */
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
        
        car.points += oldPoints[0].points;
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
    if (gameObject.race.currentRace < tracks.length) {
      
     // make next race button
      
    continueButton.innerHTML = '<input type= "button" value= "Next Race" onclick= "nextRace()">';
     // change to next track 
    //gameObject.race.track[0] = tracks[gameObject.race.currentRace];
    gameObject.race.currentRace++;
      /*
    for (let i = 0; i < tracks.length; i++) {
      
      if (tracks[i].name === gameObject.race.track[0].name) {
        
        gameObject.race.track = [];
        gameObject.race.track.push(tracks[i + 1]);
        gameObject.race.currentRace++;
        return;
      }
    }
    */
    } else {
      // congratulate for completing the season.
      
      raceTypeSummary = 'Congratulations for completing the season!';
      // show made achievements
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
    
    showResults.innerHTML = 'Results: <br><br>';
    
    for (let i = 0; i < gameObject.race.results.length; i++) {
      let standing = null;
      
      standing = i + 1;
      
      showResults.innerHTML = showResults.innerHTML + standing + '. ' + gameObject.race.results[i].driver + ' driving ' + 
        gameObject.race.results[i].name + '. <br>';
    }
  }
});