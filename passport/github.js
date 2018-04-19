var GithubStrategy = require("passport-github").Strategy;
var models = require("../models");
var ghConfig = require("../gh.js");

module.exports = function(passport) {
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
};
