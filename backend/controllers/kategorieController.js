const Kategorie = require('../models/Kategorie');

exports.createKategorie = async (req, res) => {
    try {
        const kategorie = new Kategorie(req.body);
        await kategorie.save();
        res.status(201).json(kategorie);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateKategorie = async (req, res) => {
    try {
        const kategorie = await Kategorie.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(kategorie);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.softDeleteKategorie = async (req, res) => {
    try {
        const kategorie = await Kategorie.findByIdAndUpdate(req.params.id, { deleted: true }, { new: true });
        res.json(kategorie);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.restoreKategorie = async (req, res) => {
    try {
        const kategorie = await Kategorie.findByIdAndUpdate(req.params.id, { deleted: false }, { new: true });
        res.json(kategorie);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.listKategorien = async (req, res) => {
    const kategorien = await Kategorie.find({ deleted: false });
    res.json(kategorien);
};
