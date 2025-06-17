// scripts/migrate_computer_schema.js

const mongoose = require('mongoose');
require('dotenv').config();

const Computer = require('../models/Computer');

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Verbunden mit MongoDB');

        // Alle Computer-Dokumente abrufen
        const computers = await Computer.find({});
        let updates = 0;

        for (const comp of computers) {
            let changed = false;

            // 1. dhcp: 'ja'/'nein' → Boolean
            if (typeof comp.dhcp === 'string') {
                if (comp.dhcp.toLowerCase() === 'ja') {
                    comp.dhcp = true;
                    changed = true;
                } else if (comp.dhcp.toLowerCase() === 'nein') {
                    comp.dhcp = false;
                    changed = true;
                }
            }

            // 2. startdatum & abgabe: String → Date (ISO-Format oder deutsches Format)
            ['startdatum', 'abgabe'].forEach(field => {
                if (comp[field] && typeof comp[field] === 'string') {
                    // Versuche zuerst direkt umzuwandeln (ISO-Format)
                    let date = new Date(comp[field]);
                    if (!isNaN(date.getTime())) {
                        comp[field] = date;
                        changed = true;
                    } else {
                        // Deutsches Format DD.MM.YYYY
                        const parts = comp[field].split('.');
                        if (parts.length === 3) {
                            date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
                            if (!isNaN(date.getTime())) {
                                comp[field] = date;
                                changed = true;
                            }
                        }
                    }
                }
            });

            if (changed) {
                await comp.save();
                updates++;
            }
        }

        console.log(`🔄 Migration abgeschlossen. ${updates} Dokumente wurden angepasst.`);
        mongoose.disconnect();
    } catch (err) {
        console.error('❌ Fehler bei der Migration:', err);
        mongoose.disconnect();
        process.exit(1);
    }
})();
