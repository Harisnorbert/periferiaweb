const express = require("express");
const router = express.Router();
const Termek = require("../models/termek");

//Összes termék lekérdezése
router.get("/", async (req, res) => {
  try {
    const termekek = await Termek.find();
    res.status(200).json(termekek);
  } catch (error) {
    res.status(500).json({ message: "Hiba a termékek lekérdezése során!" });
  }
});

//Új termék létrehozása
router.post("/", async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const ujTermek = new Termek({ name, price, description });
    const mentettTermek = await ujTermek.save();
    res.status(201).json(mentettTermek);
  } catch (error) {
    res.status(400).json({ message: "Nem sikerült a termék létrehozása." });
  }
});

module.exports = router;
