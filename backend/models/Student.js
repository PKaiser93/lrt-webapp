const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    name: { type: String, required: true },        // Nachname
    vorname: { type: String, required: true },
    idmAccount: { type: String, required: true },
    fauEmail: { type: String, required: true },
    rechner: { type: String, required: true },     // z.B. personalisiert oder Gerätename, Pool-Rechner etc.
    betriebssystem: { type: mongoose.Schema.Types.ObjectId, ref: 'Betriebssystem', required: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', StudentSchema);
