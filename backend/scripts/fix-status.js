// scripts/fix-status.js
const mongoose = require('mongoose');
const Computer = require('../models/Computer'); // Pfad ggf. anpassen

async function run() {
    // 1) Mit deiner DB verbinden
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lrtdb', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    console.log('🔌 Verbunden mit MongoDB');

    // 2) Query: alle ohne status-Feld ODER mit status null/"" anpassen
    const filter = {
        $or: [
            { status: { $exists: false } },
            { status: null },
            { status: '' }
        ]
    };

    const res = await Computer.updateMany(
        filter,
        { $set: { status: 'unbekannt' } }
    );

    console.log(`✅ ${res.nModified} Datensätze auf 'unbekannt' gesetzt.`);

    // 3) Verbindung schließen
    await mongoose.disconnect();
    console.log('🔌 Verbindung geschlossen');
}

run().catch(err => {
    console.error('❌ Migration fehlgeschlagen:', err);
    process.exit(1);
});
