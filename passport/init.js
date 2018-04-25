const models = require("../models");
const github = require("./github");

// Passport needs to be able to serialize and deserialize users to support persistent login sessions

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    console.log("============== serializing user: ");
    console.log(user);
    done(null, user.dataValues.id);
  });

  passport.deserializeUser(function(id, done) {
    console.log("============== DEserializing user: ");
    models.User.find({
      where: { id: id }
    })
      .then(user => done(null, user))
      .catch(err => done(err, null));
  });
  github(passport);
};
