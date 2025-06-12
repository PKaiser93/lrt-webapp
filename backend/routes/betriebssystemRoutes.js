const express = require('express')
const router = express.Router()
const ctrl = require('../controllers/betriebssystemController')

// Wichtig: spezifischere Routen zuerst
router.get('/trash', ctrl.listTrash)             // zeigt deleted = true
router.delete('/trash', ctrl.hardDeleteAll) // endgültig löschen

router.get('/', ctrl.list)
router.post('/', ctrl.create)
router.post('/import', ctrl.bulkImport)

router.patch('/:id', ctrl.update)
router.patch('/:id/restore', ctrl.restore)
router.delete('/:id', ctrl.softDelete)      // muss zuletzt, weil :id sonst trash matched

module.exports = router
