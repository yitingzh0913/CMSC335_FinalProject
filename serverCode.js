/*
  CMSC 335 Final Project
*/

process.stdin.setEncoding("utf8");
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, '/.env') });

const uri = "mongodb+srv://testUser:testUser@cmsc335.orqstjp.mongodb.net/";
const dbCollection = { db: "CMSC335_DB", collection: "finalProject" };

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'templates'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Command Line
let argArr = process.argv;
let portNum;

portNum = argArr[2];

console.log(`Web server started running at http://localhost:${portNum}`);
// Stop server
const prompt = "Stop to shutdown server: ";
process.stdout.write(prompt); 
process.stdin.on('readable', () => {
  const inputStr = process.stdin.read();
  if (inputStr !== null) {
      const commandStr = String(inputStr).trim();
      if (commandStr === "stop") {
          console.log("Shutting down the server");
          process.exit(0);
      } else {
          console.log("Command other than `stop` inputted\n");
      }
  }
});


// Express
app.listen(portNum);

// Get
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/favorites', (req, res) => {
  res.render('favorites');
});
