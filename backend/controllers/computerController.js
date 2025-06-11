const Computer = require('../models/Computer');

exports.createComputer = async (req, res) => {
    try {
        const computer = new Computer(req.body);
        await computer.save();
        res.status(201).json(computer);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateComputer = async (req, res) => {
    try {
        const updated = await Computer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.softDeleteComputer = async (req, res) => {
    try {
        const updated = await Computer.findByIdAndUpdate(req.params.id, { deleted: true }, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.restoreComputer = async (req, res) => {
    try {
        const updated = await Computer.findByIdAndUpdate(req.params.id, { deleted: false }, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.filterSearchComputers = async (req, res) => {
    try {
        const { dns, ram, kategorie } = req.query;
        const filter = { deleted: false };

        if (dns) filter.dnsName = { $regex: dns, $options: 'i' };
        if (ram) filter.ram = { $regex: ram, $options: 'i' };
        if (kategorie) filter.kategorie = kategorie;

        const computers = await Computer.find(filter)
            .populate('betriebssystem')
            .populate('kategorie');
        res.json(computers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getComputerById = async (req, res) => {
    try {
        const computer = await Computer.findById(req.params.id)
            .populate('betriebssystem')
            .populate('kategorie');
        res.json(computer);
    } catch (err) {
        res.status(404).json({ error: 'Nicht gefunden' });
    }
};
