const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Hilfsfunktion für Fehlerbehandlung
const asyncHandler = fn => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next)

exports.login = asyncHandler(async (req, res) => {
    const { username, password } = req.body
    if (!username || !password)
        return res.status(400).json({ error: 'Benutzername und Passwort erforderlich' })

    const user = await User.findOne({ username })
    if (!user) return res.status(401).json({ error: 'Benutzer nicht gefunden' })

    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(401).json({ error: 'Falsches Passwort' })

    const token = jwt.sign(
        { id: user._id, username: user.username, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    )
    res.status(200).json({ token })
})

exports.register = asyncHandler(async (req, res) => {
    const { username, password, isAdmin } = req.body
    if (!username || !password)
        return res.status(400).json({ error: 'Benutzername und Passwort erforderlich' })

    const exists = await User.findOne({ username })
    if (exists) return res.status(409).json({ error: 'Benutzername bereits vergeben' })

    const hash = await bcrypt.hash(password, 10)
    const user = await User.create({ username, password: hash, isAdmin: !!isAdmin })
    res.status(201).json({ success: true, user: { _id: user._id, username: user.username, isAdmin: user.isAdmin } })
})

exports.me = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select('-password')
    if (!user) return res.status(404).json({ error: 'Benutzer nicht gefunden' })
    res.status(200).json(user)
})

// Zugriffsschutz: z.B. nur Admin darf andere User sehen/löschen!
exports.listUsers = asyncHandler(async (req, res) => {
    console.log("User aus Token:", req.user)
    if (!req.user?.isAdmin) return res.status(403).json({ error: 'Nicht autorisiert' })
    const users = await User.find({}, { password: 0 })
    res.json(users)
})

exports.deleteUser = asyncHandler(async (req, res) => {
    if (!req.user?.isAdmin) return res.status(403).json({ error: 'Nicht autorisiert' })
    const result = await User.findByIdAndDelete(req.params.id)
    if (!result) return res.status(404).json({ error: 'Benutzer nicht gefunden' })
    res.json({ success: true })
})
