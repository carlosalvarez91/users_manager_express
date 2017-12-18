const LocalStrategy = require('passport-local').Strategy;
const Admin = require('../models/admin');
const config = require('../config/database');
const bcrypt = require('bcryptjs');

module.exports = function(passport){
  // Local Strategy
    //ISSUE: by default passport uses the Username and Password as a 
    //log-in credentials, so we have to specify to use Email as a usernameField.
  passport.use(new LocalStrategy({usernameField:'email'},function(email, password, done){
    // Match Email
    Admin.findOne({email:email}, function(err, admin){
      if(err) throw err;
      if(!admin){
        return done(null, false, {message: 'No user found'});
      }

      // Match Password
      bcrypt.compare(password, admin.password, function(err, isMatch){
        if(err) throw err;
        if(isMatch){
          return done(null, admin);
        } else {
          return done(null, false, {message: 'Wrong password'});
        }
      });
    });
  }));

  passport.serializeUser(function(admin, done) {
    done(null, admin.id);
  });

  passport.deserializeUser(function(id, done) {
    Admin.findById(id, function(err, admin) {
      done(err, admin);
    });
  });
}
