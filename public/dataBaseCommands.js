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
    
    console.log('sending champ: ', params);
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
        console.log('onyC ', records);
        records.forEach( campeon => {
          
          champs.innerHTML += '<span class= "resultColors" style= "color: '+campeon.colors[0]+'; background-color: '+campeon.colors[1]+'">'+
            campeon.name +'. driving: '+ campeon.car + '</span>.   ';
        }); 
        /*
        i'll change this to "support" better multichampions.. records looks like this:
        	.	Array(3)
	.	0:
	.	car: "Zermeces E" colors: (2) ["crimson", "gold"] name: "Pete" __v: 0 _id: "5d5906edb21f330074d5a568" __proto__: Object 
	.	1: {colors: Array(2), _id: "5d5c3001ab7e1d00743a0651", name: "_Janne", car: "Zermeces E", __v: 0} 
  2: {colors: Array(2), _id: "5d5ee3b7971c9f0076549db7", name: "Pete", car: "Rond Comet R", __v: 0} 
  length: 3 
        */
      } else {
        const lapData = records[0].lapRecords;
        const track1 = document.getElementById('finseFactory');
        const track2 = document.getElementById('cityCentre');
        const track3 = document.getElementById('lasCurvas');
        const track4 = document.getElementById('alleys');
        const allTracks = [track1, track2, track3, track4];

        console.log("update ready!: ", records[0].lapRecords);

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
  console.log("updating from DB");
  
  http.open('POST', url, true);
  http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

  http.onreadystatechange = () => {//Call a function when the state changes.
    
    if (http.readyState == 4 && http.status == 200) {
      const records = JSON.parse(http.responseText);
      //const forShow1 = sahaList.join('<br>');
      console.log("update ready!: ", records[0].lapRecords);
      const currentRace = records[0].lapRecords.filter( circuit => circuit.name === currentCircuit);
      console.log('cR ', currentRace);
      
      lapTimes.forEach( time => {
        const timeEntry = [time.minutes, time.seconds, time.milliseconds];
        const timeIsBetter = compareLaps(timeEntry, bestLap);
        
        timeIsBetter ? bestLap = timeEntry : console.log('no change');
      });
      
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