const express = require('express');
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser');

const port = process.env.PORT || 8000;

function getJSON(filepath) {
  return JSON.parse(fs.readFileSync(filepath, "utf-8"));
}

const app = express();

app.use('/components', express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/src'));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
  extended: true
})); // support encoded bodies

app.get('/data', cors(), function(req, res) {
  res.json(getJSON("data.json"));
});


let pushToDatabase = function(data) {
  var dbFile = fs.readFileSync('data.json');
  var db = JSON.parse(dbFile);
  Object.keys(data).forEach(function(key) {
      db.screen1.availability.taken[key] = data[key];
});
  var jsonData = JSON.stringify(db);
  fs.writeFile('./data.json', jsonData, function(err){
    if(err)
    console.log(err);

    else {
      console.log("Saved");
    }
  });
}
app.post('/booking', cors(), function(req, res) {
  console.log(req.body);
  pushToDatabase(req.body);
  res.send("Booked Tickets")
});

app.listen(port);
