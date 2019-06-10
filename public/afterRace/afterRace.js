
function goToStart() {
  
  
  window.location = "https://therockrally.glitch.me/";
}

//  -------- ONLOAD:  ------------
window.onload = (()=> { 
  
  // load gameObject from localStorage:
  const gameObject = JSON.parse(localStorage.getItem('Go'));
  const raceType = document.getElementById('raceType');
  const showResults = document.getElementById('showResults');
  const showLapTimes = document.getElementById('showLapTimes');
  const showStandings = document.getElementById('showStandings');
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
      
      if (car.points === undefined) {
          
        car.points = 0;    
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
  }
  
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