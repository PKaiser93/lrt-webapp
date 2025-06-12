const Computer = require('../models/Computer')
const User = require('../models/User')
const ImportLog = require('../models/ImportLog') // Optional, wenn du CSV-Import-Logs speicherst

exports.devicesPerOS = async (req, res) => {
    try {
        const data = await Computer.aggregate([
            { $match: { deleted: { $ne: true } } },
            {
                $group: {
                    _id: '$betriebssystem',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ])

        res.json(data)
    } catch (err) {
        res.status(500).json({ error: 'Fehler bei OS-Auswertung' })
    }
}

exports.countComputer = async (req, res) => {
    try {
        const count = await Computer.countDocuments({ deleted: { $ne: true } })
        res.json({ count })
    } catch (err) {
        res.status(500).json({ error: 'Fehler bei Computer-Zählung' })
    }
}

exports.countUsers = async (req, res) => {
    try {
        const count = await User.countDocuments()
        res.json({ count })
    } catch (err) {
        res.status(500).json({ error: 'Fehler bei Benutzer-Zählung' })
    }
}

exports.countTrash = async (req, res) => {
    try {
        const count = await Computer.countDocuments({ deleted: true })
        res.json({ count })
    } catch (err) {
        res.status(500).json({ error: 'Fehler bei Papierkorb-Zählung' })
    }
}

exports.lastImport = async (req, res) => {
    try {
        const last = await ImportLog.findOne().sort({ createdAt: -1 })
        res.json({ date: last?.createdAt?.toISOString().slice(0, 10) || null })
    } catch (err) {
        res.status(500).json({ error: 'Fehler beim Lesen des letzten Imports' })
    }
}
