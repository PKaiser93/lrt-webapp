const mongoose = require('mongoose');

const KategorieSchema = new mongoose.Schema({
    name: String,
    farbe: String,
    deleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Kategorie', KategorieSchema);
