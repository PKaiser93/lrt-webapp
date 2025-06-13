const express = require('express')
const router = express.Router()
const auth = require('../controllers/authController')
const { verifyToken, requireAdmin } = require('../middleware/verifyToken')

// Alle Benutzer abrufen (nur Admins!)
router.get('/', verifyToken, requireAdmin, auth.listUsers)

// Benutzer erstellen
router.post('/register', auth.register)

// Benutzer löschen (nur Admins!)
router.delete('/:id', verifyToken, requireAdmin, auth.deleteUser)

// Login
router.post('/login', auth.login)

// Eigene Daten
router.get('/me', verifyToken, auth.me)

module.exports = router
