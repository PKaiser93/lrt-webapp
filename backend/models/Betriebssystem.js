const mongoose = require('mongoose');

const BetriebssystemSchema = new mongoose.Schema({
    name: String,
    deleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Betriebssystem', BetriebssystemSchema);
