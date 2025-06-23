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
const AppSetting   = require('../models/AppSetting')
const FeatureFlag  = require('../models/FeatureFlag')
const mongoose = require('mongoose');

// Hilfsfunktion: Random-Password
const randomPassword = () => Math.random().toString(36).slice(-10);

const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req,res,next)).catch(next)

exports.getSettings = asyncHandler(async (req, res) => {
    const maintenance = await AppSetting.findOne({ key: 'maintenanceMode' })
    const flags       = await FeatureFlag.find().lean()
    res.json({
        maintenanceMode: maintenance?.value || false,
        featureFlags: flags
    })
})

exports.updateMaintenance = asyncHandler(async (req, res) => {
    const { enabled } = req.body
    const upd = await AppSetting.findOneAndUpdate(
        { key: 'maintenanceMode' },
        { value: !!enabled },
        { upsert: true, new: true }
    )
    res.json({ maintenanceMode: upd.value })
})

exports.updateFlag = asyncHandler(async (req, res) => {
    const { name } = req.params
    const { enabled } = req.body
    const flag = await FeatureFlag.findOneAndUpdate(
        { name },
        { enabled: !!enabled },
        { new: true }
    )
    if (!flag) return res.status(404).json({ error: 'Feature-Flag nicht gefunden' })
    res.json(flag)
})

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

// --- ADMIN: Letzte Backup ---
exports.getBackup = asyncHandler(async (req, res) => {
    // Verzeichnis, in dem deine Backups liegen
    const backupDir = process.env.BACKUP_DIR || path.resolve(__dirname, '../backups');

    try {
        // Prüfen, ob das Verzeichnis existiert
        await fs.promises.access(backupDir);

        // alle Einträge (Dateien/Ordner) einlesen
        const entries = await fs.promises.readdir(backupDir);
        if (entries.length === 0) {
            return res.status(404).json({ error: 'Keine Backups vorhanden' });
        }

        // mtime aller Einträge ermitteln
        const stats = await Promise.all(
            entries.map(async name => {
                const fullPath = path.join(backupDir, name);
                const st = await fs.promises.stat(fullPath);
                return { name, mtime: st.mtime };
            })
        );

        // Eintrag mit dem neuesten mtime finden
        stats.sort((a, b) => b.mtime - a.mtime);
        const latest = stats[0];

        // Antwort
        res.json({
            filename: latest.name,
            timestamp: latest.mtime.toISOString()
        });
    } catch (err) {
        console.error('Error in getBackup:', err);
        if (err.code === 'ENOENT') {
            return res.status(404).json({ error: 'Backup-Verzeichnis nicht gefunden' });
        }
        res.status(500).json({ error: 'Fehler beim Abrufen des letzten Backups' });
    }
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
