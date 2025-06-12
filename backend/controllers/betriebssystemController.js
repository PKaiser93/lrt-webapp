const Betriebssystem = require('../models/Betriebssystem')

exports.create = async (req, res) => {
    try {
        const { name } = req.body
        const created = await Betriebssystem.create({ name })
        res.status(201).json(created)
    } catch (err) {
        res.status(500).json({ error: 'Fehler beim Anlegen', details: err.message })
    }
}

exports.update = async (req, res) => {
    try {
        const { name } = req.body
        const updated = await Betriebssystem.findByIdAndUpdate(req.params.id, { name }, { new: true })
        res.json(updated)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

exports.softDelete = async (req, res) => {
    try {
        await Betriebssystem.findByIdAndUpdate(req.params.id, { deleted: true })
        res.status(200).json({ message: 'Soft Delete erfolgreich' })
    } catch (err) {
        res.status(500).json({ error: 'Fehler beim Soft Delete', details: err.message })
    }
}

exports.restore = async (req, res) => {
    try {
        await Betriebssystem.findByIdAndUpdate(req.params.id, { deleted: false })
        res.status(200).json({ message: 'Wiederhergestellt' })
    } catch (err) {
        res.status(500).json({ error: 'Fehler beim Wiederherstellen', details: err.message })
    }
}

exports.list = async (req, res) => {
    try {
        const query = req.query.deleted === 'true' ? { deleted: true } : { deleted: { $ne: true } }
        const list = await Betriebssystem.find(query)
        res.json(list)
    } catch (err) {
        res.status(500).json({ error: 'Fehler beim Laden', details: err.message })
    }
}

exports.bulkImport = async (req, res) => {
    try {
        const daten = req.body.map(item => ({ name: item.name }))
        await Betriebssystem.insertMany(daten)
        res.status(200).json({ message: 'Import erfolgreich' })
    } catch (err) {
        res.status(500).json({ error: 'Fehler beim Import', details: err.message })
    }
}

exports.hardDeleteAll = async (req, res) => {
    try {
        const result = await Betriebssystem.deleteMany({ deleted: true })
        res.status(200).json({ message: `${result.deletedCount} Betriebssysteme gelöscht.` })
    } catch (err) {
        res.status(500).json({ error: 'Fehler beim Hard Delete', details: err.message })
    }
}

exports.listTrash = async (req, res) => {
    try {
        const list = await Betriebssystem.find({ deleted: true })
        res.json(list)
    } catch (err) {
        res.status(500).json({ error: 'Fehler beim Laden der gelöschten Betriebssysteme', details: err.message })
    }
}
