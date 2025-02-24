const express = require('express');
const mongoose = require('mongoose');
const termekRoutes = require('./routes/termek');
const rendelesRoutes = require('./routes/rendeles');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000', // Csak React
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(express.json()); 

//Mongodb kapcsolódás
mongoose.connect('mongodb+srv://Haris00:adminadmin@periferiaweb.kmaoz.mongodb.net/periferiaweb?retryWrites=true&w=majority&appName=periferiaweb')
  .then(() => console.log('MongoDB sikeresen csatlakozott'))
  .catch(err => console.error('MongoDB kapcsolódási hiba:', err));

//Routeok csatlakoztatása
app.use('/termek', termekRoutes);
app.use('/rendeles', rendelesRoutes);
//cors



//Termekek lekerese
app.get('/termek', async (req, res) => {
  try {
    const termekek = await Termek.find();
    res.status(200).json(termekek);
  } catch (hiba) {
    res.status(500).json({ uzenet: 'Nem sikerült lekérni a termékeket.' });
  }
});

//Szerver indítása
app.listen(port, () => {
  console.log(`Szerver fut a ${port} porton`);
});
