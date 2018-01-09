const path = require("path");
const express = require("express");

const app = express();

const handlebars = require("express-handlebars").create({
  defaultLayout: "main"
});
//const handlebars = require('express-handlebars');
//handlebars.create({defaultLayout: 'main'});

app.engine("handlebars", handlebars.engine);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

app.set("port", process.env.PORT || 3000);

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
