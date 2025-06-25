const mongoose = require('mongoose');

const DataRequestSchema = new mongoose.Schema({
  user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type:       { type: String, enum: ['export', 'delete'], required: true },
  status:     { type: String, enum: ['pending', 'in_progress', 'complete', 'rejected'], default: 'pending' },
  fileUrl:    { type: String }, // bei Export: Link zur ZIP/JSON-Datei
}, { timestamps: true });

module.exports = mongoose.model('DataRequest', DataRequestSchema);
