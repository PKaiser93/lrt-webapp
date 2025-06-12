const express = require('express')
const router = express.Router()
const ctrl = require('../controllers/kategorieController')

// ✍️ CRUD + Trash Routes
router.post('/', ctrl.createKategorie)
router.patch('/:id', ctrl.updateKategorie)

router.patch('/:id/restore', ctrl.restoreKategorie)

// 🧠 Reguläre & gelöschte Abfragen
router.get('/', ctrl.listKategorien) // -> listet NICHT-gelöschte
router.get('/trash', ctrl.listTrashKategorien) // -> listet NUR gelöschte


// 🧨 Hard Delete
router.delete('/trash', ctrl.deleteTrash)
router.delete('/:id', ctrl.softDeleteKategorie)

module.exports = router
