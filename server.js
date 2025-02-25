const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const termekRoutes = require("./routes/termek");
const rendelesRoutes = require("./routes/rendeles");
const felhasznaloRoutes = require("./routes/felhasznalo");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

//Middlewarek
app.use(express.json());
app.use(session({
  secret: "titkoskulcs",
  resave: false,
  saveUninitialized: false
}));

//Passport
require("./config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

//CORS
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

//MongoDB
mongoose.connect("mongodb+srv://Haris00:adminadmin@periferiaweb.kmaoz.mongodb.net/periferiaweb?retryWrites=true&w=majority&appName=periferiaweb")
  .then(() => console.log("MongoDB sikeresen csatlakozott"))
  .catch(err => console.error("MongoDB kapcsolódási hiba:", err));

//Routeok
app.use("/termek", termekRoutes);
app.use("/rendeles", rendelesRoutes);
app.use("/felhasznalo", felhasznaloRoutes);

//Termékek lekérése
app.get("/termek", async (req, res) => {
  try {
    const termekek = await Termek.find();
    res.status(200).json(termekek);
  } catch (hiba) {
    res.status(500).json({ uzenet: "Nem sikerült lekérni a termékeket." });
  }
});

//Szerver indítása
app.listen(port, () => {
  console.log(`Szerver fut a ${port} porton`);
});
