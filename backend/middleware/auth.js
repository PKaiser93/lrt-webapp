exports.requireAdmin = (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ error: 'Nur für Admins erlaubt' });
    }
    next();
};
