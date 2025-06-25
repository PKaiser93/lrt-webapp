// models/AppSetting.js
const mongoose = require('mongoose');

const AppSettingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },   // z.B. "maintenanceMode"
  value: { type: mongoose.Schema.Types.Mixed, required: true },
});

module.exports = mongoose.model('AppSetting', AppSettingSchema);
