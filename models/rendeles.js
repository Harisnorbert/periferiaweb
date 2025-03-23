const mongoose = require("mongoose");

const RendelesSchema = new mongoose.Schema({
  // Bejelentkezett felhasználó ID-je (ha van)
  felhasznaloId: { type: mongoose.Schema.Types.ObjectId, ref: "Felhasznalo", default: null },

  // A rendeléshez szükséges személyes adatok (bejelentkezés nélkülieknek is)
  nev: { type: String, required: true },
  irsz: { type: String, required: true },
  varos: { type: String, required: true },
  utcaHazszam: { type: String, required: true },
  telefon: { type: String, required: true },
  email: { type: String, required: true },

  // Kosár tartalma
  kosar: [
    {
      nev: String,
      ar: Number,
      leiras: String,
      db:{type:Number,default:1}
    }
  ],

  // Fizetési mód
  fizetesiMod: { type: String, required: true },

  // Rendelés összegének tárolása
  osszAr: { type: Number, required: true },

  // Ha bankkártyás fizetés történt, ezt tároljuk
  kartyaFizetes: { type: Boolean, default: false },

  // Rendelés dátuma
  datum: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Rendeles", RendelesSchema);
