const express = require('express');
const router = express.Router();
const kategorie = require('../controllers/kategorieController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// Alle Kategorien (sichtbar für alle eingeloggten User)
router.get('/', kategorie.listKategorien);

// Einzelne Kategorie – optional implementieren, falls benötigt
// router.get('/:id', requireAuth, kategorie.getKategorieById);

// Anlegen (nur Admin)
router.post('/', requireAuth, requireAdmin, kategorie.createKategorie);

// Aktualisieren (nur Admin)
router.patch('/:id', requireAuth, requireAdmin, kategorie.updateKategorie);

// Soft Delete (nur Admin)
router.patch('/:id/soft-delete', requireAuth, requireAdmin, kategorie.softDeleteKategorie);

// Restore (nur Admin)
router.patch('/:id/restore', requireAuth, requireAdmin, kategorie.restoreKategorie);

// Gelöschte Kategorien anzeigen (nur Admin)
router.get('/trash/list', requireAuth, requireAdmin, kategorie.listTrashKategorien);

// Hard Delete Trash (Papierkorb leeren, nur Admin)
router.delete('/trash', requireAuth, requireAdmin, kategorie.deleteTrash);

// Hard Delete Single Kategorie (nur Admin)
router.delete('/:id', kategorie.deleteSingle);

module.exports = router;
