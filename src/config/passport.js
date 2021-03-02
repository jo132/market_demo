const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const Users = require('../models/Users');

passport.use(new LocalStrategy({
     usernameField: 'email'
}, async (email, password, done) =>{
     const users = await Users.findOne({email: email});
     if(!users){
          return done(null, false, {message: 'Usuario no encontrado'});
     }
     else{
          const match = await users.matchPassword(password);
          if (match) {
               return done(null, users);
          }
          else{
               return done(null, false, {message: 'Password Inconrrecto'});
          }
     }
}));

passport.serializeUser((user, done) => {
     done(null, user.id);
});

passport.deserializeUser((id, done) => {
     Users.findById(id, (err, user) => {
          done(err, user);
     });
});