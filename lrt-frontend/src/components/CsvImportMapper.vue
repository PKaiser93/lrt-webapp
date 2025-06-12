<template>
  <div>
    <input type="file" @change="loadFile" accept=".csv" class="form-control mb-3" />

    <div v-if="csvHeaders.length">
      <h5>🔀 Spalten-Mapping</h5>
      <div v-for="(header, i) in csvHeaders" :key="i" class="mb-2">
        <label>{{ header }}</label>
        <select class="form-select" v-model="mapping[header]">
          <option disabled value="">-- Zuordnung wählen --</option>
          <option v-for="(target, key) in fieldOptions" :key="key" :value="key">{{ target }}</option>
        </select>
      </div>

      <h5 class="mt-4">👀 Vorschau</h5>
      <table class="table table-sm table-striped">
        <thead>
        <tr>
          <th v-for="header in csvHeaders" :key="header">{{ header }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(row, idx) in previewRows" :key="idx">
          <td v-for="header in csvHeaders" :key="header">{{ row[header] }}</td>
        </tr>
        </tbody>
      </table>

      <button class="btn btn-success mt-3" @click="importData">🚀 Importieren</button>
    </div>
  </div>
</template>

<script setup>
import Papa from 'papaparse'
import { ref } from 'vue'
import http from '../api/http'
import { showToast } from '../utils/toast'

const props = defineProps({
  importEndpoint: String,
  fieldOptions: Object
})

const csvHeaders = ref([])
const previewRows = ref([])
const mapping = ref({})
const rawData = ref([])

const loadFile = (e) => {
  const file = e.target.files[0]
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: (res) => {
      rawData.value = res.data
      csvHeaders.value = Object.keys(res.data[0])
      previewRows.value = res.data.slice(0, 5)
      mapping.value = Object.fromEntries(csvHeaders.value.map(key => [key, '']))
    }
  })
}

const importData = async () => {
  const mapped = rawData.value.map(row => {
    const newRow = {}
    for (const key in mapping.value) {
      if (mapping.value[key]) {
        newRow[mapping.value[key]] = row[key]
      }
    }
    return newRow
  })

  try {
    await http.post(props.importEndpoint, mapped)
    showToast('Import erfolgreich 🎉')
  } catch (e) {
    showToast('Fehler beim Import', 'danger')
  }
}
</script>
