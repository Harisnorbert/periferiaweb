const mongoose = require('mongoose');
const TermekSchema = new mongoose.Schema({
    nev: String,
    ar: Number,
    leiras: String
  });

const RendelesSchema = new mongoose.Schema({
  nev: { type: String, required: true },
  irsz: { type: String, required: true },
  varos: { type: String, required: true },
  utcaHazszam: { type: String, required: true },
  telefon: { type: String, required: true },
  email: { type: String, required: true },
  fizetesiMod: { type: String, required: true },
  osszAr: { type: Number, required: true },
  kosar: [TermekSchema],
  datum: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Rendeles', RendelesSchema);
