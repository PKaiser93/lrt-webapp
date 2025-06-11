const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.login = async (req, res) => {
    const { name, password } = req.body
    const user = await User.findOne({ name })

    if (!user) return res.status(401).json({ error: 'Benutzer nicht gefunden' })

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(403).json({ error: 'Falsches Passwort' })

    const token = jwt.sign(
        { id: user._id, name: user.name, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    )

    res.json({ token, user: { name: user.name, isAdmin: user.isAdmin } })
}

exports.register = async (req, res) => {
    const { name, password, isAdmin } = req.body
    const hashed = await bcrypt.hash(password, 10)
    const newUser = new User({ name, password: hashed, isAdmin })
    await newUser.save()
    res.status(201).json({ message: 'Benutzer erstellt' })
}

exports.getProfile = (req, res) => {
    res.json({ name: req.user.name, isAdmin: req.user.isAdmin })
}