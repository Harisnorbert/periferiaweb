const LocalStrategy = require("passport-local").Strategy;
const bcryptjs = require("bcryptjs");
const Felhasznalo = require("../models/felhasznalo");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email", passwordField: "jelszo" }, async (email, jelszo, done) => {
      try {
        const felhasznalo = await Felhasznalo.findOne({ email: email.trim() });
        if (!felhasznalo) {
          return done(null, false, { message: "Nincs ilyen felhasználó!" });
        }

        const egyezik = await bcryptjs.compare(jelszo, felhasznalo.jelszo);
        if (!egyezik) {
          return done(null, false, { message: "Hibás jelszó!" });
        }

        return done(null, felhasznalo);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((felhasznalo, done) => {
    done(null, felhasznalo.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const felhasznalo = await Felhasznalo.findById(id);
      done(null, felhasznalo);
    } catch (err) {
      done(err);
    }
  });
};
