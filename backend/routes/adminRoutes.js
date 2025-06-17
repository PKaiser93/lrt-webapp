const express = require('express');
const router = express.Router();
const { requireAuth, requireAdmin } = require('../middleware/auth');
const admin = require('../controllers/adminController');

// Nur eingeloggte Admins!
router.use(requireAuth);
router.use(requireAdmin);

router.get('/stats', admin.getStats);
router.post('/users', admin.createUser);
router.get('/users', admin.listUsers);
router.post('/user/resetpw/:id', admin.resetPassword);
router.get('/os-stats', admin.osStats);

module.exports = router;
