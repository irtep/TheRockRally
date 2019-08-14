function compareLaps(lap1, lap2){
  let lap1IsBetter = true;
  
  if (lap1[0] > lap2[0]) {
    lap1IsBetter = false; console.log('slower 0', lap1[0], lap2[0]);
    return lap1IsBetter;
  } else if (lap1[0] < lap2[0]) {
    return lap1IsBetter;           
  }
  if (lap1[1] > lap2[1]) {
    lap1IsBetter = false; console.log('slower 1', lap1[1], lap2[1]);
    return lap1IsBetter;
  } else if (lap1[1] < lap2[1]) {
    return lap1IsBetter;           
  }
  if (lap1[2] > lap2[2]) {
    lap1IsBetter = false; console.log('slower 2', lap1[2], lap2[2]);
    return lap1IsBetter;
  } else if (lap1[2] < lap2[2]) {
    return lap1IsBetter;           
  }
}

// fetch data from db for only show purposes:
function showListFromDB() {
  const http = new XMLHttpRequest();
  const url = '/showAll';
  const params = 'MSG=show';
  
  http.open('POST', url, true);
  http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

  http.onreadystatechange = () => {//Call a function when the state changes.
    
    if (http.readyState == 4 && http.status == 200) {
      const records = JSON.parse(http.responseText);
      //const forShow1 = sahaList.join('<br>');
      console.log("update ready!: ", records[0].lapRecords);
      // write it..
      document.getElementById('lapRecords').innerHTML = records[0];

    }
  }
  http.send(params); 
  //feedback.innerHTML = "getting info from database, wait!";
  
  
}

// this gets lists from database and updates it
function updateListsFromDB(){
  
  //const armyList = JSON.stringify(armyList);
  //const feedback = document.getElementById('feedback');
  const http = new XMLHttpRequest();
  const url = '/showAll';
  const params = 'MSG=show';
  const currentCircuit = gameObject.race.track[0].name;
  const lapTimes = gameObject.race.lastLaps;
  let bestLap = [30, 10, 10];
  console.log("updating from DB");
  
  // find best lap:
  for (let i = 0; i < lapTimes.length; i++) {
    
    if (lapTimes[i].minutes < bestLap[0]) {
      bestLap[0] = lapTimes[i].minutes; bestLap[1] = lapTimes[i].seconds; bestLap[2] = lapTimes[i].milliseconds;
    }
    if (lapTimes[i].seconds < bestLap[1]) {
      bestLap[0] = lapTimes[i].minutes; bestLap[1] = lapTimes[i].seconds; bestLap[2] = lapTimes[i].milliseconds;
    }
    if (lapTimes[i].milliseconds < bestLap[2]) {
      bestLap[0] = lapTimes[i].minutes; bestLap[1] = lapTimes[i].seconds; bestLap[2] = lapTimes[i].milliseconds;
    }
  }
  
  http.open('POST', url, true);
  http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

  http.onreadystatechange = () => {//Call a function when the state changes.
    
    if (http.readyState == 4 && http.status == 200) {
      const records = JSON.parse(http.responseText);
      //const forShow1 = sahaList.join('<br>');
      console.log("update ready!: ", records[0].lapRecords);
      const currentRace = records[0].lapRecords.filter( circuit => circuit.name === currentCircuit);
      console.log('cR ', currentRace);
      
      // check if players time is top3 time:
      for (let i = 0; i < currentRace[0].times.length; i++) {
        
        const newIsBetter = compareLaps(bestLap, currentRace[0].times[i].bestLap);
        console.log('comparing ', bestLap, currentRace[0].times[i].bestLap);
        newIsBetter ? console.log('faster'): console.log('slower');
          
        const playerEntry = {
          driver: gameObject.car.driver,
          car: gameObject.car.name,
          colors: [
            gameObject.car.color,
            gameObject.car.color2
          ],
          bestLap: bestLap,
          circuit: currentCircuit
          }
        // new top3 time
        if (newIsBetter) {
          
          currentRace[0].times.splice(i, 0, playerEntry);
          //console.log('r', records);
          if (currentRace[0].times.length > 3) { currentRace[0].times.pop(); }
          updateListsInDB(records);
          // return as no more loops are wished
          console.log('times now: ', currentRace[0].times);
          return;
        } /*else {
        // no new top3 time, lets push it anyways, as if not enough laptimes there.
          currentRace[0].times.push(playerEntry);
        }*/
        
      }
      
      // .pop removes at end of array
      // unshift adds to start
      
      //armiesInDb = armyList[0].armyList;
      //feedback.innerHTML = "Received data from database successfully.";
      /*
      setTimeout(() => {
        clearFeedback();
      }, 1000);
      */
    }
  }
  http.send(params); 
  //feedback.innerHTML = "getting info from database, wait!";
}

function updateListsInDB(updatedLists){
  //const feedback = document.getElementById('feedback');
  const theList = JSON.stringify({updatedLists}); console.log('sending: ', theList);
  const http = new XMLHttpRequest();
  const url = '/updateAll';
  const params = 'MSG=' + theList;
  
  http.open('POST', url, true);
  http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

  http.onreadystatechange = () => {//Call a function when the state changes.
    
    if(http.readyState == 4 && http.status == 200) {
      
      console.log(http.responseText);
     // feedback.innerHTML = http.responseText;
      /*
      setTimeout(() => {
        clearFeedback();
      }, 1000);
      */
    }
  }
  http.send(params);
  //feedback.innerHTML = "updating database, wait!";
}