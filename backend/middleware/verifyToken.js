const jwt = require('jsonwebtoken')

exports.verifyToken = (req, res, next) => {
    const auth = req.headers.authorization
    if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Token fehlt' })

    const token = auth.split(' ')[1]
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch {
        res.status(403).json({ error: 'Ungültiger Token' })
    }
}

exports.requireAdmin = (req, res, next) => {
    if (!req.user?.isAdmin) return res.status(403).json({ error: 'Nur für Admins' })
    next()
}
