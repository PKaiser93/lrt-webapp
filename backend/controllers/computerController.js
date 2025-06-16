const Computer = require('../models/Computer');
const Kategorie = require('../models/Kategorie'); // Passe ggf. Pfad/Modellnamen an!

// Hilfsfunktion: Mapping Klartext → ObjectId (Cache für Performance)
let kategorieCache = null;

async function getKategorieLookup() {
    if (kategorieCache) return kategorieCache;
    const kategorien = await Kategorie.find({});
    const lookup = {};
    kategorien.forEach(kat => {
        if (kat.bezeichnung && kat._id) {
            lookup[kat.bezeichnung.trim().toLowerCase()] = String(kat._id);
        }
    });
    kategorieCache = lookup;
    return lookup;
}

// Query Parser
function parseAdvancedSearch(search) {
    const expr = /\b(\w+)\s*(>=|<=|>|<|:|=)\s*:?\s*([^\s&]+)/gi;
    let match, rules = [];
    let rest = search;
    while ((match = expr.exec(search)) !== null) {
        console.log('RegExp Match:', match);
        rules.push({
            field: match[1].toLowerCase(),
            op: match[2],
            value: match[3]
        });
        rest = rest.replace(match[0], '');
    }
    rest = rest.replace(/&+/g, ' ').trim();
    return { rules, text: rest };
}

const FIELD_MAP = {
    dns: 'dnsName',
    ram: 'ram',
    jahr: 'beschaffungsjahr',
    baujahr: 'beschaffungsjahr',
    kategorie: 'kategorie',
    os: 'betriebssystem',
    betriebssystem: 'betriebssystem',
    benutzer: 'benutzer',
    cpu: 'cpu',
    betreuer: 'betreuer',
    raum: 'raumnummer',
    raumnummer: 'raumnummer',
};

const INT_FIELDS = [
    'ram', 'beschaffungsjahr', 'inventarnummer', 'laufendeNummer', 'studPCs', 'studienzuschuss'
];

// --- ADVANCED SEARCH ---
exports.advancedSearchComputers = async (req, res) => {
    try {
        const { query = '', regex = 'false' } = req.query;
        const useRegex = regex === 'true';
        const { rules, text } = parseAdvancedSearch(query);
        const filter = { deleted: false };
        const kategorieLookup = await getKategorieLookup();

        console.log('--- Advanced Search Debug ---');
        console.log('Query String:', query);
        console.log('Regeln:', rules);

        rules.forEach(rule => {
            let field = FIELD_MAP[rule.field] || rule.field;
            // INT-Felder mit Operatoren
            if (INT_FIELDS.includes(field)) {
                let val = Number(rule.value);
                if (isNaN(val)) {
                    console.warn('IGNORIERE, kein numerischer Wert:', rule);
                    return;
                }
                if (rule.op === '=' || rule.op === ':') {
                    filter[field] = val; // Gleichheit überschreibt alles
                } else {
                    if (!filter[field] || typeof filter[field] !== 'object' || Array.isArray(filter[field])) {
                        filter[field] = {};
                    }
                    switch (rule.op) {
                        case '>=':
                            filter[field]['$gte'] = val;
                            break;
                        case '<=':
                            filter[field]['$lte'] = val;
                            break;
                        case '>':
                            filter[field]['$gt'] = val;
                            break;
                        case '<':
                            filter[field]['$lt'] = val;
                            break;
                    }
                }
            }
            // Kategorie-Mapping (Klartext oder ID)
            else if (field === 'kategorie') {
                let val = rule.value.trim().toLowerCase();
                filter[field] = kategorieLookup[val] ? kategorieLookup[val] : rule.value;
            }
            // Stringfelder
            else {
                if (rule.op === ':' || rule.op === '=') {
                    if (useRegex || rule.op === ':') {
                        filter[field] = { $regex: rule.value, $options: 'i' };
                    } else {
                        filter[field] = rule.value;
                    }
                }
            }
        });

        // Freitextsuche (optional)
        if (text) {
            const textRegex = useRegex
                ? new RegExp(text, 'i')
                : new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
            const orFields = [
                'dnsName', 'benutzer', 'cpu', 'marke', 'typ', 'seriennummer', 'grafikkarte',
                'chipsatz', 'tpm', 'bios', 'remote', 'version', 'abstraktionsebene', 'ipAdresse',
                'macAdresse', 'betreuer', 'artDerArbeit', 'raumnummer', 'fauInventarnummer', 'info', 'todo', 'ablauf'
            ];
            filter['$or'] = orFields.map(f => ({ [f]: { $regex: textRegex } }));
        }

        // DEBUG: finaler Filter
        console.log('Mongo-Filter:', JSON.stringify(filter, null, 2));

        // RAM-Type-Check (zeigt Typ im ersten Treffer, wenn vorhanden)
        if (filter.ram && typeof filter.ram !== "undefined") {
            const ramTest = await Computer.findOne({ ram: { $exists: true } });
            if (ramTest) {
                console.log('RAM Beispielwert in DB:', ramTest.ram, 'Typ:', typeof ramTest.ram);
            } else {
                console.log('Keine RAM-Daten in DB gefunden');
            }
        }

        const result = await Computer.find(filter)
            .populate('betriebssystem')
            .populate('kategorie')
            .limit(1000)
            .lean();

        res.json(result);
    } catch (err) {
        console.error('Advanced Search Fehler:', err);
        res.status(500).json({ error: err.message || 'Advanced Search fehlgeschlagen.' });
    }
};

