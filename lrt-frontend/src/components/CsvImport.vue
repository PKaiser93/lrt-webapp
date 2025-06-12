<template>
  <div class="container py-4">
    <h2 class="mb-4">📄 CSV-Import</h2>

    <!-- CSV-Upload -->
    <div class="mb-3">
      <input type="file" class="form-control" @change="handleFileUpload" accept=".csv" />
    </div>

    <!-- Mapping-Tabelle -->
    <div v-if="headers.length" class="table-responsive mt-4">
      <h5>🔁 Feld-Mapping</h5>
      <table class="table table-bordered table-striped align-middle">
        <thead>
        <tr>
          <th>CSV-Spalte</th>
          <th>Feld im System</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(header, index) in headers" :key="index">
          <td>{{ header }}</td>
          <td>
            <select v-model="mapping[header]" class="form-select">
              <option disabled value="">– wählen –</option>
              <option v-for="(fieldLabel, fieldKey) in systemFields" :key="fieldKey" :value="fieldKey">
                {{ fieldLabel }}
              </option>
            </select>
          </td>
        </tr>
        </tbody>
      </table>

      <button class="btn btn-success mt-3" @click="submit">🚀 Importieren</button>
    </div>
  </div>
</template>

<script setup>
import Papa from 'papaparse'
import { ref } from 'vue'
import http from '../api/http'
import { showToast } from '../utils/toast'

const headers = ref([])
const rows = ref([])
const mapping = ref({})

// Optionen für Mapping
const systemFields = {
  marke: 'Marke',
  typ: 'Typ',
  seriennummer: 'Seriennummer',
  cpu: 'CPU',
  ram: 'RAM',
  hddssd: 'HDD/SSD',
  grafikkarte: 'Grafikkarte',
  chipsatz: 'Chipsatz',
  tpm: 'TPM',
  bios: 'BIOS',
  remote: 'Remote',
  betriebssystem: 'Betriebssystem',
  version: 'Version',
  abstraktionsebene: 'Abstraktionsebene',
  dnsName: 'DNS-Name',
  ipAdresse: 'IP-Adresse',
  macAdresse: 'MAC-Adresse',
  dhcp: 'DHCP',
  benutzer: 'Benutzer',
  idmKennung: 'IdM-Kennung',
  betreuer: 'Betreuer',
  artDerArbeit: 'Art der Arbeit',
  startdatum: 'Startdatum',
  abgabe: 'Abgabe',
  raumnummer: 'Raumnummer',
  kategorie: 'Kategorie',
  laufendeNummer: 'Laufende Nummer',
  studPCs: 'StudPCs',
  inventarnummer: 'Inventarnummer',
  fauInventarnummer: 'FAU-Inventarnummer',
  beschaffungsjahr: 'Beschaffungsjahr',
  wannErsetzen: 'Wann ersetzen',
  studienzuschuss: 'Studienzuschuss',
  info: 'Info',
  todo: 'ToDo',
  ablauf: 'Ablauf'
}

const handleFileUpload = (e) => {
  const file = e.target.files[0]
  if (!file) return

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: (result) => {
      headers.value = result.meta.fields
      rows.value = result.data
      headers.value.forEach(h => {
        mapping.value[h] = '' // default: leer
      })
    }
  })
}

const submit = async () => {
  // 🔁 Mapping anwenden
  const mappedRows = rows.value.map(row => {
    const newRow = {}
    for (const [csvKey, systemKey] of Object.entries(mapping.value)) {
      if (systemKey) newRow[systemKey] = row[csvKey]
    }
    return newRow
  })

  try {
    await http.post('/csv/import', { rows: mappedRows })
    showToast('✅ CSV erfolgreich importiert')
  } catch (err) {
    console.error(err)
    showToast('❌ Fehler beim Import', 'danger')
  }
}
</script>
