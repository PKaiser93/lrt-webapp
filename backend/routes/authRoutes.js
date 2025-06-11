const express = require('express')
const router = express.Router()
const { login, register, getProfile} = require('../controllers/authController')
const {verifyToken} = require("../middleware/tokenAuth");

router.post('/login', login)
router.post('/register', register)
router.get('/profile', verifyToken, getProfile)// Optional: kann entfernt/deaktiviert werden

module.exports = router
