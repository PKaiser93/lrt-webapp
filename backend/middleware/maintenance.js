// middleware/maintenance.js
const AppSetting = require('../models/AppSetting')
const path       = require('path')

module.exports = async (req, res, next) => {
    // 👉 1) Settings‑Endpoint immer durchlassen
    if (req.originalUrl === '/api/admin/settings') {
        return next()
    }

    const setting = await AppSetting.findOne({ key: 'maintenanceMode' })
    if (!setting?.value) return next()

    if (req.user?.isAdmin) return next()

    if (req.path.startsWith('/assets/') || req.path === '/favicon.ico') {
        return next()
    }

    if (req.originalUrl.startsWith('/api/')) {
        return res.status(503).json({ error: 'Wartungsarbeiten – bitte später erneut versuchen.' })
    }

    return res
        .status(503)
        .sendFile(path.join(__dirname, '../public/maintenance.html'))
}
