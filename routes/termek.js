const express = require("express");
const router = express.Router();
const Termek = require("../models/termek");

//Összes termék lekérdezése
router.get("/", async (req, res) => {
  try {
    const termekek = await Termek.find();
    res.status(200).json(termekek);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Új termék létrehozása
router.post("/", async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const ujTermek = new Termek({ name, price, description });
    const mentettTermekek = await ujTermek.save();
    res.status(201).json(mentettTermekek);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
