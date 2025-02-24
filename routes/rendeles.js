const express = require('express');
const router = express.Router();
const Rendeles = require('../models/rendeles');

//Rendelés mentése az adatbázisba
router.post('/', async (req, res) => {
  try {
    console.log('Hiba adatok: ', req.body)
    const ujRendeles = new Rendeles(req.body);
    await ujRendeles.save();
    res.status(201).json({ message: 'Rendelés sikeresen mentve!', rendeles: ujRendeles });
  } catch (error) {
    console.error('Hiba a rendelés mentésekor:', error);
    res.status(500).json({ message: 'Hiba a rendelés mentésekor.' });
  }
});

module.exports = router;
