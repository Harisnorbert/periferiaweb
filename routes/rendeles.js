const express = require("express");
const router = express.Router();
const Rendeles = require("../models/rendeles");

router.post("/", async (req, res) => {
  try {
    const { felhasznaloId, nev, irsz, varos, utcaHazszam, telefon, email, kosar, fizetesiMod, osszAr, kartyaAdatok } = req.body;

    if (!kosar || kosar.length === 0) {
      return res.status(400).json({ message: "A rendeléshez legalább egy termék szükséges." });
    }

    if (!nev || !irsz || !varos || !utcaHazszam || !telefon || !email) {
      return res.status(400).json({ message: "Minden szállítási adat megadása kötelező!" });
    }

    if (osszAr <= 0) {
      return res.status(400).json({ message: "Hibás rendelési összeg!" });
    }

    const ujRendeles = new Rendeles({
      felhasznaloId: felhasznaloId || null,
      nev,
      irsz,
      varos,
      utcaHazszam,
      telefon,
      email,
      kosar,
      fizetesiMod,
      osszAr,
      kartyaFizetes: fizetesiMod === "bankkártya",
      datum: new Date(),
    });

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

router.get("/trend", async (req, res) => {
  try {
    const stat = await Rendeles.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$datum" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(stat);
  } catch (err) {
    console.error("Hiba a rendelési statisztika lekérdezésekor:", err);
    res.status(500).json({ message: "Szerverhiba a statisztika lekérésénél" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const frissitett = await Rendeles.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(frissitett);
  } catch (err) {
    console.error("Rendelés státusz frissítése sikertelen:", err);
    res.status(500).json({ message: "Hiba a rendelés frissítésénél!" });
  }
});

router.get("/", async (req, res) => {
  try {
    const rendelesek = await Rendeles.find().sort({ datum: -1 });
    res.json(rendelesek);
  } catch (err) {
    console.error("Hiba a rendelések lekérdezésekor:", err);
    res.status(500).json({ message: "Nem sikerült lekérni a rendeléseket" });
  }
});


module.exports = router;
