const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/kategorieController');

router.post('/', ctrl.createKategorie);
router.patch('/:id', ctrl.updateKategorie);
router.delete('/:id', ctrl.softDeleteKategorie);
router.patch('/:id/restore', ctrl.restoreKategorie);
router.get('/', ctrl.listKategorien);

module.exports = router;
