const mongoose = require('mongoose')

const ImportLogSchema = new mongoose.Schema({
    source: String,
    count: Number,
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('ImportLog', ImportLogSchema)
