<template>
  <div>
    <h2>📄 CSV-Import</h2>
    <input type="file" @change="onFileChange" accept=".csv"/>
    <div v-if="rows.length">
      <h4>Vorschau ({{ previewCount }} Zeilen)</h4>
      <table>
        <thead>
        <tr>
          <th v-for="h in headers" :key="h">{{ h }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(row, idx) in previewRows" :key="idx">
          <td v-for="h in headers" :key="h">{{ row[h] }}</td>
        </tr>
        </tbody>
      </table>
      <div class="mt-3">
        <button v-if="!confirmed" @click="confirmPreview" class="btn btn-primary">
          ✅ Diese Daten importieren?
        </button>
        <button v-else @click="doImport" :disabled="importing" class="btn btn-success">
          🚀 Import ausführen <span v-if="importing">...</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import Papa from 'papaparse'
import { computed, ref } from 'vue'
import http from '../api/http'
import { showToast } from '../utils/toast'

const headers = ref([])
const rows = ref([])
const previewCount = 10
const confirmed = ref(false)
const importing = ref(false)

const onFileChange = e => {
  const file = e.target.files[0]
  if (!file) return
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: result => {
      headers.value = result.meta.fields
      rows.value = result.data
      confirmed.value = false
    }
  })
}

const previewRows = computed(() => rows.value.slice(0, previewCount))

const confirmPreview = async () => {
  // Starte Dryrun gegen das Backend, um Validierung und Mapping zu sehen
  try {
    const res = await http.post('/csv/import?dryrun=true', { rows: rows.value })
    if (res.data && res.data.preview) {
      // Option: Zeige Backend-Preview/Validierung statt der lokalen CSV
      showToast(`Vorschau OK – insgesamt ${res.data.total} Zeilen gefunden.`, 'info')
      confirmed.value = true
    } else {
      showToast('Fehler in der Vorschau/Validierung', 'danger')
    }
  } catch (err) {
    showToast(err?.response?.data?.error || 'Fehler beim Dryrun', 'danger')
  }
}

const doImport = async () => {
  importing.value = true
  try {
    const BATCH_SIZE = 1000
    for (let i = 0; i < rows.value.length; i += BATCH_SIZE) {
      const batch = rows.value.slice(i, i + BATCH_SIZE)
      await http.post('/csv/import', { rows: batch })
    }
    showToast('Import erfolgreich!', 'success')
    rows.value = []
    confirmed.value = false
  } catch (err) {
    showToast(err?.response?.data?.error || 'Fehler beim Import', 'danger')
  } finally {
    importing.value = false
  }
}
</script>
