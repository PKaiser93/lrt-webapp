// migrateRamToInt.js
const mongoose = require('mongoose');
const Computer = require('../models/Computer'); // ggf. Pfad anpassen

async function run() {
    await mongoose.connect('mongodb://localhost:27017/lrtdb', {
        useNewUrlParser: true, useUnifiedTopology: true,
    });

    const all = await Computer.find({});
    let updated = 0, skipped = 0;
    for (const comp of all) {
        let orig = comp.ram;
        // Wenn Zahl, fertig
        if (typeof orig === 'number') { skipped++; continue; }
        // String auswerten
        if (!orig || typeof orig !== 'string') { comp.ram = null; }
        else {
            let num = parseInt(orig.replace(/[^\d]/g, ''), 10);
            if (isNaN(num)) comp.ram = null;
            else comp.ram = num;
        }
        await comp.save();
        updated++;
    }
    console.log(`RAM Migration done! Updated: ${updated}, Skipped: ${skipped}`);
    await mongoose.disconnect();
}
run();
