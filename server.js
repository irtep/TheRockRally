const bodyParser = require('body-parser');
const express = require('express');
const app = express();


app.use(express.static('public'));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// GET HANDLERS:

app.get("/", (request, response) => {
  console.log("get received");
  response.sendFile(__dirname + '/views/raceMenu/raceMenu.html');
});

app.get("/race", (request, response) => {
  console.log("get received race");
  response.sendFile(__dirname + '/views/race/race.html');
});

app.get("/afterRace", (request, response) => {
  console.log("get received for afterRace");
  response.sendFile(__dirname + '/views/afterRace/afterRace.html');
});

// --------------------- LISTEN PORT ---------------------

const listener = app.listen(process.env.PORT, () => {
  console.log('listening on port ' + listener.address().port);
});