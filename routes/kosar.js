const express = require("express");
const jwt = require("jsonwebtoken");
const Felhasznalo = require("../models/felhasznalo");
const router = express.Router();

// Kosár adatainak lekérése
router.get("/", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Nincs jogosultság" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Felhasznalo.findById(decoded.felhasznaloId);

    if (!user) {
      return res.status(404).json({ message: "Felhasználó nem található" });
    }

    res.json({ kosar: user.kosar || [] });
  } catch (error) {
    console.error("Hiba a kosár lekérésekor:", error);
    res.status(500).json({ message: "Szerverhiba a kosár lekérésekor" });
  }
});

// Kosár frissítése (POST)
router.post("/", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Nincs jogosultság" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { kosar } = req.body;

    const user = await Felhasznalo.findByIdAndUpdate(
      decoded.felhasznaloId,
      { kosar },
      { new: true }
    );

    res.json({ message: "Kosár mentve!", kosar: user.kosar });
  } catch (error) {
    console.error("Hiba a kosár mentésekor:", error);
    res.status(500).json({ message: "Szerverhiba a kosár mentésekor" });
  }
});

module.exports = router;
