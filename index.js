const path = require("path");
const express = require("express");
const sqlite = require("sqlite3").verbose();

const app = express(); //init our express app

const db = new sqlite.Database("./deadSeas.sqlite", err => {
  if (err) console.error(err);
  console.log("Connected to ye pirates Data!!!!!");
});

//body-parser will take http request body and attach it
//to the request object automatticly for us
app.use(require("body-parser")());

//Configuring the app to use the right templeting engine
const handlebars = require("express-handlebars").create({
  defaultLayout: "main"
});

app.engine("handlebars", handlebars.engine);
app.set("views", path.join(__dirname, "views")); //where are the views?
app.set("view engine", "handlebars");

app.set("port", process.env.PORT || 3000);

//Routing Town!!!
app.get("/", (req, res) => {
  const query = `SELECT * FROM Pirates`;

  db.all(query, [], (err, rows) => {
    if (err) {
      res.status("500");
      res.send(err.message);
    }
    res.render("pirates", { pirates: rows });
  });
});

app.post("/", (req, res) => {
  console.log(req.body);
  //take req.body and save it to the database!
  //then return saved object with status 201
  res.send({ name: req.body.name });
});

app.get("/pirate", (req, res) => {
  res.render("pirate-form");
});

app.post("/pirate", (req, res) => {
  console.log(req.body);
  //insert into the DB
  res.send(req.body);
});

//Finally setting the app to listen gets it going
app.listen(app.get("port"), () => {
  console.log(
    "Express started on http://localhost:" + app.get("port") + "; press Ctrl-C to terminate."
  );
});
