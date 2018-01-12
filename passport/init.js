var facebook = require("./facebook");
var models = require("../models");

module.exports = function(passport) {
  // Passport needs to be able to serialize and deserialize users to support persistent login sessions
  passport.serializeUser(function(user, done) {
    console.log("============== serializing user: ");
    console.log(user);
    done(null, user.user_id);
  });

  passport.deserializeUser(function(id, done) {
    console.log("============== DEserializing user: ");
    models.User.find({
      where: {
        user_id: id
      }
        .then(user => {
          console.log("deserializing user:", user);
          done(null, user);
        })
        .catch(err => done(err, null))
    });
  });

  // Setting up Passport Strategies for Facebook and Twitter
  facebook(passport);
};
