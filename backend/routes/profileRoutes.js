// routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const { requireAuth, requireAdmin } = require('../middleware/auth');
const profile = require('../controllers/profileController');

router.get('/', requireAuth, profile.getProfile);
router.patch('/', requireAuth, profile.updateProfile);
router.post('/password', requireAuth, profile.changePassword);

module.exports = router;
