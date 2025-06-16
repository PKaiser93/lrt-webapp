// controllers/csvImportController.js

const Computer = require('../models/Computer');
const csv = require('csv-parser');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const filterFields = require('../utils/fieldFilter');

// Multer-Setup für temporäres Dateihandling
const upload = multer({ dest: 'uploads/' });

// Mapping CSV-Überschrift → DB-Feld
const CSV_TO_DB_MAP = {
    'Marke': 'marke',
    'Typ': 'typ',
    'Seriennummer': 'seriennummer',
    'CPU': 'cpu',
    'RAM': 'ram',
    'hddssd': 'hddssd',
    'Grafikkarte': 'grafikkarte',
    'Chipsatz': 'chipsatz',
    'TPM': 'tpm',
    'BIOS': 'bios',
    'Remote': 'remote',
    'Betriebssystem': 'betriebssystem',
    'Version': 'version',
    'abstraktionsebene': 'abstraktionsebene',
    'DNS': 'dnsName',
    'ipAdresse': 'ipAdresse',
    'macAdresse': 'macAdresse',
    'DHCP': 'dhcp',
    'Benutzer': 'benutzer',
    'idmKennung': 'idmKennung',
    'Betreuer': 'betreuer',
    'artDerArbeit': 'artDerArbeit',
    'Startdatum': 'startdatum',
    'Abgabe': 'abgabe',
    'Raumnummer': 'raumnummer',
    'Kategorie': 'kategorie',
    'laufendeNummer': 'laufendeNummer',
    'studPCs': 'studPCs',
    'Inventarnummer': 'inventarnummer',
    'fauInventarnummer': 'fauInventarnummer',
    'beschaffungsjahr': 'beschaffungsjahr',
    'wannErsetzen': 'wannErsetzen',
    'studienzuschuss': 'studienzuschuss',
    'Info': 'info',
    'ToDo': 'todo',
    'Ablauf': 'ablauf'
};

// Felder, die erlaubt/importiert werden
const allowedFields = Object.values(CSV_TO_DB_MAP);
// Felder, die als Integer gespeichert werden sollen
const integerFields = [
    'ram', 'laufendeNummer', 'studPCs', 'inventarnummer', 'beschaffungsjahr', 'studienzuschuss'
];

// Zahlenfelder casten und "None"/"" → undefined
function castFieldsToNumber(row, fields) {
    fields.forEach(f => {
        if (row[f] !== undefined && row[f] !== null && row[f] !== '') {
            if (typeof row[f] === 'string' && row[f].toLowerCase() === 'none') {
                row[f] = undefined;
            } else {
                const v = parseInt(row[f], 10);
                row[f] = isNaN(v) ? undefined : v;
            }
        }
    });
}

// ==============================
// 1. Datei-Upload & Vorschau
// ==============================
exports.uploadCSV = [
    upload.single('file'),
    async (req, res) => {
        if (!req.file) return res.status(400).json({ error: 'Keine Datei hochgeladen!' });

        const results = [];
        const filePath = path.join(__dirname, '..', req.file.path);

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', async () => {
                // Mapping der CSV-Spalten auf DB-Felder
                const mappedRows = results.map(row => {
                    const mapped = {};
                    for (const key in row) {
                        const dbKey = CSV_TO_DB_MAP[key];
                        if (dbKey) mapped[dbKey] = row[key];
                    }
                    return mapped;
                });

                // Felder filtern & Zahlenfelder casten
                const daten = mappedRows.map(row => {
                    const filtered = filterFields(row, allowedFields);
                    castFieldsToNumber(filtered, integerFields);
                    return filtered;
                });

                // Nur Seriennummern, die vorhanden sind (für Duplikat-Prüfung)
                const seriennummern = daten
                    .map(r => r.seriennummer)
                    .filter(sn => sn && sn.trim() !== '');

                // Nur Vorschau (erste 5 Zeilen)
                const preview = daten.slice(0, 5);

                // Duplikate in DB suchen (nur wenn Seriennummer existiert)
                const existing = await Computer.find({ seriennummer: { $in: seriennummern } }, 'seriennummer');
                const duplikate = existing.map(e => e.seriennummer);

                fs.unlink(filePath, () => {});

                res.json({
                    preview,
                    duplikate,
                    anzahl: daten.length,
                });
            });
    }
];

// =============================================
// 2. Import-Route: Einfügen/Ersetzen/Überspringen
// =============================================
exports.importCSV = [
    upload.single('file'),
    async (req, res) => {
        if (!req.file) return res.status(400).json({ error: 'Keine Datei hochgeladen!' });

        // User-Entscheidungen für Duplikate als JSON-String im Body (Key: Seriennummer)
        const entscheidungen = req.body.entscheidungen
            ? JSON.parse(req.body.entscheidungen)
            : {};

        const results = [];
        const filePath = path.join(__dirname, '..', req.file.path);

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', async () => {
                // Mapping der CSV-Spalten auf DB-Felder
                const mappedRows = results.map(row => {
                    const mapped = {};
                    for (const key in row) {
                        const dbKey = CSV_TO_DB_MAP[key];
                        if (dbKey) mapped[dbKey] = row[key];
                    }
                    return mapped;
                });

                // Felder filtern & Zahlenfelder casten
                const daten = mappedRows.map(row => {
                    const filtered = filterFields(row, allowedFields);
                    castFieldsToNumber(filtered, integerFields);
                    return filtered;
                });

                // Nur Zeilen mit mindestens einem Wert behalten
                const datenFiltered = daten.filter(r =>
                    Object.values(r).some(val => val !== undefined && val !== null && val !== '')
                );

                let neu = 0, ersetzt = 0, übersprungen = 0, fehler = [];

                for (let record of datenFiltered) {
                    const seriennummer = record.seriennummer;
                    if (seriennummer && seriennummer.trim() !== '') {
                        const entscheidung = entscheidungen[seriennummer] || 'insert';
                        try {
                            const exists = await Computer.findOne({ seriennummer });
                            if (exists) {
                                if (entscheidung === 'replace') {
                                    await Computer.updateOne({ seriennummer }, { $set: record });
                                    ersetzt++;
                                } else {
                                    übersprungen++;
                                }
                            } else {
                                await Computer.create(record);
                                neu++;
                            }
                        } catch (e) {
                            fehler.push({ seriennummer, fehler: e.message });
                        }
                    } else {
                        // KEINE Seriennummer: Immer als neuen Datensatz importieren
                        try {
                            await Computer.create(record);
                            neu++;
                        } catch (e) {
                            fehler.push({ seriennummer: null, fehler: e.message });
                        }
                    }
                }

                fs.unlink(filePath, () => {});

                res.json({ neu, ersetzt, übersprungen, fehler });
            });
    }
];
