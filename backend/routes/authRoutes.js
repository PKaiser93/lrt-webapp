const express = require('express')
const router = express.Router()
const auth = require('../controllers/authController')
const verify = require('../middleware/verifyToken')

router.post('/login', auth.login)
router.get('/me', verify, auth.me)

module.exports = router
