const path = require("path");
const express = require("express");

const app = express(); //init our express app

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
  res.render("index"); //render the file in views named 'index'
});

app.post("/", (req, res) => {
  console.log(req.body);
  //take req.body and save it to the database!
  //then return saved object with status 201
  res.send({ name: req.body.name });
});

//at localhost:3000/about
app.get("/about", (req, res) => {
  res.render("about"); //render the file in views named 'about'
});

app.get("/treasure", (req, res) => {
  res.render("treasure");
});

//Finally setting the app to listen gets it going
app.listen(app.get("port"), () => {
  console.log(
    "Express started on http://localhost:" + app.get("port") + "; press Ctrl-C to terminate."
  );
});
