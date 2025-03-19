const express = require("express");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Felhasznalo = require("../models/felhasznalo");
const router = express.Router();

// **Regisztráció**
router.post("/regisztracio", async (req, res) => {
  const { nev, irsz, varos, utcaHazszam, telefon, email, jelszo } = req.body;
  try {
    const letezoFelhasznalo = await Felhasznalo.findOne({ email });
    if (letezoFelhasznalo) {
      return res.status(400).json({ message: "Ez az email cím már létezik!" });
    }

    const hashedJelszo = await bcryptjs.hash(jelszo, 10); // Jelszó titkosítása
    const ujFelhasznalo = new Felhasznalo({
      nev,
      irsz,
      varos,
      utcaHazszam,
      telefon,
      email,
      jelszo: hashedJelszo,
    });

    await ujFelhasznalo.save();
    res.status(201).json({ message: "Sikeres regisztráció!" });
  } catch (err) {
    console.error("Hiba a regisztráció során:", err);
    res.status(500).json({ message: "Hiba a regisztráció során!" });
  }
});

// **Bejelentkezés**
router.post("/bejelentkezes", async (req, res) => {
  const { email, jelszo } = req.body;
  try {
    const felhasznalo = await Felhasznalo.findOne({ email });
    if (!felhasznalo) {
      return res.status(401).json({ message: "Nincs ilyen e-mail cím!" });
    }

    const egyezik = await bcryptjs.compare(jelszo, felhasznalo.jelszo);
    if (!egyezik) {
      return res.status(401).json({ message: "Hibás jelszó!" });
    }

    const token = jwt.sign(
      { felhasznaloId: felhasznalo._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, felhasznalo, message: "Sikeres bejelentkezés!" });
  } catch (err) {
    console.error("Hiba a bejelentkezés során:", err);
    res.status(500).json({ message: "Hiba a bejelentkezés során!" });
  }
});

// **Felhasználó adatainak lekérése (védett végpont)**
router.get("/", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];  
    if (!token) {
      return res.status(401).json({ message: "Nincs jogosultság" });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({ error: "jwt expired" });
        }
        return res.status(403).json({ message: "Érvénytelen token" });
      }

      const user = await Felhasznalo.findById(decoded.felhasznaloId);
      if (!user) {
        return res.status(404).json({ message: "Felhasználó nem található" });
      }

      res.json({ felhasznalo: user });
    });
  } catch (error) {
    console.error("Hiba a felhasználó lekérésekor:", error);
    res.status(500).json({ message: "Szerverhiba a felhasználó lekérésekor" });
  }
});

// **Token frissítés (új végpont)**
router.post("/refresh-token", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];  
    if (!token) {
      return res.status(401).json({ message: "Nincs jogosultság" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          // Új token generálása
          const ujToken = jwt.sign(
            { felhasznaloId: decoded.felhasznaloId },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
          );

          return res.json({ token: ujToken });
        }
        return res.status(403).json({ message: "Érvénytelen token" });
      }

      // Ha a token még érvényes, nem kell frissíteni
      res.json({ token });
    });
  } catch (error) {
    console.error("Hiba a token frissítésekor:", error);
    res.status(500).json({ message: "Szerverhiba a token frissítésekor" });
  }
});

module.exports = router;
