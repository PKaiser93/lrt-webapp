// controllers/csvImportController.js

const Computer = require('../models/Computer');
const filterFields = require('../utils/fieldFilter');

// Mapping CSV-Überschrift → DB-Feld
const CSV_TO_DB_MAP = {
    'Marke': 'marke',
    'Typ': 'typ',
    'Seriennummer': 'seriennummer',
    'CPU': 'cpu',
    'RAM': 'ram',
    'HDD/SSD': 'hddssd',
    'Grafikkarte': 'grafikkarte',
    'Chipsatz': 'chipsatz',
    'TPM': 'tpm',
    'BIOS': 'bios',
    'Remote': 'remote',
    'Betriebssystem': 'betriebssystem',
    'Version': 'version',
    'Abstraktionsebene': 'abstraktionsebene',
    'DNS-Name': 'dnsName',
    'IP-Adresse': 'ipAdresse',
    'MAC-Adresse': 'macAdresse',
    'DHCP': 'dhcp',
    'Benutzer': 'benutzer',
    'IdM-Kennung': 'idmKennung',
    'Betreuer': 'betreuer',
    'Art der Arbeit': 'artDerArbeit',
    'Startdatum': 'startdatum',
    'Abgabe': 'abgabe',
    'Raumnummer': 'raumnummer',
    'Kategorie': 'kategorie',
    'Laufende Nummer': 'laufendeNummer',
    'StudPCs': 'studPCs',
    'Inventarnummer': 'inventarnummer',
    'FAU-Inventarnummer': 'fauInventarnummer',
    'Beschaffungsjahr': 'beschaffungsjahr',
    'Wann ersetzen': 'wannErsetzen',
    'Studienzuschuss': 'studienzuschuss',
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

exports.importCSV = async (req, res) => {
    try {
        const rows = req.body.rows || [];
        if (!Array.isArray(rows) || !rows.length) {
            return res.status(400).json({ error: 'Keine Daten im Import.' });
        }

        // Mapping der CSV-Spalten auf DB-Felder
        const mappedRows = rows.map(row => {
            const mapped = {};
            for (const key in row) {
                const dbKey = CSV_TO_DB_MAP[key];
                if (dbKey) mapped[dbKey] = row[key];
            }
            return mapped;
        });

        // Felder filtern und Zahlenfelder casten
        const daten = mappedRows.map(row => {
            const filtered = filterFields(row, allowedFields);
            castFieldsToNumber(filtered, integerFields);
            return filtered;
        });

        // Nur Zeilen mit mind. einem Wert behalten
        const datenFiltered = daten.filter(r => Object.values(r).some(val => val !== undefined && val !== null && val !== ''));

        if (!datenFiltered.length) {
            return res.status(400).json({ error: 'Keine gültigen Zeilen.' });
        }

        // Vorschau/Dryrun
        if (req.query.dryrun === 'true') {
            return res.json({ preview: datenFiltered.slice(0, 10), total: datenFiltered.length });
        }

        // Insert in DB
        await Computer.insertMany(datenFiltered);
        res.status(200).json({ message: 'Computer-Import erfolgreich', importiert: datenFiltered.length });
    } catch (err) {
        res.status(500).json({ error: 'Fehler beim Import', details: err.message });
    }
};
