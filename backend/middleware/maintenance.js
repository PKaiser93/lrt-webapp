const path = require('path');

const AppSetting = require('../models/AppSetting');

module.exports = async (req, res, next) => {
  // console.log('🔧 [Maintenance] URL:', req.originalUrl, 'User:', req.user?.username)

  // 1) Settings‑Endpoint immer durchlassen
  if (
    req.originalUrl === '/admin/settings' ||
        req.originalUrl === '/api/admin/settings'
  ) {
    // console.log('🔧 [Maintenance] Passing through settings endpoint')
    return next();
  }

  // 2) Flag aus der DB holen
  const setting = await AppSetting.findOne({ key: 'maintenanceMode' });
  const maintenanceOn = Boolean(setting?.value);
  // console.log('🔧 [Maintenance] Flag in DB:', maintenanceOn)

  // 3) Wenn aus ist → weiter
  if (!maintenanceOn) {
    // console.log('🔧 [Maintenance] OFF → next()')
    return next();
  }

  // 4) Admins dürfen weiter
  if (req.user?.isAdmin) {
    // console.log('🔧 [Maintenance] Admin → next()')
    return next();
  }

  // 5) Static Assets?
  if (req.path.startsWith('/assets') || req.path === '/favicon.ico') {
    // console.log('🔧 [Maintenance] Asset → next()')
    return next();
  }

  // 6) API‑Request → 503 JSON
  if (req.originalUrl.startsWith('/api/')) {
    // console.log('🔧 [Maintenance] API → 503 JSON')
    return res.status(503).json({ error: 'Wartungsarbeiten' });
  }

  // 7) Alles andere → Maintenance‑Seite
  // console.log('🔧 [Maintenance] Redirect to maintenance page')
  return res
    .status(503)
    .sendFile(path.join(__dirname, '../public/maintenance.html'));
};
