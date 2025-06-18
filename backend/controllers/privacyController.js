const DataRequest = require('../models/DataRequest');
const User        = require('../models/User');
const bcrypt      = require('bcrypt');

const asyncHandler = fn => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// — Liste aller Requests (Admin)
exports.listRequests = asyncHandler(async (req, res) => {
    const list = await DataRequest
        .find()
        .populate('user', 'username email')
        .sort('-createdAt');
    res.json(list);
});

// — Neuen Request anlegen (User)
exports.createRequest = asyncHandler(async (req, res) => {
    const { type } = req.body;
    if (!['export','delete'].includes(type))
        return res.status(400).json({ error: 'Ungültiger Typ' });

    // kein Zweit‑Request, solange ein alter noch pending ist
    const existing = await DataRequest.findOne({
        user: req.user._id, type, status: 'pending'
    });
    if (existing)
        return res.status(400).json({ error: 'Es gibt bereits einen offenen Request.' });

    const dr = await DataRequest.create({ user: req.user._id, type });
    res.status(201).json(dr);
});

// — Request updaten (Status ändern, fileUrl setzen) (Admin)
exports.updateRequest = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status, fileUrl } = req.body;

    const dr = await DataRequest.findById(id);
    if (!dr) return res.status(404).json({ error: 'Request nicht gefunden' });

    // Status‑Check
    if (status) {
        if (!['pending','in_progress','complete','rejected'].includes(status))
            return res.status(400).json({ error: 'Ungültiger Status' });
        dr.status = status;
    }
    if (fileUrl) dr.fileUrl = fileUrl;
    await dr.save();

    // — Bei Lösch‑Request und complete: „Right to be forgotten“ ausführen
    if (dr.type === 'delete' && dr.status === 'complete') {
        // Beispiel: username auf pseudonym setzen, email & persönliche Felder löschen
        await User.findByIdAndUpdate(dr.user, {
            username: `deleted_${dr.user}`,
            email:    null,
            // ggf. weitere Felder hier löschen...
        });
    }

    res.json(dr);
});