// --- CREATE ---
exports.createComputer = async (req, res) => {
    try {
        let body = { ...req.body };
        if (body.kategorie && typeof body.kategorie === "string") {
            const kategorieLookup = await getKategorieLookup();
            const mapped = kategorieLookup[body.kategorie.trim().toLowerCase()];
            if (mapped) body.kategorie = mapped;
        }
        if (body.dhcp === "Ja") body.dhcp = true;
        if (body.dhcp === "Nein") body.dhcp = false;
        const computer = new Computer(body);
        await computer.save();
        const populated = await Computer.findById(computer._id)
            .populate('kategorie')
            .populate('betriebssystem');
        res.status(201).json(populated);
    } catch (err) {
        res.status(400).json({ error: err?.message || 'Computer konnte nicht erstellt werden.' });
    }
};

// --- UPDATE ---
exports.updateComputer = async (req, res) => {
    try {
        let body = { ...req.body };
        if (body.kategorie && typeof body.kategorie === "string") {
            const kategorieLookup = await getKategorieLookup();
            const mapped = kategorieLookup[body.kategorie.trim().toLowerCase()];
            if (mapped) body.kategorie = mapped;
        }
        if (body.dhcp === "Ja") body.dhcp = true;
        if (body.dhcp === "Nein") body.dhcp = false;
        const updated = await Computer.findByIdAndUpdate(req.params.id, body, { new: true });
        if (!updated) return res.status(404).json({ error: 'Computer nicht gefunden.' });
        const populated = await Computer.findById(updated._id)
            .populate('kategorie')
            .populate('betriebssystem');
        res.json(populated);
    } catch (err) {
        res.status(400).json({ error: err?.message || 'Update fehlgeschlagen.' });
    }
};

// --- SOFT DELETE ---
exports.softDeleteComputer = async (req, res) => {
    try {
        const updated = await Computer.findByIdAndUpdate(req.params.id, { deleted: true }, { new: true });
        if (!updated) return res.status(404).json({ error: 'Computer nicht gefunden.' });
        res.json({ message: 'Computer gelöscht (soft delete)' });
    } catch (err) {
        res.status(400).json({ error: err?.message || 'Soft delete fehlgeschlagen.' });
    }
};

// --- RESTORE ---
exports.restoreComputer = async (req, res) => {
    try {
        const updated = await Computer.findByIdAndUpdate(req.params.id, { deleted: false }, { new: true });
        if (!updated) return res.status(404).json({ error: 'Computer nicht gefunden.' });
        res.json({ message: 'Computer wiederhergestellt' });
    } catch (err) {
        res.status(400).json({ error: err?.message || 'Restore fehlgeschlagen.' });
    }
};

// --- EINZELN / ID ---
exports.getComputerById = async (req, res) => {
    try {
        const computer = await Computer.findById(req.params.id)
            .populate('kategorie')
            .populate('betriebssystem');
        if (!computer) return res.status(404).json({ error: 'Computer nicht gefunden.' });
        res.json(computer);
    } catch (err) {
        res.status(404).json({ error: err?.message || 'Fehler beim Abrufen.' });
    }
};
