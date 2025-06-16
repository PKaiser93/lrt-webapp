const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// GET: Alle Studenten
router.get('/', async (req, res) => {
    try {
        const studenten = await Student.find()
            .populate('betriebssystem')
            .populate('rechner');
        res.json(studenten);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// GET: Einzelner Student nach ID
router.get('/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id)
            .populate('betriebssystem')
            .populate('rechner');
        if (!student) return res.status(404).json({ error: 'Student nicht gefunden' });
        res.json(student);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// POST: Anlegen
router.post('/', async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();
        res.status(201).json(student);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

// PUT: Bearbeiten
router.put('/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!student) return res.status(404).json({ error: 'Student nicht gefunden' });
        res.json(student);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

// DELETE: Löschen
router.delete('/:id', async (req, res) => {
    try {
        const result = await Student.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ error: 'Student nicht gefunden' });
        res.json({ message: 'Student gelöscht' });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

module.exports = router;
