const LocalStrategy = require("passport-local").Strategy;
const bcryptjs = require("bcryptjs");
const Felhasznalo = require("../models/felhasznalo");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "jelszo" },
      async (email, jelszo, done) => {
        try {
          console.log("Felhasználó keresése e-mail alapján:", email);
          const felhasznalo = await Felhasznalo.findOne({ email: email.trim() });
          if (!felhasznalo) {
            console.log("Felhasználó nem található!");
            return done(null, false, { message: "Nincs ilyen e-mail cím!" });
          }
  
          console.log("Felhasználó megtalálva:", felhasznalo);
          console.log("Jelszó összehasonlítás...");
          const egyezik = await bcryptjs.compare(jelszo, felhasznalo.jelszo);
          if (!egyezik) {
            console.log("Hibás jelszó!");
            return done(null, false, { message: "Hibás jelszó!" });
          }
  
          console.log("Sikeres bejelentkezés!");
          return done(null, felhasznalo);
        } catch (err) {
          console.error("Hiba a bejelentkezés során:", err);
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((felhasznalo, done) => {
    done(null, felhasznalo.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const felhasznalo = await Felhasznalo.findById(id);
      done(null, felhasznalo);
    } catch (err) {
      console.error("Hiba a felhasználó lekérése során:", err);
      done(err);
    }
  });
};