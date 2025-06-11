const Betriebssystem = require('../models/Betriebssystem');

exports.createOS = async (req, res) => {
    try {
        const os = new Betriebssystem(req.body);
        await os.save();
        res.status(201).json(os);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateOS = async (req, res) => {
    try {
        const os = await Betriebssystem.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(os);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.softDeleteOS = async (req, res) => {
    try {
        const os = await Betriebssystem.findByIdAndUpdate(req.params.id, { deleted: true }, { new: true });
        res.json(os);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.restoreOS = async (req, res) => {
    try {
        const os = await Betriebssystem.findByIdAndUpdate(req.params.id, { deleted: false }, { new: true });
        res.json(os);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.listOS = async (req, res) => {
    const betriebssysteme = await Betriebssystem.find({ deleted: false });
    res.json(betriebssysteme);
};
