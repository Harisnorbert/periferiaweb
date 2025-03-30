const mongoose = require("mongoose");

const RendelesSchema = new mongoose.Schema({

  felhasznaloId: { type: mongoose.Schema.Types.ObjectId, ref: "Felhasznalo", default: null },

  nev: { type: String, required: true },
  irsz: { type: String, required: true },
  varos: { type: String, required: true },
  utcaHazszam: { type: String, required: true },
  telefon: { type: String, required: true },
  email: { type: String, required: true },

  kosar: [
    {
      nev: String,
      ar: Number,
      leiras: String,
      db:{type:Number,default:1}
    }
  ],

  fizetesiMod: { type: String, required: true },

  osszAr: { type: Number, required: true },

  kartyaFizetes: { type: Boolean, default: false },

  datum: { type: Date, default: Date.now },

  statusz: {
    type: String,
    default: "Függőben",
    enum: ["Függőben", "Feldolgozás alatt", "Teljesítve"]
  },
  
});

module.exports = mongoose.model("Rendeles", RendelesSchema);
