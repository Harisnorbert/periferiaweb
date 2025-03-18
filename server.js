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

// CORS middleware – Engedélyezzük a hozzáférést a megfelelő domainről
app.use(cors({
  origin: process.env.CORS_ORIGIN || "*",  // Ha csak egy domainre szeretnéd korlátozni: "http://localhost:3000"
  methods: "GET, POST, PUT, DELETE, OPTIONS",
  allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  credentials: true,
}));

// Express beállítások
app.use(express.json());

// Alapértelmezett GET végpont, hogy teszteld a működést
app.get("/", (req, res) => {
  res.status(200).json({ message: "Szerver fut és CORS engedélyezve van!" });
});

// API végpontok beállítása
app.use("/kosar", kosarRoutes);
app.use("/felhasznalo", felhasznaloRoutes);
app.use("/termekek", termekRoutes);
app.use("/rendeles", rendelesRoutes);

// Statikus fájlok kiszolgálása
app.use(express.static(path.join(__dirname, "public")));

// MongoDB kapcsolat (környezeti változóban tárolt URI használata)
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB sikeresen csatlakozott"))
  .catch((err) => console.error("❌ MongoDB kapcsolódási hiba:", err));

// Az összes regisztrált route kiírása
app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log(`🛠️ Registered route: ${r.route.path}`);
  }
});

// Szerver indítása
app.listen(port, () => {
  console.log(`Szerver fut a ${port} porton`);
});
