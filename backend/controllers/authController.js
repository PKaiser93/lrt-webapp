const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

exports.login = async (req, res) => {
    const { username, password } = req.body
    if (!username || !password) {
        return res.status(400).json({ error: 'Benutzername und Passwort erforderlich' })
    }

    const user = await User.findOne({ username })
        if (!user) return res.status(401).json({ error: 'Benutzer nicht gefunden' })

    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(401).json({ error: 'Falsches Passwort' })

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' })
    res.status(200).json({ token })
}

exports.me = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        res.status(200).json(user)
    } catch (err) {
        res.status(401).json({ error: 'Ungültiger Token oder Benutzer nicht gefunden' })
    }
}

// 📄 Alle Benutzer abrufen
exports.listUsers = async (req, res) => {
    const users = await User.find({}, { password: 0 }) // ⛔ keine Passwörter senden
    res.json(users)
}

// ➕ Benutzer anlegen
exports.register = async (req, res) => {
    const { username, password, isAdmin } = req.body
    if (!username || !password) return res.status(400).json({ error: 'Benutzername + Passwort erforderlich' })
    const hash = await bcrypt.hash(password, 10)
    const user = await User.create({ username, password: hash, isAdmin })
    res.status(201).json({ success: true, user: { _id: user._id, username: user.username, isAdmin: user.isAdmin } })
}

// ❌ Benutzer löschen
exports.deleteUser = async (req, res) => {
    await User.findByIdAndDelete(req.params.id)
    res.json({ success: true })
}