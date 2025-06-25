// importComputersFromJson.js
const fs = require('fs');
const path = require('path');

const mongoose = require('mongoose');

// Passe ggf. diesen Pfad an dein Projekt an:
const Computer = require('../models/Computer');

// 1. Lade alle Kategorien aus JSON-Export (z.B. lrtdb.kategories.json)
const kategorien = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'lrtdb.kategories.json'), 'utf8'),
);

// 2. Erzeuge Lookup: bezeichnung → _id (IMMER als String!)
const kategorieLookup = {};
kategorien.forEach(kat => {
  if (kat.bezeichnung && kat._id) {
    let id = kat._id;
    if (typeof id === 'object' && id.$oid) {
      id = id.$oid;
    }
    kategorieLookup[kat.bezeichnung.trim()] = String(id);
  }
});

// 3. Lade Computer-JSON
const computerList = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'computer.json'), 'utf8'),
);

// 4. Mapping-Funktion
function mapRecord(record) {
  // Definiere das Mapping zwischen JSON-Key und DB-Key:
  const JSON_TO_DB_MAP = {
    'Marke': 'marke',
    'Typ': 'typ',
    'Seriennummer': 'seriennummer',
    'CPU': 'cpu',
    'RAM': 'ram',
    'Festplattenplatz': 'hddssd',
    'Grafikkarte': 'grafikkarte',
    'Chipsatz': 'chipsatz',
    'TPM': 'tpm',
    'BIOS': 'bios',
    'Remote': 'remote',
    'Betriebssystem': 'betriebssystem',
    'Version': 'version',
    'Abstr_Ebene': 'abstraktionsebene',
    'DNS': 'dnsName',
    'IP_Adresse': 'ipAdresse',
    'MAC_Adresse': 'macAdresse',
    'DHCP': 'dhcp',
    'Benutzer': 'benutzer',
    'Benutzerkennung': 'idmKennung',
    'Betreuer': 'betreuer',
    'Art': 'artDerArbeit',
    'Startdatum': 'startdatum',
    'Abgabe': 'abgabe',
    'Raumnummer': 'raumnummer',
    'Gruppe': 'kategorie',
    'Inventarnummer': 'inventarnummer',
    'FAU_Inventar': 'fauInventarnummer',
    'Jahr': 'beschaffungsjahr',
    'lfd': 'laufendeNummer',
    'Stud_PCs': 'studPCs',
    'Stud_Zuschuss': 'studienzuschuss',
    'Info': 'info',
    'ToDo': 'todo',
    'Ablauf': 'ablauf',
  };

  const mapped = {};
  for (const [jsonKey, dbKey] of Object.entries(JSON_TO_DB_MAP)) {
    let value = record[jsonKey];

    // Leere Strings/null auf undefined
    if (value === '' || value === null) value = undefined;

    // Zahlenfelder konvertieren
    if (
      ['ram', 'laufendeNummer', 'studPCs', 'inventarnummer', 'beschaffungsjahr', 'studienzuschuss'].includes(dbKey)
    ) {
      value = value && !isNaN(Number(value)) ? Number(value) : undefined;
    }

    // Kategorienamen → ObjectId (als String!)
    if (dbKey === 'kategorie') {
      value = value && kategorieLookup[value] ? kategorieLookup[value] : undefined;
    }

    // DHCP-Mapping (nur gültige Werte erlauben, Enum ["Ja", "Nein"])
    if (dbKey === 'dhcp') {
      if (value === 'Ja') value = 'ja';
      else if (value === 'Nein') value = 'nein';
      else value = undefined;
    }

    mapped[dbKey] = value;
  }
  return mapped;
}

async function run() {
  await mongoose.connect('mongodb://localhost:27017/lrtdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  let importiert = 0, ersetzt = 0, fehler = 0;
  for (const rec of computerList) {
    const data = mapRecord(rec);

    try {
      // Prüfe auf Duplikat per Seriennummer
      if (data.seriennummer) {
        const existing = await Computer.findOne({ seriennummer: data.seriennummer });
        if (existing) {
          await Computer.updateOne({ seriennummer: data.seriennummer }, { $set: data });
          ersetzt++;
          continue;
        }
      }
      await Computer.create(data);
      importiert++;
    } catch (e) {
      console.error('Fehler beim Import:', e.message, '\nDatensatz:', data);
      fehler++;
    }
  }

  console.log(`Fertig! ${importiert} importiert, ${ersetzt} ersetzt, ${fehler} Fehler.`);
  process.exit();
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
