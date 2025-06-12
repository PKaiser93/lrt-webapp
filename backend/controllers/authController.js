const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

console.log('🔁 User-Modell geladen:', typeof User)

exports.login = async (req, res) => {
    const { username, password } = req.body
    console.log('🔐 Loginversuch für:', username)

    if (!username || !password) {
        return res.status(400).json({ error: 'Benutzername und Passwort erforderlich' })
    }

    const user = await User.findOne({ username })

    // 🧪 Logging zur Diagnose:
    console.log('📂 User gefunden:', user)
    console.log('🔑 Eingabe-PW:', password)
    console.log('🔒 DB-Hash:', user?.password)

    if (!user) return res.status(401).json({ error: 'Benutzer nicht gefunden' })

    const match = await bcrypt.compare(password, user.password)
    const test = await bcrypt.compare(password, user.password)
    console.log('✅ bcrypt Ergebnis:', test)
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