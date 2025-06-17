const express = require('express');
const router = express.Router();
const bs = require('../controllers/betriebssystemController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// Alle Betriebssysteme (sichtbar für alle User)
router.get('/', bs.listAll);

// Anlegen (nur Admin)
router.post('/', requireAuth, requireAdmin, bs.create);

// Aktualisieren (nur Admin)
router.patch('/:id', requireAuth, requireAdmin, bs.update);

// Soft Delete (nur Admin)
router.patch('/:id/soft-delete', requireAuth, requireAdmin, bs.softDelete);

// Restore (nur Admin)
router.patch('/:id/restore', requireAuth, requireAdmin, bs.restore);

// Bulk Import (nur Admin)
router.post('/bulk-import', requireAuth, requireAdmin, bs.bulkImport);

// Hard Delete ALL (Papierkorb leeren, nur Admin)
router.delete('/hard-delete-all', requireAuth, requireAdmin, bs.hardDeleteAll);

// Gelöschte Betriebssysteme auflisten (nur Admin)
router.get('/trash/list', requireAuth, requireAdmin, bs.listTrash);

module.exports = router;
