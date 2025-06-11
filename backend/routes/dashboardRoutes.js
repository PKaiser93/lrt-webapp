const express = require('express');
const router = express.Router();
const { getAdminDashboard } = require('../controllers/dashboardController');
const { requireAdmin } = require('../middleware/auth');

router.get('/', requireAdmin, getAdminDashboard);

module.exports = router;
