const User = require('../models/User');
const Computer = require('../models/Computer');
const Betriebssystem = require('../models/Betriebssystem');
const Kategorie = require('../models/Kategorie');
const Student = require('../models/Student');
const mongoose = require('mongoose');

// Hilfsfunktion: Random-Password
const randomPassword = () => Math.random().toString(36).slice(-10);

const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// --- ADMIN: Statistiken ---
exports.getStats = asyncHandler(async (req, res) => {
    const [computer, os, kategorien, studenten] = await Promise.all([
        Computer.countDocuments({}),
        Betriebssystem.countDocuments({}),
        Kategorie.countDocuments({}),
        Student.countDocuments({})
    ]);
    res.json({ computer, betriebssysteme: os, kategorien, studenten });
});

// --- ADMIN: User anlegen ---
exports.createUser = asyncHandler(async (req, res) => {
    const { username, password, role } = req.body;
    if (!username || !password || !role) {
        return res.status(400).json({ error: 'Alle Felder erforderlich!' });
    }
    const user = new User({ username, password, role });
    await user.save();
    res.json({ message: 'User erstellt', user: { username: user.username, role: user.role } });
});

// --- ADMIN: User anzeigen ---
exports.listUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}, '-password');
    res.json(users);
});

// --- ADMIN: Passwort-Reset für User ---
exports.resetPassword = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: 'User nicht gefunden' });
    const newPw = randomPassword();
    user.password = newPw;
    await user.save();
    res.json({ message: 'Passwort zurückgesetzt', password: newPw });
});

// --- ADMIN: OS-Statistik ---
exports.osStats = asyncHandler(async (req, res) => {
    try {
        const collectionName = mongoose.model('Betriebssystem').collection.name;
        const agg = await Computer.aggregate([
            { $match: { deleted: { $ne: true } } },
            { $group: { _id: '$betriebssystem', count: { $sum: 1 } } },
            {
                $addFields: {
                    lookupId: {
                        $cond: [
                            { $ne: ['$_id', null] },
                            { $toObjectId: { $toString: '$_id' } },
                            null
                        ]
                    }
                }
            },
            {
                $lookup: {
                    from: collectionName,
                    localField: 'lookupId',
                    foreignField: '_id',
                    as: 'osObj'
                }
            },
            { $unwind: { path: '$osObj', preserveNullAndEmptyArrays: true } }
        ]);
        const labels = agg.map(x => x.osObj?.name || 'Unbekannt');
        const counts = agg.map(x => x.count);
        res.json({ labels, counts });
    } catch (e) {
        res.status(500).json({ error: 'Fehler beim Laden der OS-Statistik.' });
    }
});
