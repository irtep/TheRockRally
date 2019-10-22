function findIndex(toFind, source) {
  //console.log('cheking champ: ', toFind, source);
  for (let i = 0; i < source.length; i++) {
    //console.log('comparing: ', toFind, source[i].name);
    if (toFind === source[i].name) {
   //   console.log('returning: ', i);
      return i;
    }
  }
}

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

// add champion
function addChampion(who) {
  const http = new XMLHttpRequest();
  const url = '/addChamp';
  const champ = who;
  const champJSON = JSON.stringify(who);
  let params = 'MSG='+ champJSON;
  
  http.open('POST', url, true);
  http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

  http.onreadystatechange = () => {
    
    //console.log('sending champ: ', params);
  }
  http.send(params); 
}

// fetch data from db and add to main page:
function showListFromDB(onlyChamps) { // param true if want to see champions, false for lap records
  const http = new XMLHttpRequest();
  const url = '/showAll';
  let params = 'MSG=show';
  onlyChamps ? params = 'MSG=showChamps' : console.log('lapRecords');
  
  http.open('POST', url, true);
  http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

  http.onreadystatechange = () => {//Call a function when the state changes.
    
    if (http.readyState == 4 && http.status == 200) {
      const records = JSON.parse(http.responseText);
      
      if (onlyChamps) {
        const champs = document.getElementById('champs');
        //const champEntries = records.champs;
        // continue here:
        let champsList = [];
        console.log('onyC ', records);
        
        records.forEach( campeon => {
          // continue with this...
          if (champsList.length === 0) {
            // if first of a list
            champsList.push(campeon);
            const carOfEntry = JSON.parse(JSON.stringify(champsList[0].car));
            let testArray = null
            champsList[0].car = [{name: carOfEntry, color1: champsList[0].colors[0], color2: champsList[0].colors[1]}];
            //console.log('ta', testArray);
          } else {
            const multipChamps = champsList.filter( champ => champ.name === campeon.name);
            //console.log('multiChamps: ', multipChamps);
            if (multipChamps.length > 0) {
              const indexOfChamp = findIndex(campeon.name, champsList);
              //console.log('found multichamp ', campeon.car);
              const carEntry = {name: campeon.car, color1: campeon.colors[0], color2: campeon.colors[1]};
              //champsList[indexOfChamp].extraCar = carEntry;
              
              champsList[indexOfChamp].car.push(carEntry);
              /*
              console.log('found multichamp: ', multipChamps);
              console.log('champslist: ', champsList);
              */
            } else {
              
              //console.log('iOc', indexOfChamp);
              // carEntry here too.
              const carOfEntry = JSON.parse(JSON.stringify(campeon.car));
              champsList.push(campeon);
              const indexOfChamp = findIndex(campeon.name, champsList);
              //console.log('c.List ', champsList);
              champsList[indexOfChamp].car = [{name: carOfEntry, color1: champsList[indexOfChamp].colors[0], color2: champsList[indexOfChamp].colors[1]}];
            }
          }
          //*/
          /*
          champs.innerHTML += '<span class= "resultColors" style= "color: '+campeon.colors[0]+'; background-color: '+campeon.colors[1]+'">'+
            campeon.name +'. driving: '+ campeon.car + '</span>.   ';
*/
        }); 
        
        champsList.forEach( campeon => {
          const championships = campeon.car.length;
          let timesOrTime = 'time';
          let carOrCars = 'car';
          let cars = '<span class= "resultColors" style= "color: '+campeon.car[0].color1+'; background-color: '+
          campeon.car[0].color2+'">'+campeon.car[0].name+ '</span>';
          
          // if multichampion:
          if (championships > 1) {
            
            timesOrTime = 'times'; 
            carOrCars = 'cars'
            
            for (let i = 1; i < campeon.car.length; i++ ) {
              const writeCar = '<span class= "resultColors" style= "color: '+
              campeon.car[i].color1+'; background-color: '+
              campeon.car[i].color2+'">'+campeon.car[i].name+ '</span>';
              
              cars += ', ' + writeCar;
            }
          }
          
          champs.innerHTML += championships+ ' ' +timesOrTime+ ' champion: <b>'+ campeon.name + '</b>. ' + 
          carOrCars+ ': '+ cars + '.<br>';
        });
      } else {
        const lapData = records[0].lapRecords;
        const track1 = document.getElementById('finseFactory');
        const track2 = document.getElementById('cityCentre');
        const track3 = document.getElementById('lasCurvas');
        const track4 = document.getElementById('alleys');
        const allTracks = [track1, track2, track3, track4];

        //console.log("update ready!: ", records[0].lapRecords);

        allTracks.forEach( tracki => {tracki.innerHTML += '<br>';});
        // write it..
        for (let i = 0; i < lapData.length; i++) {

          for (let ii = 0; ii < lapData[i].times.length; ii++) {
            const info = lapData[i].times[ii];
            const position = ii + 1;

            allTracks[i].innerHTML += '<b>'+position+'.<span class= "resultColors" style= "color: '+info.colors[0]+'; background-color: '+info.colors[1]+'">' + info.driver+
            '</b></span>. Car: '+ info.car + ' Time: '+ info.bestLap[0]+ ':'+ info.bestLap[1]+ ':'+ info.bestLap[2]+ ' <br>';
          }
        }
      }
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
  //console.log("updating from DB");
  
  http.open('POST', url, true);
  http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

  http.onreadystatechange = () => {//Call a function when the state changes.
    
    if (http.readyState == 4 && http.status == 200) {
      const records = JSON.parse(http.responseText);
      //const forShow1 = sahaList.join('<br>');
      //console.log("update ready!: ", records[0].lapRecords);
      const currentRace = records[0].lapRecords.filter( circuit => circuit.name === currentCircuit);
      //console.log('cR ', currentRace);
      
      lapTimes.forEach( time => {
        const timeEntry = [time.minutes, time.seconds, time.milliseconds];
        const timeIsBetter = compareLaps(timeEntry, bestLap);
        
        timeIsBetter ? bestLap = timeEntry : console.log('no change');
      });
      
      // check if players time is top3 time:
      for (let i = 0; i < currentRace[0].times.length; i++) {
        
        const newIsBetter = compareLaps(bestLap, currentRace[0].times[i].bestLap);
        //console.log('comparing ', bestLap, currentRace[0].times[i].bestLap);
        //newIsBetter ? console.log('faster'): console.log('slower');
          
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
          //console.log('times now: ', currentRace[0].times);
          return;
        } 
      }
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
    }
  }
  http.send(params);
  //feedback.innerHTML = "updating database, wait!";
}