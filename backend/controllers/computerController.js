const Computer = require('../models/Computer')

// --- CREATE ---
exports.createComputer = async (req, res) => {
    try {
        const computer = new Computer(req.body)
        await computer.save()
        // Direkt populated zurückgeben
        const populated = await Computer.findById(computer._id)
            .populate('kategorie')
            .populate('betriebssystem')
        res.status(201).json(populated)
    } catch (err) {
        res.status(400).json({ error: err?.message || 'Computer konnte nicht erstellt werden.' })
    }
}

// --- UPDATE ---
exports.updateComputer = async (req, res) => {
    try {
        const updated = await Computer.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        if (!updated) return res.status(404).json({ error: 'Computer nicht gefunden.' })
        const populated = await Computer.findById(updated._id)
            .populate('kategorie')
            .populate('betriebssystem')
        res.json(populated)
    } catch (err) {
        res.status(400).json({ error: err?.message || 'Update fehlgeschlagen.' })
    }
}

// --- SOFT DELETE ---
exports.softDeleteComputer = async (req, res) => {
    try {
        const updated = await Computer.findByIdAndUpdate(
            req.params.id,
            { deleted: true },
            { new: true }
        )
        if (!updated) return res.status(404).json({ error: 'Computer nicht gefunden.' })
        res.json({ message: 'Computer gelöscht (soft delete)' })
    } catch (err) {
        res.status(400).json({ error: err?.message || 'Soft delete fehlgeschlagen.' })
    }
}

// --- RESTORE ---
exports.restoreComputer = async (req, res) => {
    try {
        const updated = await Computer.findByIdAndUpdate(
            req.params.id,
            { deleted: false },
            { new: true }
        )
        if (!updated) return res.status(404).json({ error: 'Computer nicht gefunden.' })
        res.json({ message: 'Computer wiederhergestellt' })
    } catch (err) {
        res.status(400).json({ error: err?.message || 'Restore fehlgeschlagen.' })
    }
}

// --- EINZELN / ID ---
exports.getComputerById = async (req, res) => {
    try {
        const computer = await Computer.findById(req.params.id)
            .populate('kategorie')
            .populate('betriebssystem')
        if (!computer) return res.status(404).json({ error: 'Computer nicht gefunden.' })
        res.json(computer)
    } catch (err) {
        res.status(404).json({ error: err?.message || 'Fehler beim Abrufen.' })
    }
}

// --- ADVANCED SEARCH ---
// Query Parser
function parseAdvancedSearch(search) {
    const expr = /\b(\w+)\s*(:|=|>=|<=|>|<)\s*([^\s&]+)/gi
    let match, rules = []
    let rest = search
    while ((match = expr.exec(search)) !== null) {
        rules.push({
            field: match[1].toLowerCase(),
            op: match[2],
            value: match[3]
        })
        rest = rest.replace(match[0], '')
    }
    rest = rest.replace(/&+/g, ' ').trim()
    return { rules, text: rest }
}

// Frontend → DB Feldmapping
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
    // ggf. weitere Mappings
}

// INT-Felder mit Vergleichsoperatoren
const INT_FIELDS = [
    'ram', 'beschaffungsjahr', 'inventarnummer', 'laufendeNummer', 'studPCs', 'studienzuschuss'
]

// --- Die Advanced Search für /computer/search ---
exports.advancedSearchComputers = async (req, res) => {
    try {
        const { query = '', regex = 'false' } = req.query
        const useRegex = regex === 'true'
        const { rules, text } = parseAdvancedSearch(query)
        const filter = { deleted: false }

        // Suche nach Regeln
        rules.forEach(rule => {
            let field = FIELD_MAP[rule.field] || rule.field
            // INT: mit Operatoren
            if (INT_FIELDS.includes(field)) {
                let val = Number(rule.value)
                if (isNaN(val)) return
                if (!filter[field] || typeof filter[field] !== 'object') filter[field] = {}
                switch (rule.op) {
                    case '=':
                    case ':':
                        filter[field] = val
                        break
                    case '>=':
                        filter[field]['$gte'] = val
                        break
                    case '<=':
                        filter[field]['$lte'] = val
                        break
                    case '>':
                        filter[field]['$gt'] = val
                        break
                    case '<':
                        filter[field]['$lt'] = val
                        break
                }
            } else if (['kategorie', 'betriebssystem'].includes(field)) {
                filter[field] = rule.value
            } else {
                // Stringfelder
                if (rule.op === ':' || rule.op === '=') {
                    if (useRegex || rule.op === ':') {
                        filter[field] = { $regex: rule.value, $options: 'i' }
                    } else {
                        filter[field] = rule.value
                    }
                }
            }
        })

        // Freitextsuche (optional)
        if (text) {
            const textRegex = useRegex
                ? new RegExp(text, 'i')
                : new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
            const orFields = [
                'dnsName', 'benutzer', 'cpu', 'marke', 'typ', 'seriennummer', 'grafikkarte',
                'chipsatz', 'tpm', 'bios', 'remote', 'version', 'abstraktionsebene', 'ipAdresse',
                'macAdresse', 'betreuer', 'artDerArbeit', 'raumnummer', 'fauInventarnummer', 'info', 'todo', 'ablauf'
            ]
            filter['$or'] = orFields.map(f => ({ [f]: { $regex: textRegex } }))
        }

        // Query ausführen (optional: Paging implementieren!)
        const result = await Computer.find(filter)
            .populate('betriebssystem')
            .populate('kategorie')
            .limit(1000) // Limit einstellbar!
            .lean()

        res.json(result)
    } catch (err) {
        res.status(500).json({ error: err.message || 'Advanced Search fehlgeschlagen.' })
    }
}
