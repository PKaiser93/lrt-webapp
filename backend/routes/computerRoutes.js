const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/computerController');
const filterFields = require('../utils/fieldFilter')

router.post('/', ctrl.createComputer);
router.patch('/:id', ctrl.updateComputer);
router.delete('/:id', ctrl.softDeleteComputer);
router.patch('/:id/restore', ctrl.restoreComputer);
router.get('/', ctrl.filterSearchComputers);
router.get('/:id', ctrl.getComputerById);
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
        ]
        const daten = filterFields(req.body, allowedFields)
        await Computer.insertMany(daten)
        res.status(200).json({ message: 'Computer-Import erfolgreich' })
    } catch (err) {
        res.status(500).json({ error: 'Fehler beim Import', details: err.message })
    }
})

router.post('/bulk', async (req, res) => {
    try {
        await Computer.insertMany(req.body)
        res.sendStatus(200)
    } catch (err) {
        console.error('Bulk-Import Error:', err)
        res.status(500).json({ error: 'Import fehlgeschlagen' })
    }
})


module.exports = router;
