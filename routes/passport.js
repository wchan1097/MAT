const passport = require('passport');
const LocalStrategy = require("passport-local");

module.exports = function (app) {
    app.use(passport.initialize());
    app.use(passport.session());
    
    passport.serializeUser((user, done) => {
      done(null, user._id);
    });
    
    passport.deserializeUser((id, done) => {
      done(null, {id});
    });

    passport.use(new LocalStrategy(
      (username, password, authCheckDone) => {
        username = username.toLowerCase();
        app.locals.users
        .findOne({username})
        .then(user => {
          if (!user){
            return authCheckDone(null, false);
          }
          if (user.password !== password){
            return authCheckDone(null, false);
          }
          return authCheckDone(null, user);
        });
      }
    ));
};