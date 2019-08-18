const bodyParser = require('body-parser');
const express = require('express');
const app = express();

app.use(express.static('public'));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// database access:
const mongoose = require('mongoose'); 
const mongoDB = process.env.SECRET1; // admin
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
const Schema = mongoose.Schema;

const champsSchema = new Schema( {
  name: {
    type: String    
  },
  car: {
    type: String
  },
  colors: {
    type: Array
  } 
});
const lapRecordsSchema = new Schema( {
  lapRecords: {
    type: Array    
  } 
});

const champsModel = mongoose.model('champsModel', champsSchema ); 
const lapRecordsModel = mongoose.model('lapRecordsModel', lapRecordsSchema ); 

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// GET HANDLERS:

app.get("/", (request, response) => {
  console.log("get received");
  response.sendFile(__dirname + '/views/raceMenu/raceMenu.html');
});
/* res.sendFile(path.join(__dirname, '../public', 'index1.html')); */
/* response.sendFile(__dirname + '/views/race/race.html'); */
app.get("/race", (request, response) => {
  console.log("get received race");
  response.sendFile(__dirname + '/views/race/race.html');
});

app.get("/afterRace", (request, response) => {
  console.log("get received for afterRace");
  response.sendFile(__dirname + '/views/afterRace/afterRace.html');
});

// POST handlers: will be used for database access, to save and load top lists and lap records.
app.post('/showAll', (request, response) => {
  
  const received = request.body.MSG;
  let topLists;
  let responding;
  
  console.log('Post with showAll received: ', received);
  switch (received){
    case ('show'):
      lapRecordsModel.find((err, results) => {
      if (err) console.log(err);
      topLists = results;   
        console.log('result for toplist search: ', results);
      });
      setTimeout(() => {  // timed so that there is time to add the data
        responding = topLists;  
        const sending = JSON.stringify(responding);
        console.log("responding with data ");
        console.log('lists now: ', responding);
        response.writeHead(200, {'Content-Type': 'text/plain'});
        response.end(sending);      
      }, 1000); //timer
    break;  
    case ('showChamps'):
      var resp = null;
      champsModel.find((err, results) => {

      if (err) console.log(err);
        console.log('result for champs search at show champs: ', results);
        resp = results;  
      });
      
      setTimeout(() => {  // timed so that there is time to add the data
        const sending = JSON.stringify(resp);
        console.log("responding with data ");
        console.log('lists now: ', responding);
        response.writeHead(200, {'Content-Type': 'text/plain'});
        response.end(sending);      
      }, 1000); //timer
    break; 
  }
  
  //console.log(request.headers);
});
// updates lap records:
app.post('/updateAll', (request, response) => {
  console.log('update list request received');
  
  const received = JSON.parse(request.body.MSG); 
  console.log('received: ', received);
  const listQuery = { name:  'lapRecords' };  
  
  const listEntry = received.updatedLists[0].lapRecords;
  console.log('r' ,listEntry.lapRecords);

  lapRecordsModel.update(listQuery, {
    lapRecords: listEntry
  }, (err, numberAffected, rawResponse) => {
        console.log("recordList updated"); 
      }); 

  const sending = JSON.stringify('Database updated successfully!');
  console.log("responding with data ");
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.end(sending); 
  
});

// this will be to add champion:
// '/addChamp';
app.post('/addChamp', (request, response) => {
  console.log('add champs');
  const received = JSON.parse(request.body.MSG);
  console.log('received new champ: ', received);
  const theQuery = { name: 'champs'};
  let champsList = null;
  let listEntry = null;
  
  // a document instance
  const newChamp = new champsModel({
    name: received[0].name, 
    car: received[0].car,
    colors: received[0].colors
    });
 
  // save model to database
  newChamp.save(function (err, champion) {
    if (err) return console.error(err);
    console.log(champion.name + " saved to champs collection.");
  });
      
  
  /*
  champsModel.find((err, results) => {
    if (err) console.log(err);
    console.log('result for champs search: ', results);
    console.log('champslist', listEntry);
  });
  */
  //console.log('listEntry ', listEntry);
  /*
  champsModel.update(theQuery, {
    champs: listEntry
  }, (err) => {
    console.log('champs updated');
  });
  */
  //save model to database

  /* 
  lapRecordsModel.update(listQuery, {
    lapRecords: listEntry
  }, (err, numberAffected, rawResponse) => {
        console.log("recordList updated"); 
      }); 
*/
  const sending = JSON.stringify('Database updated successfully!');
  console.log("responding with data ");
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.end(sending); 
  
});

// --------------------- LISTEN PORT ---------------------

const listener = app.listen(process.env.PORT, () => {
  console.log('listening on port ' + listener.address().port);
});