const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/dashboardController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// Alle Dashboard-Auswertungen nur für Admin!
router.get('/count/computer', requireAuth, requireAdmin, ctrl.countComputer);
router.get('/count/users', requireAuth, requireAdmin, ctrl.countUsers);
router.get('/count/trash', requireAuth, requireAdmin, ctrl.countTrash);
router.get('/last-import', requireAuth, requireAdmin, ctrl.lastImport);
router.get('/devices-per-os', requireAuth, requireAdmin, ctrl.devicesPerOS);

module.exports = router;
