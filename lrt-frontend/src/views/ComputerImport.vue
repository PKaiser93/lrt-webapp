<template>
  <div class="container py-4">
    <h2 class="mb-4">📁 <strong>Computer CSV-Import</strong></h2>

    <!-- 📂 Datei auswählen -->
    <div class="mb-4">
      <label class="form-label fw-semibold">CSV-Datei auswählen</label>
      <input
          type="file"
          class="form-control"
          accept=".csv"
          @change="handleFileUpload"
      />
    </div>

    <!-- 🧠 Feld-Mapping -->
    <div v-if="headers.length">
      <h4 class="mt-5 mb-3">🔁 <strong>Feld-Mapping</strong></h4>
      <div class="table-responsive shadow-sm rounded">
        <table class="table table-bordered align-middle bg-white">
          <thead class="table-light">
          <tr><th>🧾 CSV-Spalte</th><th>🎯 Ziel-Feld</th></tr>
          </thead>
          <tbody>
          <tr v-for="(header, index) in headers" :key="index">
            <td>{{ header }}</td>
            <td>
              <select v-model="mapping[header]" class="form-select">
                <option disabled value="">– wählen –</option>
                <option
                    v-for="key in Object.keys(systemFields)"
                    :key="key"
                    :value="key"
                >
                  {{ systemFields[key] }}
                </option>
              </select>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 👁️ Vorschau -->
    <div v-if="rows.length" class="mt-5">
      <h4 class="mb-3">👁️ <strong>Vorschau</strong> (erste 5 Zeilen)</h4>
      <div class="table-responsive rounded shadow-sm">
        <table class="table table-hover table-striped table-sm bg-white">
          <thead class="table-light">
          <tr>
            <th v-for="key in Object.values(mapping).filter(Boolean)" :key="key">{{ systemFields[key] || key }}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(row, i) in mappedPreview.slice(0, 5)" :key="i">
            <td v-for="key in Object.values(mapping).filter(Boolean)" :key="key">{{ row[key] }}</td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- 🚀 Importieren -->
      <div class="text-end mt-3">
        <button class="btn btn-success shadow" @click="importData">
          <i class="bi bi-cloud-upload me-2"></i>
          Importieren ({{ mappedPreview.length }} Einträge)
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import Papa from 'papaparse'
import { ref, computed } from 'vue'
import { showToast } from '../utils/toast'
import http from '../api/http'

const rows = ref([])
const headers = ref([])
const mapping = ref({})

const systemFields = {
  marke: 'Marke', typ: 'Typ', seriennummer: 'Seriennummer', cpu: 'CPU', ram: 'RAM',
  hddssd: 'HDD/SSD', grafikkarte: 'Grafikkarte', chipsatz: 'Chipsatz', tpm: 'TPM',
  bios: 'BIOS', remote: 'Remote', betriebssystem: 'Betriebssystem', version: 'Version',
  abstraktionsebene: 'Abstraktionsebene', dnsName: 'DNS-Name', ipAdresse: 'IP-Adresse',
  macAdresse: 'MAC-Adresse', dhcp: 'DHCP', benutzer: 'Benutzer', idmKennung: 'IdM-Kennung',
  betreuer: 'Betreuer', artDerArbeit: 'Art der Arbeit', startdatum: 'Startdatum',
  abgabe: 'Abgabe', raumnummer: 'Raumnummer', kategorie: 'Kategorie',
  laufendeNummer: 'Laufende Nummer', studPCs: 'StudPCs',
  inventarnummer: 'Inventarnummer', fauInventarnummer: 'FAU-Inventarnummer',
  beschaffungsjahr: 'Beschaffungsjahr', wannErsetzen: 'Wann ersetzen',
  studienzuschuss: 'Studienzuschuss', info: 'Info', todo: 'ToDo', ablauf: 'Ablauf'
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: (result) => {
      headers.value = result.meta.fields
      rows.value = result.data
      mapping.value = Object.fromEntries(headers.value.map(h => [h, '']))
    }
  })
}

const mappedPreview = computed(() =>
    rows.value.map(row => {
      const mapped = {}
      for (const [csvKey, systemKey] of Object.entries(mapping.value)) {
        if (systemKey) mapped[systemKey] = row[csvKey]
      }
      return mapped
    })
)

const importData = async () => {
  try {
    await http.post('/computer/bulk', mappedPreview.value)
    showToast('✅ Import erfolgreich')
  } catch (e) {
    console.error(e)
    showToast('❌ Fehler beim Import', 'danger')
  }
}
</script>
