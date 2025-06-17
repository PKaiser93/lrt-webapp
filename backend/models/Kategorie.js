const mongoose = require('mongoose');

const KategorieSchema = new mongoose.Schema({
    bezeichnung: { type: String, required: true },
    beschreibung: String,
    farbe: {
        type: String,
        // optional: Pattern für HEX-Farben, falls relevant
        match: /^#([0-9A-Fa-f]{3}){1,2}$/,
    },
    deleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Kategorie', KategorieSchema, 'kategories');
