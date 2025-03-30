const mongoose = require("mongoose");

const termekSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  category: String,
  imageUrl: String,
});

module.exports = mongoose.model("Termek", termekSchema, "termeks");
