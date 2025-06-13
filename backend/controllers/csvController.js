const Computer = require('../models/Computer');

// Felder, die als Zahl gespeichert werden
const integerFields = [
    'ram', 'laufendeNummer', 'studPCs', 'inventarnummer', 'beschaffungsjahr', 'studienzuschuss'
];

const allowedFields = [
    'marke', 'typ', 'seriennummer', 'cpu', 'ram', 'hddssd', 'grafikkarte', 'chipsatz',
    'tpm', 'bios', 'remote', 'betriebssystem', 'version', 'abstraktionsebene',
    'dnsName', 'ipAdresse', 'macAdresse', 'dhcp',
    'benutzer', 'idmKennung', 'betreuer', 'artDerArbeit', 'startdatum', 'abgabe',
    'raumnummer', 'kategorie', 'laufendeNummer', 'studPCs',
    'inventarnummer', 'fauInventarnummer', 'beschaffungsjahr', 'wannErsetzen', 'studienzuschuss',
    'info', 'todo', 'ablauf'
];

function castFieldsToNumber(row, fields) {
    fields.forEach(f => {
        if (row[f] !== undefined && row[f] !== null && row[f] !== '') {
            if (typeof row[f] === 'string' && row[f].toLowerCase().trim() === 'none') {
                row[f] = undefined;
            } else {
                const v = parseInt(row[f], 10);
                row[f] = isNaN(v) ? undefined : v;
            }
        }
    });
}

exports.importCSV = async (req, res) => {
    const rows = req.body.rows;
    const dryrun = req.query.dryrun === 'true';
    if (!Array.isArray(rows) || !rows.length) {
        return res.status(400).json({ error: 'Keine Daten im Import.' });
    }

    // Felder filtern und Zahlen konvertieren
    const filtered = rows.map(row => {
        const obj = {};
        for (const key of Object.keys(row)) {
            if (allowedFields.includes(key)) obj[key] = row[key];
        }
        castFieldsToNumber(obj, integerFields);
        return obj;
    });

    // Nur Zeilen mit mind. einem Wert
    const filteredValid = filtered.filter(
        r => Object.keys(r).some(key => r[key] !== undefined && r[key] !== null && r[key] !== '')
    );

    // <<<<<< DEBUGGING: LOGGEN!
    console.log('[IMPORT] rows:', JSON.stringify(rows, null, 2));
    console.log('[IMPORT] filteredValid:', JSON.stringify(filteredValid, null, 2));

    if (!filteredValid.length) {
        return res.status(400).json({ error: 'Keine gültigen Zeilen.' });
    }

    if (dryrun) {
        // Vorschau (max 10)
        return res.json({ preview: filteredValid.slice(0, 10), total: filteredValid.length });
    }
    try {
        await Computer.insertMany(filteredValid);
        res.json({ imported: filteredValid.length });
    } catch (err) {
        console.error('[IMPORT ERROR]', err);
        res.status(500).json({ error: err.message });
    }
};

