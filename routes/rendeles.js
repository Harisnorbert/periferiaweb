const express = require("express");
const router = express.Router();
const Rendeles = require("../models/rendeles");

// **Rendelés mentése az adatbázisba**
router.post("/", async (req, res) => {
  try {
    const { felhasznaloId, nev, irsz, varos, utcaHazszam, telefon, email, kosar, fizetesiMod, osszAr, kartyaAdatok } = req.body;

    // Ellenőrizzük, hogy a kosár nem üres-e
    if (!kosar || kosar.length === 0) {
      return res.status(400).json({ message: "A rendeléshez legalább egy termék szükséges." });
    }

    // Ellenőrizzük, hogy minden szükséges adat megvan-e
    if (!nev || !irsz || !varos || !utcaHazszam || !telefon || !email) {
      return res.status(400).json({ message: "Minden szállítási adat megadása kötelező!" });
    }

    // Ellenőrizzük, hogy az összeg nagyobb-e mint 0
    if (osszAr <= 0) {
      return res.status(400).json({ message: "Hibás rendelési összeg!" });
    }

    // Új rendelés létrehozása
    const ujRendeles = new Rendeles({
      felhasznaloId: felhasznaloId || null, // Ha nincs bejelentkezve, akkor null
      nev,
      irsz,
      varos,
      utcaHazszam,
      telefon,
      email,
      kosar,
      fizetesiMod,
      osszAr,
      kartyaFizetes: fizetesiMod === "bankkártya", // Kártyás fizetés esetén true
      datum: new Date(),
    });

    // Mentés az adatbázisba
    await ujRendeles.save();
    res.status(201).json({ message: "Rendelés sikeresen mentve!", rendeles: ujRendeles });
  } catch (error) {
    console.error("Hiba a rendelés mentésekor:", error);
    res.status(500).json({ message: "Szerverhiba rendelés mentésekor." });
  }
});

router.get("/felhasznalo/:felhasznaloId", async (req, res) => {
  try {
    const rendelesek = await Rendeles.find({ felhasznaloId: req.params.felhasznaloId });
    res.json(rendelesek);
  } catch (error) {
    console.error("Hiba a rendelések lekérésekor:", error);
    res.status(500).json({ message: "Szerverhiba a rendelések lekérésekor." });
  }
});

module.exports = router;
