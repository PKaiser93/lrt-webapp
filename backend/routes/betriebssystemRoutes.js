/**
 * @swagger
 * tags:
 *   name: Betriebssystem
 *   description: Verwaltung der Betriebssysteme
 */

const express = require('express');

const router = express.Router();
const bs = require('../controllers/betriebssystemController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

/**
 * @swagger
 * /betriebssystem:
 *   get:
 *     summary: Alle Betriebssysteme anzeigen
 *     tags: [Betriebssystem]
 *     responses:
 *       200:
 *         description: Array mit Betriebssystem‑Objekten
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Betriebssystem'
 */
router.get('/', bs.listAll);

/**
 * @swagger
 * /betriebssystem:
 *   post:
 *     summary: Neues Betriebssystem anlegen
 *     tags: [Betriebssystem]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BetriebssystemInput'
 *     responses:
 *       201:
 *         description: Erstelltes Betriebssystem
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Betriebssystem'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.post('/', requireAuth, requireAdmin, bs.create);

/**
 * @swagger
 * /betriebssystem/{id}:
 *   patch:
 *     summary: Betriebssystem aktualisieren
 *     tags: [Betriebssystem]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BetriebssystemInput'
 *     responses:
 *       200:
 *         description: Aktualisiertes Betriebssystem
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Betriebssystem'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.patch('/:id', requireAuth, requireAdmin, bs.update);

/**
 * @swagger
 * /betriebssystem/{id}/soft-delete:
 *   patch:
 *     summary: Betriebssystem soft‐löschen
 *     tags: [Betriebssystem]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     responses:
 *       200:
 *         description: Soft‑Delete erfolgreich
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.patch('/:id/soft-delete', requireAuth, requireAdmin, bs.softDelete);

/**
 * @swagger
 * /betriebssystem/{id}/restore:
 *   patch:
 *     summary: Soft‐gelöschtes Betriebssystem wiederherstellen
 *     tags: [Betriebssystem]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     responses:
 *       200:
 *         description: Restore erfolgreich
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.patch('/:id/restore', requireAuth, requireAdmin, bs.restore);

/**
 * @swagger
 * /betriebssystem/bulk-import:
 *   post:
 *     summary: Mehrere Betriebssysteme im Bulk importieren
 *     tags: [Betriebssystem]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Bulk‑Import erfolgreich
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.post('/bulk-import', requireAuth, requireAdmin, bs.bulkImport);

/**
 * @swagger
 * /betriebssystem/hard-delete-all:
 *   delete:
 *     summary: Alle gelöschten Betriebssysteme endgültig löschen
 *     tags: [Betriebssystem]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Alle gelöscht
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.delete('/hard-delete-all', requireAuth, requireAdmin, bs.hardDeleteAll);

/**
 * @swagger
 * /betriebssystem/trash/list:
 *   get:
 *     summary: Soft‐gelöschte Betriebssysteme auflisten
 *     tags: [Betriebssystem]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array der gelöschten Betriebssysteme
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Betriebssystem'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.get('/trash/list', requireAuth, requireAdmin, bs.listTrash);

/**
 * @swagger
 * /betriebssystem/{id}:
 *   delete:
 *     summary: Einzelnes Betriebssystem endgültig löschen
 *     tags: [Betriebssystem]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     responses:
 *       200:
 *         description: Gelöscht
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete('/:id', requireAuth, requireAdmin, bs.deleteSingle);

module.exports = router;
