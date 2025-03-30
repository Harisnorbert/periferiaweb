const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");


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
      unique: true, 
    },
    jelszo: {
      type: String,
      required: true,
    },
    kosar: {
      type: Array,
      default: [],
    },
    admin:{
      type: Boolean,
      default:false,
    }
  },
  { timestamps: true }
);

// Mielőtt elmentenénk, a jelszót hash-eljük
FelhasznaloSchema.pre("save", async function (next) {
  if (this.isModified("jelszo")) {
    this.jelszo = await bcryptjs.hash(this.jelszo, 10);
  }
  next();
});

const Felhasznalo = mongoose.model("Felhasznalo", FelhasznaloSchema);

module.exports = Felhasznalo;
