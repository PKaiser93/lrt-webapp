const express = require('express')
const router = express.Router()
const ctrl = require('../controllers/dashboardController')

router.get('/count/computer', ctrl.countComputer)
router.get('/count/users', ctrl.countUsers)
router.get('/count/trash', ctrl.countTrash)
router.get('/last-import', ctrl.lastImport)
router.get('/devices-per-os', ctrl.devicesPerOS)


module.exports = router
