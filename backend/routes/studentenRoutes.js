const express = require('express');
const router = express.Router();
const student = require('../controllers/studentController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// Alle Studenten (nur Admin)
router.get('/', requireAuth, requireAdmin, student.listStudents);

// Einzelnen Studenten holen (nur Admin)
router.get('/:id', requireAuth, requireAdmin, student.getStudentById);

// Studenten anlegen (nur Admin)
router.post('/', requireAuth, requireAdmin, student.createStudent);

// Studenten aktualisieren (nur Admin)
router.put('/:id', requireAuth, requireAdmin, student.updateStudent);

// Student löschen (nur Admin)
router.delete('/:id', requireAuth, requireAdmin, student.deleteStudent);

module.exports = router;
