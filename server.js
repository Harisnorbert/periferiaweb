require("dotenv").config();  // Környezeti változók betöltése

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const felhasznaloRoutes = require("./routes/felhasznalo");
const termekRoutes = require("./routes/termek");
const rendelesRoutes = require("./routes/rendeles");
const kosarRoutes = require("./routes/kosar");



const app = express();
const port = process.env.PORT || 5000;


app.use(cors({
  origin: process.env.CORS_ORIGIN || "*",  
  methods: "GET, POST, PUT, DELETE, OPTIONS",
  allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  credentials: true,
}));


app.use(express.json());


app.get("/", (req, res) => {
  res.status(200).json({ message: "Szerver fut és CORS engedélyezve van!" });
});


app.use("/kosar", kosarRoutes);
app.use("/felhasznalo", felhasznaloRoutes);
app.use("/termekek", termekRoutes);
app.use("/rendeles", rendelesRoutes);

app.use(express.static(path.join(__dirname, "public")));

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB sikeresen csatlakozott"))
  .catch((err) => console.error("MongoDB kapcsolódási hiba:", err));

app.listen(port, () => {
  console.log(`Szerver fut a ${port} porton`);
});
