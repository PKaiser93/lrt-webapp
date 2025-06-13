// routes/csvImport.js

const express = require('express');
const router = express.Router();
const csvCtrl = require('../controllers/csvImportController');

router.post('/import', csvCtrl.importCSV);

module.exports = router;
