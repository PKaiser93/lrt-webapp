<template>
  <div class="container py-4">
    <h2>💽 Betriebssystem CSV-Import</h2>

    <!-- Datei-Upload -->
    <div class="mb-3">
      <input type="file" class="form-control" accept=".csv" @change="handleFileUpload" />
    </div>

    <!-- Mapping -->
    <div v-if="headers.length">
      <h4 class="mt-4">🔁 Feld-Mapping</h4>
      <table class="table table-bordered align-middle">
        <thead><tr><th>CSV-Spalte</th><th>Ziel-Feld</th></tr></thead>
        <tbody>
        <tr v-for="(header, index) in headers" :key="index">
          <td>{{ header }}</td>
          <td>
            <select v-model="mapping[header]" class="form-select">
              <option disabled value="">– wählen –</option>
              <option v-for="(label, key) in osFields" :key="key" :value="key">
                {{ label }}
              </option>
            </select>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Vorschau -->
    <div v-if="rows.length" class="mt-4">
      <h4>👁️ Vorschau (erste 5 Einträge)</h4>
      <table class="table table-hover table-striped table-sm">
        <thead>
        <tr>
          <th v-for="key in Object.values(mapping).filter(Boolean)" :key="key">{{ key }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(row, i) in mappedPreview.slice(0, 5)" :key="i">
          <td v-for="key in Object.values(mapping).filter(Boolean)" :key="key">{{ row[key] }}</td>
        </tr>
        </tbody>
      </table>

      <button class="btn btn-success mt-3" @click="importData">
        🚀 Importieren ({{ mappedPreview.length }} Einträge)
      </button>
    </div>
  </div>
</template>

<script setup>
import Papa from 'papaparse'
import { ref, computed } from 'vue'
import http from '../api/http'
import { showToast } from '../utils/toast'

// 👇 Betriebssystem-Felder
const osFields = {
  name: 'Name',
  version: 'Version',
  architektur: 'Architektur',
  abstraktionsebene: 'Abstraktionsebene'
}

const rows = ref([])
const headers = ref([])
const mapping = ref({})

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

const mappedPreview = computed(() => {
  return rows.value.map(row => {
    const mapped = {}
    for (const [csvKey, systemKey] of Object.entries(mapping.value)) {
      if (systemKey) mapped[systemKey] = row[csvKey]
    }
    return mapped
  })
})

const importData = async () => {
  try {
    await http.post('/betriebssystem/import', mappedPreview.value)
    showToast('✅ Betriebssystem-Import erfolgreich')
  } catch (e) {
    console.error(e)
    showToast('❌ Fehler beim Import', 'danger')
  }
}
</script>
