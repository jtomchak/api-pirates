const http = require("http"); //CommonJS
const fs = require("fs");
const path = require("path");

const express = require("express");

const app = express();
// parse out body posts
app.use(require("body-parser")());

const handlebars = require("express-handlebars").create({
  defaultLayout: "main"
});
app.engine("handlebars", handlebars.engine);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

app.set("port", process.env.PORT || 3000);

//Middleware
const piratesController = (req, res, next) => {
  console.log(req.body);
  res.render("success", { pirate: req.body });
};

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/about", (req, res) => {
  res.sendFile(__dirname + "/public/about.html");
});

app.get("/ship", (req, res) => {
  res.render("ship");
});

app.get("/treasure", (req, res) => {
  res.render("treasure");
});

app.get("/success", (req, res) => {
  res.render("success");
});

app.get("/pirates", (req, res) => {
  res.render("pirates");
});

app.post("/pirates", piratesController);

app.use((req, res) => {
  res.type("text/plain");
  res.status(404);
  res.send("404 - Not Found");
});

app.listen(app.get("port"), () => {
  console.log(
    "Express started on http://localhost:" +
      app.get("port") +
      "; press Ctrl-C to terminate."
  );
});
