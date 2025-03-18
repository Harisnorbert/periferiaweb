const mongoose = require("mongoose");

const TermekSchema = new mongoose.Schema({
  nev: String,
  ar: Number,
  leiras: String
});

const RendelesSchema = new mongoose.Schema({
  felhasznalo: { type: mongoose.Schema.Types.ObjectId, ref: "Felhasznalo", default: null }, // Bejelentkezett felhasználó
  vendegAdatok: {
    nev: { type: String },
    irsz: { type: String },
    varos: { type: String },
    utcaHazszam: { type: String },
    telefon: { type: String },
    email: { type: String },
  },
  fizetesiMod: { type: String, required: true },
  osszAr: { type: Number, required: true },
  kosar: [TermekSchema],
  datum: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Rendeles", RendelesSchema);
