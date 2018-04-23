# Getting Started Part 1 - [BRANCH](https://github.com/jtomchak/api-pirates/tree/http-request-POST)

* Create an empty project folder `api-pirates` and make sure to in that directory
* Then `npm init -y`
* we'll need some packages right out of the gate
  `npm install express express-handlebars nodemon body-parser`
* nodemon is a library that is going to start up our app like running `node`, the difference is it will watch our files and restart our node server for us!! That will save us some headache.
* lets create an `index.js` and start building our server.

```js
//index.js
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
```

* Then we need a port and a beginning route.

```js
//index.js
app.set("port", process.env.PORT || 3000);

app.get("/", (req, res) => {
  res.render("index"); //render the file in views named 'index'
});
```

* and finally call `listen` on our app to get it going
* the second argument is a callback, that express will invoke when it's started,
* for us it just outputs the port how to stop it.

```js
app.listen(app.get("port"), () => {
  console.log(
    "Express started on http://localhost:" + app.get("port") + "; press Ctrl-C to terminate."
  );
});
```

# Adding some views

* We'll need a views directory at the root of our applicaiton. Using the provided handlebar files
* We can now add a script to start out app up, `"start" : "nodemon index.js"`

```js
 "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "nodemon index.js"
  },
```

# Let's add routes so we can render more view dynamicmly [BRANCH](https://github.com/jtomchak/api-pirates/tree/template-dynamic)

```js
//index.js
app.get("/ship", (req, res) => {
  res.render("ship");
});
```

* But we can't just do GET request. We need to be able to do POST requests too.

```js
//index.js
app.post("/pirate", (req, res) => {
  console.log(req.body);
  res.send("Thanks");
});
```

* Once this route is set up, we can use Postman to send an HTTP request method of POST to `localhost:3000/pirate`
  and get 'Thanks' back.
* Add a json object to the body of the POST and we'll see that consoled out we the POST request is made.

# Adding sqlite3 [BRANCH](https://github.com/jtomchak/api-pirates/tree/sqlite-in-express)

* `npm install sqlite3`
* Add your Pirates DB to the project! But first a package to install !!!
  `npm install sqlite3`
* update the suffix to be `*.sqlite`
* Let's connect.

```js
const express = require("express");
const sqlite = require("sqlite3").verbose();

//Connect to your DB
const db = new sqlite.Database("./deadSeas.sqlite", err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("........Connected to The DeadSea, arrrrrrgh.");
});
```

* Double check the query!!! we should get all the pirates in the console from our database!

```js
//Let's run a query to confirm
const query = `SELECT * from Pirates`;
db.each(query, (err, row) => {
  if (err) throw err;
  console.log(row);
});
```

# Add Sequilize [BRANCH](https://github.com/jtomchak/api-pirates/tree/sequilize)

[Example Link](https://github.com/sequelize/express-example)
[Working Example](https://github.com/jtomchak/api-pirates/blob/sequilize/index.js)

```sh
node_modules/.bin/sequelize init
```

```sh
node_modules/.bin/sequelize init

node_modules/.bin/sequelize model:create --name Pirate --attributes family_name:String
```

## Your Pirates model should be something like....

```js
//models/Pirates.js
module.exports = (sequelize, DataTypes) => {
  var Pirates = sequelize.define(
    "Pirates",
    {
      pirate_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      family_name: DataTypes.STRING,
      rank: DataTypes.INTEGER,
      beard: DataTypes.STRING,
      nick_name: DataTypes.STRING,
      birth_country: DataTypes.STRING,
      worth: DataTypes.INTEGER,
      date_of_death: DataTypes.INTEGER
    },
    {
      classMethods: {
        associate: function(models) {
          // associations can be defined here
        }
      }
    }
  );
  return Pirates;
};
```

## Don't forget to update your config.js file!!!!

```js
// .sequelizerc
const path = require("path");

module.exports = {
  config: path.resolve("config", "config.js")
};
```

# Auth [BRANCH](https://github.com/jtomchak/api-pirates/tree/passport-local)

`npm install express-session passport passport-github cookie-parser morgan`

1.  Create a User model using `node_modules/.bin/sequelize model:create --name User --attributes name:String` the other properties are to be like so

```js
//models/User.js
var User = sequelize.define(
  "User",
  {
    user_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    authId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    role: DataTypes.STRING
  },
  {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  }
);
```

```js
const passport = require("passport");
const FacebookStrategy = require("passport-github").Strategy;
```

2.  Go to Github and get an ID and Secret, Don't share these with anyone.

3.  Create gh.js file and put this in....this is in the root of the project.

```js
// facebook app settings - gh.js
module.exports = {
  clientID: "YOURID",
  clientSecret: "YOURSECRET",
  callbackUrl: "http://localhost:3000/login/github/callback"
};
```

4.  Need to create a passport folder, and add init.js with this.

```js
//init.js in ("./passport")
var github = require("./github");
var local = require("./local");
var models = require("../models");

module.exports = function(passport) {
  // Passport needs to be able to serialize and deserialize users to support persistent login sessions
  passport.serializeUser(function(user, done) {
    console.log("============== serializing user: ");
    done(null, user.user_id);
  });

  passport.deserializeUser(function(id, done) {
    console.log("============== DEserializing user: ");
    models.User.find({
      where: {
        user_id: id
      }
    })
      .then(user => {
        done(null, user);
      })
      .catch(err => done(err, null));
  });

  // Setting up Passport Strategies for Facebook and Local
  facebook(passport);
  github(passport);
  local(passport);
};
```

5.  We need in the same folder a 'github.js'

```js
//passport/gihub.js
var FacebookStrategy = require("passport-facebook").Strategy;
var models = require("../models");
var fbConfig = require("../fb.js");

passport.use(
  "github",
  new GithubStrategy(
    {
      clientID: ghConfig.clientId,
      clientSecret: ghConfig.clientSecret,
      callbackURL: ghConfig.callbackUrl
    },

    // github will send back the tokens and profile
    function(access_token, refresh_token, profile, done) {
      models.User.findOne({ where: { authId: profile.id } })
        .then(user => {
          if (!user) {
            let newUser = models.User.create({
              authId: profile.id,
              name: profile.displayName,
              role: "user"
            });
            done(null, newUser);
          }
          done(null, user);
        })
        .catch(err => {
          console.log(err);
          return done(err, null);
        });
    }
  )
);
```

6.  Then we should have some routes like so...

```js
// register Facebook routes index.js
app.get("/login/github", passport.authenticate("github"));

app.get(
  "/login/github/callback",
  passport.authenticate("github", { failureRedirect: "/pirates" }),
  function(req, res) {
    res.redirect("/users");
  }
);
```

7.  Auth for github. We'll need `npm install passport-github`and we'll follow this guide [passport-github](https://github.com/jaredhanson/passport-github)

### **WE NEED** a clientId and clientSecert from Github head to dev settings and fill this out [LINK](https://github.com/settings/applications/new)

![Imgur](https://i.imgur.com/mFsZEQS.png)

### Should look a bit like this when you get if filled out

![Imgur](https://i.imgur.com/6PN1Wzz.png)

* Then we'll need to fill out a passport github for initialization. Using the clientId and the clientSecrets that we got when we signed up our app. _Pirates don't share their id's, secrets, or gold!_

8.  Then we need to set up the auth route **AND** the callback route, or where github should go when it's verified by the user. In our case that's `'/auth/github/callback'`
