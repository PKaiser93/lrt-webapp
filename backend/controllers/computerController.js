const Computer = require('../models/Computer');
const Kategorie = require('../models/Kategorie');
const Betriebssystem = require('../models/Betriebssystem');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Optional: asyncHandler zentral nutzen
const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// Storage für Multer: /uploads/:id
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = path.join(__dirname, '../uploads', req.params.id);
        fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        const clean = file.originalname.replace(/[^a-zA-Z0-9_\-\.]/g, '_');
        cb(null, Date.now() + '-' + clean);
    }
});
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024, files: 10 }, // z.B. 10 MB je Datei, max 10 Dateien
    fileFilter: (req, file, cb) => {
        // Nur PDFs, Bilder, Office etc. zulassen:
        const allowed = ['.pdf', '.jpg', '.jpeg', '.png', '.docx', '.xlsx'];
        if (allowed.includes(path.extname(file.originalname).toLowerCase())) {
            cb(null, true);
        } else {
            cb(new Error('Dateityp nicht erlaubt'), false);
        }
    }
});

exports.uploadDocuments = [
    upload.array('documents', 10), // max. 10 Dateien auf einmal
    async (req, res) => {
        // Dokumente zum Computer-Datensatz hinzufügen (optional)
        const Computer = require('../models/Computer');
        const computer = await Computer.findById(req.params.id);
        if (!computer) return res.status(404).json({ error: 'Computer nicht gefunden' });
        req.files.forEach(f => {
            if (!computer.documents) computer.documents = [];
            computer.documents.push(f.filename);
        });
        await computer.save();
        res.json({ message: 'Dateien hochgeladen', files: req.files.map(f => f.filename) });
    }
];

exports.listDocuments = async (req, res) => {
    const dir = path.join(__dirname, '../uploads', req.params.id);
    if (!fs.existsSync(dir)) return res.json([]);
    const files = fs.readdirSync(dir);
    const baseUrl = `${req.protocol}://${req.get('host')}/uploads/${req.params.id}/`;
    res.json(files.map(filename => ({
        filename,
        url: baseUrl + encodeURIComponent(filename)
    })));
};

exports.listAll = asyncHandler(async (req, res) => {
    const { page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;
    const [list, count] = await Promise.all([
        Computer.find({ deleted: { $ne: true } })
            .populate('kategorie')
            .populate('betriebssystem')
            .skip(skip)
            .limit(Number(limit))
            .lean(),
        Computer.countDocuments({ deleted: { $ne: true } })
    ]);
    res.status(200).json({ list, count });
});

exports.downloadDocument = (req, res) => {
    const filePath = path.join(__dirname, '../uploads', req.params.id, req.params.filename);
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Datei nicht gefunden' });
    res.download(filePath);
};

exports.deleteDocument = async (req, res) => {
    const filePath = path.join(__dirname, '../uploads', req.params.id, req.params.filename);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        // Optional: Aus Computer.documents entfernen
        const Computer = require('../models/Computer');
        await Computer.findByIdAndUpdate(req.params.id, { $pull: { documents: req.params.filename } });
        res.json({ message: 'Datei gelöscht' });
    } else {
        res.status(404).json({ error: 'Datei nicht gefunden' });
    }
};

// --- Hilfsfunktionen ---
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

