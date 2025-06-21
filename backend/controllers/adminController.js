const fs = require('fs');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const User = require('../models/User');
const bcrypt = require('bcrypt');
const Computer = require('../models/Computer');
const Betriebssystem = require('../models/Betriebssystem');
const Kategorie = require('../models/Kategorie');
const Student = require('../models/Student');
const mongoose = require('mongoose');

// Hilfsfunktion: Random-Password
const randomPassword = () => Math.random().toString(36).slice(-10);

const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

exports.backupDatabase = asyncHandler(async (req, res) => {
    // Verzeichnis für Backups (env oder Standard)
    const backupDir = process.env.BACKUP_DIR || path.resolve(__dirname, '../backups');
    // Timestamp für Dateinamen
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outPath = path.join(backupDir, `backup-${timestamp}`);

    // Backup‑Verzeichnis anlegen
    await fs.promises.mkdir(outPath, { recursive: true });

    // mongodump ausführen (stellt sicher, dass `mongodump` im PATH ist)
    const cmd = `mongodump --uri="${process.env.MONGO_URI}" --out="${outPath}"`;
    await exec(cmd);

    res.json({
        message: 'Backup erfolgreich erstellt',
        path: outPath
    });
});

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
    const { username, email, password, isAdmin } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Alle Felder erforderlich!' });
    }

    const exists = await User.findOne({ username });
    if (exists) {
        return res.status(400).json({ error: 'Benutzername existiert bereits!' });
    }

    const saltRounds = 12;
    const hashedPwd = await bcrypt.hash(password, saltRounds);

    const user = new User({
        username,
        email,
        password: hashedPwd,
        isAdmin: !!isAdmin
    });

    await user.save();

    res.json({
        message: 'User erstellt',
        user: { username: user.username, email: user.email, isAdmin: user.isAdmin }
    });
});


// --- ADMIN: User löschen ---
exports.deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
        return res.status(404).json({ error: 'User nicht gefunden.' });
    }
    res.status(200).json({ message: 'User erfolgreich gelöscht.' });
});

// --- ADMIN: User anzeigen ---
exports.listUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}, 'username email isAdmin').lean();
    res.json(users);
});

// --- ADMIN: Toggle admin ---
exports.toggleAdmin = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: 'User nicht gefunden' });
    user.isAdmin = !user.isAdmin;
    await user.save();
    res.json({ username: user.username, isAdmin: user.isAdmin });
});

// --- ADMIN: Passwort-Reset für User ---
exports.resetPassword = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: 'User nicht gefunden' });

    // neues Passwort generieren
    const newPw = randomPassword();

    // Passwort hashen
    const saltRounds  = 12;
    const hashedPw    = await bcrypt.hash(newPw, saltRounds);

    // gehashtes Passwort speichern
    user.password = hashedPw;
    await user.save();

    // im Response nur das Klartext-Passwort zurückgeben
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
