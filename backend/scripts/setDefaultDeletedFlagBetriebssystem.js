// scripts/setDefaultDeletedFlagBetriebssystem.js
const mongoose = require('mongoose')
const Betriebssystem = require('../models/Betriebssystem')

;(async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/lrtdb')
        const result = await Betriebssystem.updateMany(
            { deleted: { $exists: false } },
            { $set: { deleted: false } }
        )
        console.log(`✅ Migration abgeschlossen: ${result.modifiedCount} aktualisiert`)
        process.exit(0)
    } catch (err) {
        console.error('❌ Migration fehlgeschlagen:', err.message)
        process.exit(1)
    }
})()
