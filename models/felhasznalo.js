const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

// Felhasználó sémája
const FelhasznaloSchema = new mongoose.Schema(
  {
    nev: {
      type: String,
      required: true,
    },
    irsz: {
      type: String,
      required: true,
    },
    varos: {
      type: String,
      required: true,
    },
    utcaHazszam: {
      type: String,
      required: true,
    },
    telefon: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,  // Az email cím egyedinek kell lennie
    },
    jelszo: {
      type: String,
      required: true,
    },
    kosar: {
      type: Array,
      default: [],  // Alapértelmezett üres kosár
    },
  },
  { timestamps: true }  // Nyomon követhetjük a létrehozás és frissítés időpontját
);

// Mielőtt elmentenénk, a jelszót hash-eljük
FelhasznaloSchema.pre("save", async function (next) {
  if (this.isModified("jelszo")) {
    this.jelszo = await bcryptjs.hash(this.jelszo, 10);  // Jelszó hash-elése a bcryptjs segítségével
  }
  next();
});

// A Felhasznalo modell létrehozása
const Felhasznalo = mongoose.model("Felhasznalo", FelhasznaloSchema);

module.exports = Felhasznalo;
