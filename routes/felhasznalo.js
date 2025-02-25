const express = require("express");
const passport = require("passport");
const Felhasznalo = require("../models/Felhasznalo");
const router = express.Router();

//Regisztráció
router.post("/regisztracio", async (req, res) => {
  const { nev, email, jelszo } = req.body;
  try {
    const ujFelhasznalo = new Felhasznalo({ nev, email, jelszo });
    await ujFelhasznalo.save();
    res.status(201).json({ message: "Sikeres regisztráció!" });
  } catch (err) {
    res.status(400).json({ message: "Hiba a regisztráció során!" });
  }
});

// Bejelentkezés
router.post("/bejelentkezes", (req, res, next) => {
  console.log(req.body);
  passport.authenticate("local", (err, felhasznalo, info) => {
    if (err) return res.status(500).json({ message: "Hiba a bejelentkezés során!" });
    if (!felhasznalo) return res.status(400).json({ message: info.message });

    req.logIn(felhasznalo, (err) => {
      if (err) return res.status(500).json({ message: "Bejelentkezési hiba!" });
      res.json({ message: "Sikeres bejelentkezés!", felhasznalo });
    });
  })(req, res, next);
});

module.exports = router;
