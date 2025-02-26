const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const FelhasznaloSchema = new mongoose.Schema({
  nev: { type: String, required: true },
  irsz: { type: String, required: true },
  varos: { type: String, required: true },
  utcaHazszam: { type: String, required: true },
  telefon: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  jelszo: { type: String, required: true }
});

// Jelszó hashelés mentés előtt
FelhasznaloSchema.pre("save", async function (next) {
  if (!this.isModified("jelszo")) return next();
  const salt = await bcrypt.genSalt(10);
  this.jelszo = await bcrypt.hash(this.jelszo, salt);
  next();
});

// Jelszó ellenőrzés
FelhasznaloSchema.methods.validPassword = function (jelszo) {
  return bcrypt.compare(jelszo, this.jelszo);
};

module.exports = mongoose.model("Felhasznalo", FelhasznaloSchema);
