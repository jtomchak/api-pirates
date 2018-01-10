const path = require("path");
const express = require("express");
const Sequelize = require("sequelize");
var models = require("./models");

const app = express();

app.use(require("body-parser")());
const handlebars = require("express-handlebars").create({
  defaultLayout: "main"
});

app.engine("handlebars", handlebars.engine);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

app.set("port", process.env.PORT || 3000);

//Custom Middleware
const piratesController = (req, res, next) => {
  console.log(req.body);
  //This is where we would 'Insert into DB'
  if (req.body.sir_name)
    db.run(
      `INSERT INTO Pirates(family_name, nick_name, birth_country, worth, date_of_death) VALUES (
      '${req.body.sir_name}', 
      '${req.body.nick_name}',
      '${req.body.birth_country}',
      '${req.body.worth}',
      '${req.body.death}'
    )`,
      (err, row) => {
        if (err) console.log(err);
      }
    );
  //Now get all the pirates out of the db to present!
  models.Pirates.findAll({}).then(function(data) {
    res.render("pirates", {
      pirates: data
    });
  });
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

app.get("/pirates", piratesController);

app.use((req, res) => {
  res.render("404");
});

//Connect to your DB
// sync() will create all table if they doesn't exist in database
models.sequelize.sync().then(function() {
  app.listen(app.get("port"), () => {
    console.log(
      "Express started on http://localhost:" +
        app.get("port") +
        "; press Ctrl-C to terminate."
    );
  });
});
