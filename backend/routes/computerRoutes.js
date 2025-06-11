const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/computerController');

router.post('/', ctrl.createComputer);
router.patch('/:id', ctrl.updateComputer);
router.delete('/:id', ctrl.softDeleteComputer);
router.patch('/:id/restore', ctrl.restoreComputer);
router.get('/', ctrl.filterSearchComputers);
router.get('/:id', ctrl.getComputerById);

module.exports = router;
