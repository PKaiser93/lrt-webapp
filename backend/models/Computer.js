const mongoose = require('mongoose');

const ComputerSchema = new mongoose.Schema({
    deleted: { type: Boolean, default: false },

    // Computerinformationen
    marke: { type: String, required: true },
    typ: { type: String, required: true },
    seriennummer: { type: String, unique: true, sparse: true },
    cpu: String,
    ram: Number,
    hddssd: String,
    grafikkarte: String,
    chipsatz: String,
    tpm: String,
    bios: String,
    remote: String,

    // Betriebssysteminformationen
    betriebssystem: { type: mongoose.Schema.Types.ObjectId, ref: 'Betriebssystem' },
    version: String,
    abstraktionsebene: String,
    kernel: String,

    // Netzwerkinformationen
    dnsName: String,
    ipAdresse: String,
    macAdresse: String,
    dhcp: { type: Boolean, default: false }, // Optimierung: Boolean statt Enum/String

    // Benutzerinformationen
    benutzer: String,
    idmKennung: String,
    betreuer: String,
    artDerArbeit: String,
    startdatum: { type: Date },  // Optimierung: Date statt String
    abgabe: { type: Date },      // Optimierung: Date statt String

    // Rauminformationen
    raumnummer: String,
    kategorie: { type: mongoose.Schema.Types.ObjectId, ref: 'Kategorie' },
    laufendeNummer: Number,
    studPCs: Number,

    // Beschaffungsinformationen
    inventarnummer: Number,
    fauInventarnummer: String,
    beschaffungsjahr: Number,
    wannErsetzen: String,
    studienzuschuss: Number,

    // Sonstiges
    info: String,
    todo: String,
    ablauf: String,

    // Status
    status: {
        type: String,
        enum: ['in_betrieb', 'bald_ersetzen', 'ausser_betrieb', 'unbekannt'],
        default: 'unbekannt'
    },
    documents: [String] // Optional: Array aller Dateinamen
}, { timestamps: true });

// Indexe
ComputerSchema.index({ deleted: 1 });
ComputerSchema.index({ status: 1 });
ComputerSchema.index({ kategorie: 1 });
ComputerSchema.index({ betriebssystem: 1 });
ComputerSchema.index({ beschaffungsjahr: 1 });

module.exports = mongoose.model('Computer', ComputerSchema);
