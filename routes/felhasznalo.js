const express = require("express");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const flash = require("connect-flash");
const Felhasznalo = require("../models/felhasznalo");
const router = express.Router();

// Express Session konfiguráció
router.use(
  session({
    secret: "valamilyen_titkos_kulcs", // Fontos: cseréld le egy biztonságos kulcsra!
    resave: false,
    saveUninitialized: false,
  })
);

// Passport middleware inicializálása
router.use(passport.initialize());
router.use(passport.session());
router.use(flash());

// Passport konfiguráció
passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, jelszo, done) => {
      try {
        const felhasznalo = await Felhasznalo.findOne({ email });
        if (!felhasznalo) {
          return done(null, false, { message: "Hibás email vagy jelszó!" });
        }

        const jelszoEllenorzes = await bcrypt.compare(jelszo, felhasznalo.jelszo);
        if (!jelszoEllenorzes) {
          return done(null, false, { message: "Hibás email vagy jelszó!" });
        }

        return done(null, felhasznalo);
      } catch (err) {
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
    done(err);
  }
});

// Regisztráció
router.post("/regisztracio", async (req, res) => {
  const { nev, irsz, varos, utcaHazszam, telefon, email, jelszo } = req.body;
  try {
    if (!nev || !irsz || !varos || !utcaHazszam || !telefon || !email || !jelszo) {
      return res.status(400).json({ message: "Minden mező kitöltése kötelező!" });
    }

    const letezoFelhasznalo = await Felhasznalo.findOne({ email });
    if (letezoFelhasznalo) {
      return res
        .status(400)
        .json({ message: "Ez az email cím már létezik, kérlek jelentkezz be!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(jelszo, salt);

    const ujFelhasznalo = new Felhasznalo({
      nev,
      irsz,
      varos,
      utcaHazszam,
      telefon,
      email,
      jelszo: hashedPassword,
    });

    await ujFelhasznalo.save();
    res.status(201).json({ message: "Felhasználó sikeresen létrehozva!" });
  } catch (err) {
    console.error("Hiba a regisztráció során:", err);
    res.status(500).json({ message: "Hiba a regisztráció során!" });
  }
});

// Bejelentkezés
router.post(
  "/bejelentkezes",
  passport.authenticate("local", {
    successRedirect: "/sikeres-bejelentkezes", // Átirányítás sikeres bejelentkezés esetén
    failureRedirect: "/sikertelen-bejelentkezes", // Átirányítás sikertelen bejelentkezés esetén
    failureFlash: true,
  })
);

// Sikeres bejelentkezés útvonal
router.get("/sikeres-bejelentkezes", (req, res) => {
  res.json({ message: "Sikeres bejelentkezés!", felhasznalo: req.user });
});

// Sikertelen bejelentkezés útvonal
router.get("/sikertelen-bejelentkezes", (req, res) => {
  res.status(401).json({ message: req.flash("error")[0] });
});

module.exports = router;