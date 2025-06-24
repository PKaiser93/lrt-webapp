// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const admin = require('../controllers/adminController');
const {requireAuth, requireAdmin} = require('../middleware/auth');

router.get('/ping', (req, res) => res.send('pong'));
// Statistiken
router.get('/stats', requireAuth, requireAdmin, admin.getStats);
// OS‑Verteilung
router.get('/os-stats', requireAuth, requireAdmin, admin.osStats);

// Users CRUD
router.get('/users', requireAuth, requireAdmin, admin.listUsers);
router.post('/users', requireAuth, requireAdmin, admin.createUser);
router.delete('/users/:id', requireAuth, requireAdmin, admin.deleteUser);
// Passwort zurücksetzen (liefert im Body das neue Klartext‐PW)
router.patch('/users/reset-password/:id', requireAuth, requireAdmin, admin.resetPassword);
router.patch('/users/toggle-admin/:id', requireAuth, requireAdmin, admin.toggleAdmin);

// ** neu: One‑Click Backup **
router.get('/backup/last',          requireAuth, requireAdmin, admin.getBackup);
router.post('/backup',          requireAuth, requireAdmin, admin.backupDatabase);

router.get   ('/settings',               admin.getSettings)
router.patch ('/settings/maintenance',   requireAuth, requireAdmin, admin.updateMaintenance)
router.patch ('/settings/flag/:name',    requireAuth, requireAdmin, admin.updateFlag)


module.exports = router;
