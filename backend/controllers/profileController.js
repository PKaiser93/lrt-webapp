// controllers/profileController.js
const bcrypt = require('bcrypt');
const User = require('../models/User');
const asyncHandler = fn => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

exports.getProfile = asyncHandler(async (req, res) => {
    const userId = req.user._id || req.user.id;
    // Hole vollständigen User aus der DB:
    const user = await User.findById(userId).select('username email firstName lastName isAdmin createdAt updatedAt');
    if (!user) {
        return res.status(404).json({ error: 'User nicht gefunden' });
    }
    res.json(user);
});


exports.updateProfile = asyncHandler(async (req, res) => {
    console.log('req.user:', req.user);
    console.log('req.body:', req.body);
    const userId = req.user._id || req.user.id
    // Alle editierbaren Felder holen!
    const { username, email, firstName, lastName } = req.body;

    // Nur Felder aktualisieren, die wirklich im Modell stehen!
    const updateFields = { username, email, firstName, lastName };

    const updated = await User.findByIdAndUpdate(
        userId,
        updateFields,
        { new: true, runValidators: true }
    ).select('username email firstName lastName isAdmin createdAt updatedAt');

    if (!updated) {
        return res.status(404).json({ error: 'User nicht gefunden' })
    }
    res.json(updated)
});


// ─── Passwort ändern ───
exports.changePassword = asyncHandler(async (req, res) => {
    const userId = req.user._id || req.user.id;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Beide Felder erforderlich.' });
    }

    const user = await User.findById(userId).select('+password');
    if (!user) {
        return res.status(404).json({ error: 'User nicht gefunden.' });
    }

    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok) return res.status(400).json({ error: 'Altes Passwort falsch.' });

    const saltRounds = 12;
    user.password = await bcrypt.hash(newPassword, saltRounds);
    await user.save();

    res.json({ success: true });
});

