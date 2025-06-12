const mongoose = require('mongoose')

const KategorieSchema = new mongoose.Schema({
    bezeichnung: String,
    beschreibung: String,
    farbe: String,
    deleted: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Kategorie', KategorieSchema, 'kategories')
