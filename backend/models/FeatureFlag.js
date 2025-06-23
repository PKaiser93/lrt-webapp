// models/FeatureFlag.js
const mongoose = require('mongoose')

const FeatureFlagSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },  // interne Kennung
    label: { type: String, required: true },               // für UI
    enabled: { type: Boolean, default: false }
})

module.exports = mongoose.model('FeatureFlag', FeatureFlagSchema)
