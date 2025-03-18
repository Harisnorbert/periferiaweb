const express = require("express");
const router = express.Router();
const Rendeles = require("../models/rendeles");

//Rendelés mentés
router.post("/", async (req, res) => {
  try {
    const { termekek, felhasznalo, vendegAdatok, fizetesiMod, osszAr } = req.body;

    //Kosár tartalma
    if (!termekek || termekek.length === 0) {
      return res.status(400).json({ message: "A rendeléshez legalább egy termék szükséges." });
    }

    if (!felhasznalo) {
      if (!vendegAdatok || !vendegAdatok.nev || !vendegAdatok.email || !vendegAdatok.irsz || !vendegAdatok.varos || !vendegAdatok.utcaHazszam || !vendegAdatok.telefon) {
        return res.status(400).json({ message: "Vendégként minden adatot ki kell tölteni!" });
      }
    }

    const ujRendeles = new Rendeles({
      felhasznalo: felhasznalo || null,
      vendegAdatok: felhasznalo ? null : vendegAdatok, 
      fizetesiMod,
      osszAr,
      kosar: termekek,
      datum: new Date(),
    });

    await ujRendeles.save();
    res.status(201).json({ message: "Rendelés sikeresen mentve!", rendeles: ujRendeles });
  } catch (error) {
    console.error("Hiba a rendelés mentésekor:", error);
    res.status(500).json({ message: "Hiba a rendelés mentésekor." });
  }
});

module.exports = router;
