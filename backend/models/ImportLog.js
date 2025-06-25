const mongoose = require('mongoose');

const ImportLogSchema = new mongoose.Schema({
  source: { type: String, required: true },
  count: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('ImportLog', ImportLogSchema);
