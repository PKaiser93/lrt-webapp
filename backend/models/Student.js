const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },         // Nachname
  vorname: { type: String, required: true },
  idmAccount: { type: String, required: true },
  fauEmail: {
    type: String,
    required: true,
    // optional: Pattern, falls nur @fau.de zugelassen ist:
    match: /^[a-zA-Z0-9._%+-]+@fau\.de$/,
  },
  rechner: { type: String, required: true },      // Gerätename etc.
  betriebssystem: { type: mongoose.Schema.Types.ObjectId, ref: 'Betriebssystem' },
}, { timestamps: true });

module.exports = mongoose.model('Student', StudentSchema);
