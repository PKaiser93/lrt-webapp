const express = require('express');
const router = express.Router();
const computer = require('../controllers/computerController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// CRUD für Computer
router.post('/:id/upload', computer.uploadDocuments);
router.get('/:id/documents', computer.listDocuments);
router.get('/:id/documents/:filename', computer.downloadDocument);
router.delete('/:id/documents/:filename', computer.deleteDocument);

// Suche/Filter
router.get('/search', requireAuth, computer.advancedSearchComputers);

// Alle Computer (ohne Filter, Vorsicht bei großen Datenmengen)
router.get('/', computer.advancedSearchComputers);
router.get('/all', computer.listAll);

// Einzelnen Computer holen
router.get('/:id', computer.getComputerById);

// Computer anlegen
router.post('/', requireAuth, requireAdmin, computer.createComputer);

// Computer aktualisieren
router.patch('/:id', requireAuth, requireAdmin, computer.updateComputer);

// Soft Delete (nur Admin)
router.patch('/:id/soft-delete', requireAuth, requireAdmin, computer.softDeleteComputer);

// Restore (nur Admin)
router.patch('/:id/restore', requireAuth, requireAdmin, computer.restoreComputer);

// Hard Delete ALL (Papierkorb leeren, nur Admin)
router.delete('/hard-delete-all', requireAuth, requireAdmin, computer.hardDeleteAll);

// Gelöschte Betriebssysteme auflisten (nur Admin)
router.get('/trash/list', requireAuth, requireAdmin, computer.listTrash);

// Hard Delete Single computer (nur Admin)
router.delete('/:id', computer.deleteSingle);

module.exports = router;
