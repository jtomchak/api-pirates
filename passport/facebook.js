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

        models.User.findOne({ where: { authId: profile.id } }, function(
          err,
          user
        ) {
          if (err) return done(err, null);
          if (user) {
            console.log("=======USER=======");
            console.log(user);
            return done(null, user);
          }
          User.create({
            authId: authId,
            name: profile.displayName,
            role: "user"
          });
        });
      }
    )
  );
};
