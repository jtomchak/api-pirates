const path = require("path");
const express = require("express");
const sqlite = require("sqlite3").verbose();

const app = express();

//Connect to your DB
const db = new sqlite.Database("./deadSeas.sqlite", err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("........Connected to The DeadSea, arrrrrrgh.");
});

//Let's run a query to confirm
const query = `SELECT * from Pirates`;
db.each(query, (err, row) => {
  if (err) throw err;
  console.log(row);
});

app.use(require("body-parser")());
const handlebars = require("express-handlebars").create({
  defaultLayout: "main"
});
//const handlebars = require('express-handlebars');
//handlebars.create({defaultLayout: 'main'});

app.engine("handlebars", handlebars.engine);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

app.set("port", process.env.PORT || 3000);

//Custom Middleware
const piratesController = (req, res, next) => {
  console.log(req.body);
  //This is where we would 'Insert into DB'
  res.render("pirates", { pirate: req.body }); //template and data thing/object
};

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/ship", (req, res) => {
  res.render("ship");
});

app.get("/treasure", (req, res) => {
  res.render("treasure");
});

app.get("/pirate", (req, res) => {
  res.render("pirate-form");
});

app.post("/pirate", piratesController);

app.get("/pirates", (req, res) => {
  res.render("pirates");
});

app.use((req, res) => {
  res.render("404");
});

app.listen(app.get("port"), () => {
  console.log(
    "Express started on http://localhost:" +
      app.get("port") +
      "; press Ctrl-C to terminate."
  );
});
