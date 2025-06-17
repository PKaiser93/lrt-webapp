const mongoose = require('mongoose');

const BetriebssystemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    deleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Betriebssystem', BetriebssystemSchema, 'betriebssysteme');
