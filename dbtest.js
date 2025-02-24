const mongoose = require('mongoose');
const Termek = require('./models/termek');

mongoose.connect('mongodb+srv://Haris00:adminadmin@periferiaweb.kmaoz.mongodb.net/periferiaweb?retryWrites=true&w=majority&appName=periferiaweb')
  .then(async () => {
    console.log('✅ MongoDB kapcsolódás sikeres');
    const termekek = await Termek.find();
    console.log('📦 Lekérdezett termékek:', termekek);
    process.exit(0);
  })
  .catch(err => console.error('❌ Hiba:', err));