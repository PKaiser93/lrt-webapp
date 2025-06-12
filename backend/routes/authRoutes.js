const express = require('express')
const router = express.Router()
const auth = require('../controllers/authController')
const verify = require('../middleware/verifyToken')

router.get('/', auth.listUsers)         // 👈 Benutzer abrufen
router.post('/register', auth.register) // 👈 Benutzer erstellen
router.delete('/:id', auth.deleteUser)  // 👈 Benutzer löschen
router.post('/login', auth.login)
router.get('/me', verify, auth.me)

module.exports = router
