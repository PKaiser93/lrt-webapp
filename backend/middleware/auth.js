const jwt = require('jsonwebtoken');

/**
 * Prüft, ob der Request einen gültigen JWT trägt (Authorization: Bearer ...)
 * Setzt req.user auf das Payload-Objekt.
 */
exports.requireAuth = (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Nicht eingeloggt!' });
    }
    try {
        const token = auth.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Automatisch auf _id mappen, falls nur id vorhanden
        if (decoded.id && !decoded._id) {
            decoded._id = decoded.id;
        }

        req.user = decoded;
        next();
    } catch (err) {
        const isExpired = err.name === 'TokenExpiredError';
        return res.status(401).json({ error: isExpired ? 'Token abgelaufen!' : 'Token ungültig!' });
    }
};


/**
 * Prüft, ob der eingeloggte User Admin-Rechte hat (req.user muss vorhanden sein!).
 */
exports.requireAdmin = (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ error: 'Nur für Admins erlaubt' });
    }
    next();
};

/**
 * Alias für requireAuth, kompatibel mit älteren Routings.
 */
exports.verifyToken = exports.requireAuth;
