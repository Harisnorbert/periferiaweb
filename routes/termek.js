const express = require("express");
const router = express.Router();
const Termek = require("../models/termek");

router.get("/", async (req, res) => {
  try {
    const termekek = await Termek.find();
    res.status(200).json(termekek);
  } catch (error) {
    res.status(500).json({ message: "Hiba a termékek lekérdezése során!" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const frissitett = await Termek.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(frissitett);
  } catch (err) {
    console.error(" PUT hiba:", err);
    res.status(500).json({ message: "Nem sikerült frissíteni a terméket" });
  }
});

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

router.delete("/:id", async (req, res) => {
  try {
    await Termek.findByIdAndDelete(req.params.id);
    res.json({ message: "Termék törölve" });
  } catch (err) {
    console.error("DELETE hiba:", err);
    res.status(500).json({ message: "Nem sikerült törölni a terméket" });
  }
});

module.exports = router;
