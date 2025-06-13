const express = require('express');
const router = express.Router();
const Computer = require('../models/Computer');
const ctrl = require('../controllers/computerController');
const filterFields = require('../utils/fieldFilter');

// CREATE, UPDATE, SOFT DELETE, RESTORE
router.post('/', ctrl.createComputer);
router.patch('/:id', ctrl.updateComputer);
router.delete('/:id', ctrl.softDeleteComputer);
router.patch('/:id/restore', ctrl.restoreComputer);

// --- Advanced Search (muss vor "/:id" stehen!) ---
router.get('/search', ctrl.advancedSearchComputers);

// --- Klassische Suche/Filter (optional, nicht so mächtig wie Advanced) ---
// router.get('/', ctrl.filterSearchComputers);

// GET BY ID (muss nach search!)
router.get('/:id', ctrl.getComputerById);

// --- Import-API --- (immer ganz unten, da POST / überschreiben könnte!)
router.post('/import', async (req, res) => {
    try {
        const allowedFields = [
            'marke', 'typ', 'seriennummer', 'cpu', 'ram', 'hddssd', 'grafikkarte', 'chipsatz',
            'tpm', 'bios', 'remote', 'betriebssystem', 'version', 'abstraktionsebene',
            'dnsName', 'ipAdresse', 'macAdresse', 'dhcp',
            'benutzer', 'idmKennung', 'betreuer', 'artDerArbeit', 'startdatum', 'abgabe',
            'raumnummer', 'kategorie', 'laufendeNummer', 'studPCs',
            'inventarnummer', 'fauInventarnummer', 'beschaffungsjahr', 'wannErsetzen', 'studienzuschuss',
            'info', 'todo', 'ablauf'
        ];
        const daten = filterFields(req.body, allowedFields);
        await Computer.insertMany(daten);
        res.status(200).json({ message: 'Computer-Import erfolgreich' });
    } catch (err) {
        res.status(500).json({ error: 'Fehler beim Import', details: err.message });
    }
});

// --- Bulk-Import (kann z.B. für interne Tools oder Migration benutzt werden) ---
router.post('/bulk', async (req, res) => {
    try {
        await Computer.insertMany(req.body);
        res.sendStatus(200);
    } catch (err) {
        console.error('Bulk-Import Error:', err);
        res.status(500).json({ error: 'Import fehlgeschlagen' });
    }
});

module.exports = router;
