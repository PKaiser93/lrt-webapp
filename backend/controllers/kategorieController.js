const Kategorie = require('../models/Kategorie')

exports.createKategorie = async (req, res) => {
    try {
        const { bezeichnung, beschreibung, farbe } = req.body
        const kat = await Kategorie.create({ bezeichnung, beschreibung, farbe, deleted: false })
        res.status(201).json(kat)
    } catch (err) {
        res.status(500).json({ error: 'Fehler beim Anlegen', details: err.message })
    }
}

exports.updateKategorie = async (req, res) => {
    try {
        const kategorie = await Kategorie.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.json(kategorie)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

exports.softDeleteKategorie = async (req, res) => {
    try {
        console.log('🧪 Soft Delete ID:', req.params.id)
        const updated = await Kategorie.findByIdAndUpdate(req.params.id, { deleted: true })
        if (!updated) return res.status(404).json({ error: 'Kategorie nicht gefunden' })
        res.status(200).json({ message: 'Soft Delete erfolgreich' })
    } catch (err) {
        console.error('❌ Fehler beim Soft Delete:', err)
        res.status(500).json({ error: 'Fehler beim Löschen', details: err.message })
    }
}


exports.restoreKategorie = async (req, res) => {
    try {
        await Kategorie.findByIdAndUpdate(req.params.id, { deleted: false })
        res.status(200).json({ message: 'Kategorie wiederhergestellt' })
    } catch (err) {
        res.status(500).json({ error: 'Fehler beim Wiederherstellen', details: err.message })
    }
}

exports.listKategorien = async (req, res) => {
    try {
        const query = req.query.deleted === 'true' ? { deleted: true } : { deleted: { $ne: true } }
        const kategorien = await Kategorie.find(query)
        res.json(kategorien)
    } catch (err) {
        res.status(500).json({ error: 'Fehler beim Laden der Kategorien', details: err.message })
    }
}

exports.listTrashKategorien = async (req, res) => {
    try {
        const kategorien = await Kategorie.find({ deleted: true })
        res.json(kategorien)
    } catch (err) {
        res.status(500).json({ error: 'Fehler beim Laden der gelöschten Kategorien', details: err.message })
    }
}

exports.deleteTrash = async (req, res) => {
    try {
        const gelöschte = await Kategorie.find({ deleted: true });
        console.log('🧾 Zu löschende Kategorien:', gelöschte);

        const result = await Kategorie.deleteMany({ deleted: true });
        console.log(`🧹 ${result.deletedCount} Kategorien endgültig gelöscht`);

        res.status(200).json({ message: `${result.deletedCount} Kategorien gelöscht.` });
    } catch (err) {
        console.error('❌ Fehler beim Hard Delete:', err); // LOG VOLLER ERROR STACK
        res.status(500).json({ error: 'Fehler beim endgültigen Löschen', details: err.stack });
    }
};



