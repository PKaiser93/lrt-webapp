const express = require('express');

const router  = express.Router();
const ctrl    = require('../controllers/ticketController');
const { requireAuth } = require('../middleware/auth');

// Alle Tickets
router.get('/', requireAuth, ctrl.list);
// Ticket details
router.get('/:id', requireAuth, ctrl.getById);
// Neues Ticket
router.post('/', requireAuth, ctrl.create);
// Ticket updaten (Status, Assignee, etc.)
router.patch('/:id', requireAuth, ctrl.update);
// Kommentar hinzufügen
router.post('/:id/comment', requireAuth, ctrl.addComment);
// Ticket löschen
router.delete('/:id', requireAuth, ctrl.delete);
// Ticket schließen
router.patch('/:id/close', requireAuth, ctrl.closeTicket);
// Ticket öffnen
router.patch('/:id/reopen', requireAuth, ctrl.reopenTicket);

router.patch('/:id/status',  requireAuth,  ctrl.changeStatus);

router.patch('/:id/assign',  requireAuth,  ctrl.assignTicket);

module.exports = router;