function parseAdvancedSearch(search) {
    const expr = /\b(\w+)\s*(>=|<=|>|<|:|=)\s*:?\s*([^&]+)/gi;
    let match, rules = [];
    let rest = search;
    while ((match = expr.exec(search)) !== null) {
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

// --- Advanced Search ---
exports.advancedSearchComputers = asyncHandler(async (req, res) => {
    const { query = '', regex = 'false' } = req.query;
    const useRegex = regex === 'true';
    const { rules, text } = parseAdvancedSearch(query);
    const filter = { deleted: false };
    const kategorieLookup = await getKategorieLookup();

    for (const rule of rules) {
        let field = FIELD_MAP[rule.field] || rule.field;
        if (INT_FIELDS.includes(field)) {
            let val = Number(rule.value);
            if (isNaN(val)) continue;
            if (rule.op === '=' || rule.op === ':') {
                filter[field] = val;
            } else {
                filter[field] = filter[field] || {};
                switch (rule.op) {
                    case '>=': filter[field]['$gte'] = val; break;
                    case '<=': filter[field]['$lte'] = val; break;
                    case '>':  filter[field]['$gt']  = val; break;
                    case '<':  filter[field]['$lt']  = val; break;
                }
            }
        } else if (field === 'kategorie') {
            let val = rule.value.trim().toLowerCase();
            filter[field] = kategorieLookup[val] ? kategorieLookup[val] : rule.value;
        } else if (field === 'betriebssystem') {
            const osDocs = await Betriebssystem.find({
                name: { $regex: rule.value, $options: 'i' }
            }).lean();
            const ids = osDocs.map(doc => doc._id);
            filter[field] = ids.length ? { $in: ids } : null;
        } else {
            if ((rule.op === ':' || rule.op === '=') && rule.value) {
                filter[field] = { $regex: rule.value, $options: 'i' };
            } else {
                filter[field] = rule.value;
            }
        }
    }

    // Freitextsuche
    if (text && text.trim().length > 0) {
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

    const result = await Computer.find(filter)
        .populate('betriebssystem')
        .populate('kategorie')
        .limit(1000)
        .lean();

    res.status(200).json(result);
});

// --- CREATE ---
exports.createComputer = asyncHandler(async (req, res) => {
    let body = { ...req.body };
    if (body.kategorie && typeof body.kategorie === "string") {
        const kategorieLookup = await getKategorieLookup();
        const mapped = kategorieLookup[body.kategorie.trim().toLowerCase()];
        if (mapped) body.kategorie = mapped;
    }
    if (typeof body.dhcp === 'string') {
        if (body.dhcp.toLowerCase() === "ja") body.dhcp = true;
        else if (body.dhcp.toLowerCase() === "nein") body.dhcp = false;
    }
    const computer = new Computer(body);
    await computer.save();
    const populated = await Computer.findById(computer._id)
        .populate('kategorie')
        .populate('betriebssystem');
    res.status(201).json(populated);
});

// --- UPDATE ---
exports.updateComputer = asyncHandler(async (req, res) => {
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
    res.status(200).json(populated);
});

// --- SOFT DELETE ---
exports.softDeleteComputer = asyncHandler(async (req, res) => {
    const updated = await Computer.findByIdAndUpdate(req.params.id, { deleted: true }, { new: true });
    if (!updated) return res.status(404).json({ error: 'Computer nicht gefunden.' });
    res.status(200).json({ message: 'Computer gelöscht (soft delete)' });
});

// --- RESTORE ---
exports.restoreComputer = asyncHandler(async (req, res) => {
    const updated = await Computer.findByIdAndUpdate(req.params.id, { deleted: false }, { new: true });
    if (!updated) return res.status(404).json({ error: 'Computer nicht gefunden.' });
    res.status(200).json({ message: 'Computer wiederhergestellt' });
});

// --- EINZELN / ID ---
exports.getComputerById = asyncHandler(async (req, res) => {
    const computer = await Computer.findById(req.params.id)
        .populate('kategorie')
        .populate('betriebssystem');
    if (!computer) return res.status(404).json({ error: 'Computer nicht gefunden.' });
    res.status(200).json(computer);
});

// --- HARTES LÖSCHEN ALLER (z.B. für Cleanup) ---
exports.hardDeleteAll = asyncHandler(async (req, res) => {
    const result = await Computer.deleteMany({ deleted: true });
    res.status(200).json({ message: `${result.deletedCount} Computer gelöscht.` });
});

// --- HARD DELETE EINZELN ---
exports.deleteSingle = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Computer.findOneAndDelete({ _id: id, deleted: true });
        if (!deleted) return res.status(404).json({ error: 'Computer nicht gefunden oder nicht gelöscht.' });
        res.json({ message: 'Computer endgültig gelöscht.' });
    } catch (err) {
        res.status(500).json({ error: 'Fehler beim Löschen.' });
    }
};

// --- LIST TRASH (nur Computer mit deleted: true) ---
exports.listTrash = asyncHandler(async (req, res) => {
    const list = await Computer.find({ deleted: true })
        .populate('kategorie')
        .populate('betriebssystem')
        .lean();
    res.status(200).json(list);
});

// --- BULK IMPORT ---
exports.bulkImport = asyncHandler(async (req, res) => {
    if (!Array.isArray(req.body) || !req.body.length)
        return res.status(400).json({ error: 'Importdaten fehlen oder fehlerhaft.' });
    const daten = req.body.map(item => ({ ...item }));
    await Computer.insertMany(daten);
    res.status(201).json({ message: 'Import erfolgreich' });
});

// --- ALLE (ohne Filter, Vorsicht bei sehr vielen Daten!) ---
exports.listAll = asyncHandler(async (req, res) => {
    const list = await Computer.find({ deleted: { $ne: true } })
        .populate('kategorie')
        .populate('betriebssystem')
        .lean();
    res.status(200).json(list);
});
