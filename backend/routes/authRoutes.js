const express = require('express');

const router = express.Router();
const auth = require('../controllers/authController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// Alle Benutzer abrufen (nur Admins!)
router.get('/', requireAuth, requireAdmin, auth.listUsers);

// Benutzer erstellen
router.post('/register', auth.register);

// Benutzer löschen (nur Admins!)
router.delete('/:id', requireAuth, requireAdmin, auth.deleteUser);

// Login
router.post('/login', auth.login);

// Eigene Daten
router.get('/me', requireAuth, auth.me);

module.exports = router;
