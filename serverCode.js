/*
  CMSC 335 Final Project
*/

process.stdin.setEncoding("utf8");
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const { MongoClient, ServerApiVersion } = require("mongodb");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const uri = "mongodb+srv://testUser:testUser@cmsc335.orqstjp.mongodb.net/";
const dbCollection = { db: "CMSC335_DB", collection: "finalProject" };

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "templates"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let argArr = process.argv;
let portNum = argArr[2];

console.log(`Web server started running at http://localhost:${portNum}`);

process.stdout.write("Stop to shutdown server: ");
process.stdin.on("readable", () => {
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

app.listen(portNum);

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/showAdvice", async (req, res) => {
  const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });

  try {
    await client.connect();
    let num = req.body.numberInput;
    let adviceTxt = await getAdvice(num);
    res.render("showAdvice", { num, adviceTxt });
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
});

app.get("/favorites", async (req, res) => {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const collection = client
      .db(dbCollection.db)
      .collection(dbCollection.collection);
    const favoriteQuotes = await collection.find({}).toArray();
    res.render("favorites", { favoriteQuotes });
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
});


// POST 
app.post("/favoriteQuote", async (req, res) => {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const collection = client
      .db(dbCollection.db)
      .collection(dbCollection.collection);

    const num = req.body.num;
    const adviceText = req.body.adviceText;
    const rating = req.body.rating;
    const comments = req.body.comments;

    await collection.insertOne({ num: num, advice: adviceText, rating: rating, comments: comments });
    res.redirect("/favorites");
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
});

app.post("/clearFavorites", async (req, res) => {
  const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });

  try {
    await client.connect();
    const collection = client
      .db(dbCollection.db)
      .collection(dbCollection.collection);
    await collection.deleteMany({});
    res.redirect("/");
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
});


// Functions
function getAdvice(num) {
  return new Promise((resolve, reject) => {
    const url = `https://api.adviceslip.com/advice/${num}`;

    https
      .get(url, (response) => {
        let data = "";

        response.on("data", (chunk) => {
          data += chunk;
        });

        response.on("end", () => {
          try {
            const advice = JSON.parse(data).slip.advice;
            resolve(advice);
          } catch (error) {
            reject(error);
          }
        });
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}
