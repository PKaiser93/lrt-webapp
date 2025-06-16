// routes/csvRoutes.js

const express = require('express');
const router = express.Router();
const csvImportController = require('../controllers/csvImportController');

// Datei-Upload & Vorschau
router.post('/upload', csvImportController.uploadCSV);

// Import-Logik mit Duplikatentscheidung
router.post('/import', csvImportController.importCSV);

module.exports = router;
