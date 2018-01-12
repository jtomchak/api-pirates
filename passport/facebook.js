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
        models.User.findOrCreate({
          where: {
            authId: profile.id
          },
          defaults: {
            role: "user",
            name: profile.displayName
          }
        }).spread((user, created) => {
          if (!user) done(user, null);
          done(null, user);
        });
      }
    )
  );
};
