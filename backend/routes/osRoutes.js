const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/osController');

router.post('/', ctrl.createOS);
router.patch('/:id', ctrl.updateOS);
router.delete('/:id', ctrl.softDeleteOS);
router.patch('/:id/restore', ctrl.restoreOS);
router.get('/', ctrl.listOS);

module.exports = router;
