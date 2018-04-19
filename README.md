# Adding sqlite3

* `npm install sqlite3`
* Add your Pirates DB to the project!
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

* Double check the query!!!

```js
//Let's run a query to confirm
const query = `SELECT * from Pirates`;
db.each(query, (err, row) => {
  if (err) throw err;
  console.log(row);
});
```

# Add Sequilize

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

# Auth

`npm install express-session passport passport-facebook cookie-parser morgan`

1.  Create a User model using `node_modules/.bin/sequelize model:create --name User --attributes name:String` the other properties are to be like so

```js
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
const FacebookStrategy = require("passport-facebook").Strategy;
```

2.  Go to Facebook and get an ID and Secret, Don't share these with anyone. See LMS for instructions on this one.

3.  Create fb.js file and put this in....this is in the root of the project.

```js
// facebook app settings - fb.js
module.exports = {
  appID: "YOURID",
  appSecret: "YOURSECRET",
  callbackUrl: "http://localhost:3000/login/facebook/callback"
};
```

4.  Need to create a passport folder, and add init.js with this.

```js
//init.js in ("./passport")
var facebook = require("./facebook");
var User = require("../models/user");

module.exports = function(passport) {
  // Passport needs to be able to serialize and deserialize users to support persistent login sessions
  passport.serializeUser(function(user, done) {
    console.log("serializing user: ");
    console.log(user);
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      console.log("deserializing user:", user);
      done(err, user);
    });
  });

  // Setting up Passport Strategies for Facebook and Twitter
  facebook(passport);
};
```

5.  We need in the same folder a 'facebook.js'

```js
//facebook.js
var FacebookStrategy = require("passport-facebook").Strategy;
var models = require("../models");
var fbConfig = require("../fb.js");

module.exports = function(passport) {
  passport.use(
    "facebook",
    new FacebookStrategy(
      {
        clientID: fbConfig.appID,
        clientSecret: fbConfig.appSecret,
        callbackURL: fbConfig.callbackUrl,
        profileFields: ["id", "displayName", "emails"]
      },

      // facebook will send back the tokens and profile
      function(access_token, refresh_token, profile, done) {
        console.log("profile", profile);
        models.User.create({
          authId: profile.id,
          name: profile.displayName,
          role: "user"
        });
      }
    )
  );
};
```

6.  Then we should have some routes like so...

```js
// register Facebook routes index.js
app.get("/login/facebook", passport.authenticate("facebook"));

app.get(
  "/login/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/pirates" }),
  function(req, res) {
    res.redirect("/users");
  }
);
```

7.  Auth for github. We'll need `npm install passport-github`and we'll follow this guide [passport-github](https://github.com/jaredhanson/passport-github)

* **WE NEED** a clientId and clientSecert from Github head to dev settings and fill this out [LINK](https://github.com/settings/applications/new)
  ![Imgur](https://i.imgur.com/mFsZEQS.png)

* Then we'll need to fill out a passport github for initialization.

```js
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

8.  Then we need to set up the auth route **AND** the callback route, or where github should go when it's verified by the user. In our case that's `'/auth/github/callback'`
