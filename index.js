const path = require("path");
const express = require("express");
const Sequelize = require("sequelize");
var models = require("./models");
var passport = require("passport");

const app = express();

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require("morgan")("combined"));
app.use(require("cookie-parser")());
app.use(require("body-parser").urlencoded({ extended: true }));
app.use(
  require("express-session")({
    secret: "keyboard cat",
    name: "pirate_super_cookie_monster"
  })
);

// Configuring Passport
app.use(passport.initialize());
app.use(passport.session());

// Initialize Passport
var initPassport = require("./passport/init");
initPassport(passport);

app.use(require("body-parser")());
const handlebars = require("express-handlebars").create({
  defaultLayout: "main",
  partialsPath: "views/partials"
});

app.engine("handlebars", handlebars.engine);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");
app.use(express.static(path.join(__dirname, "/public")));

app.set("port", process.env.PORT || 3000);
let fb_auth = passport.authenticate("facebook", { failureRedirect: "/login" });
let gh_auth = passport.authenticate("github", { failureRedirect: "/login" });
let local_auth = passport.authenticate("local", { failureRedirect: "/login" });

//Custom Middleware

/* this checks to see passport has deserialized 
and appended the user to the request */
const isAuth = (req, res, next) => {
  console.log("=======Auth Check");
  if (req.user) {
    return next();
  } else return res.render("login", {});
};

const piratesController = (req, res, next) => {
  console.log(req.body);
  console.log(req.isAuthenticated());
  //This is where we would 'Insert into DB'
  if (req.body.sir_name)
    models.Pirates.create({
      family_name: req.body.sir_name,
      nick_name: req.body.nick_name,
      birth_country: req.body.birth_country,
      worth: req.body.worth,
      date_of_death: req.body.death
    })
      .then(newPirate => {
        console.log(
          `New Pirate ${newPirate.nick_name}, with id ${newPirate.pirate_id} has been created.`
        );
      })
      .catch(err => console.log(err));
  //Now get all the pirates out of the db to present!
  models.Pirates.findAll().then(function(data) {
    res.render("pirates", {
      pirates: data
    });
  });
};

app.get("/", piratesController);

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

app.get("/users", (req, res) => {
  models.User.findAll().then(function(data) {
    res.render("users", {
      users: data
    });
  });
});

app.get("/profile", isAuth, (req, res) => {
  console.log(req.isAuthenticated());
  res.render("profile", {
    user: req.user
  });
});

app.get("/pirate", isAuth, (req, res) => {
  res.render("pirate-form");
});

app.post("/pirate", piratesController);

app.get("/pirates", piratesController);

//register Github route
app.get("/login/github", passport.authenticate("github", { session: true, failureRedirect: "/" }));
app.get(
  "/login/github/callback",
  passport.authenticate("github", { failureRedirect: "/pirates" }),
  function(req, res) {
    res.redirect("/profile");
  }
);

app.use((req, res) => {
  res.render("404");
});

//Connect to your DB
// sync() will create all table if they doesn't exist in database
models.sequelize.sync().then(function() {
  app.listen(app.get("port"), () => {
    console.log(
      "Express started on http://localhost:" + app.get("port") + "; press Ctrl-C to terminate."
    );
  });
});
