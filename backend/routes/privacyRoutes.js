const express = require('express');

const router  = express.Router();
const priv    = require('../controllers/privacyController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// User‑Seite: neuen Request anlegen
router.post('/requests', requireAuth, priv.createRequest);

// Admin: alle Requests sehen
router.get('/requests', requireAuth, requireAdmin, priv.listRequests);

// Admin: Status updaten / export‑Link setzen
router.patch('/requests/:id', requireAuth, requireAdmin, priv.updateRequest);

module.exports = router;
