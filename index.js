const http = require("http"); //CommonJS
const fs = require("fs");
const path = require("path");

const express = require("express");

const app = express();

const handlebars = require("express-handlebars").create({
  defaultLayout: "main"
});
app.engine("handlebars", handlebars.engine);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

app.set("port", process.env.PORT || 3000);

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
  res.sendFile(__dirname + "/public/treasure.html");
});

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
