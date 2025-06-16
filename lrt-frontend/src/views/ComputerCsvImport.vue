<template>
  <div class="container">
    <div class="card">
      <h2>Computer CSV-Import</h2>
      <form @submit.prevent="onUpload">
        <input
            type="file"
            accept=".csv"
            @change="onFileChange"
            required
        />
        <button
            type="submit"
            :disabled="!selectedFile || isLoading"
            class="button primary"
        >
          Datei hochladen & Vorschau
        </button>
      </form>

      <!-- Vorschau nach Upload -->
      <div v-if="preview.length" class="import-preview">
        <h3>Vorschau der ersten Einträge</h3>
        <div class="table-container">
          <table>
            <thead>
            <tr>
              <th v-for="(v, key) in preview[0]" :key="key">{{ key }}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(row, i) in preview" :key="i">
              <td v-for="(v, key) in row" :key="key">{{ v }}</td>
            </tr>
            </tbody>
          </table>
        </div>

        <div class="duplikate-box">
          <b>Gefundene Duplikate (Seriennummer):</b>
          <div v-if="duplikate.length === 0">Keine Duplikate gefunden.</div>
          <div v-else>
            <div
                v-for="sn in duplikate"
                :key="sn"
                class="duplikat-row"
            >
              <span class="seriennummer">{{ sn }}</span>
              <label>
                <input
                    type="radio"
                    :name="'action-' + sn"
                    value="replace"
                    v-model="entscheidungen[sn]"
                />
                Ersetzen
              </label>
              <label>
                <input
                    type="radio"
                    :name="'action-' + sn"
                    value="skip"
                    v-model="entscheidungen[sn]"
                />
                Überspringen
              </label>
            </div>
          </div>
        </div>

        <button
            class="button success"
            @click="onImport"
            :disabled="isImporting"
        >
          Import starten
        </button>
      </div>

      <!-- Ergebnis -->
      <div v-if="importErgebnis" class="import-result">
        <h4>Import-Ergebnis:</h4>
        <div>Neu: {{ importErgebnis.neu }}</div>
        <div>Ersetzt: {{ importErgebnis.ersetzt }}</div>
        <div>Übersprungen: {{ importErgebnis.übersprungen }}</div>
        <div v-if="importErgebnis.fehler && importErgebnis.fehler.length">
          <b>Fehler:</b>
          <ul>
            <li v-for="(f, i) in importErgebnis.fehler" :key="i">
              {{ f.seriennummer }}: {{ f.fehler }}
            </li>
          </ul>
        </div>
      </div>

      <div v-if="isLoading || isImporting" class="loading-bar">
        <span>Lade...</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const selectedFile = ref(null)
const preview = ref([])
const duplikate = ref([])
const entscheidungen = ref({})
const isLoading = ref(false)
const isImporting = ref(false)
const importErgebnis = ref(null)

function onFileChange(e) {
  selectedFile.value = e.target.files[0]
  preview.value = []
  duplikate.value = []
  entscheidungen.value = {}
  importErgebnis.value = null
}

async function onUpload() {
  if (!selectedFile.value) return
  isLoading.value = true
  preview.value = []
  duplikate.value = []
  entscheidungen.value = {}
  importErgebnis.value = null

  const formData = new FormData()
  formData.append('file', selectedFile.value)

  try {
    const res = await fetch('/api/csv/upload', {
      method: 'POST',
      body: formData,
    })
    if (!res.ok) throw new Error('Fehler beim Upload!')
    const data = await res.json()
    preview.value = data.preview || []
    duplikate.value = data.duplikate || []
    duplikate.value.forEach(sn => {
      entscheidungen.value[sn] = 'skip'
    })
  } catch (e) {
    alert('Fehler: ' + e.message)
  } finally {
    isLoading.value = false
  }
}

async function onImport() {
  if (!selectedFile.value) return
  isImporting.value = true
  importErgebnis.value = null

  const formData = new FormData()
  formData.append('file', selectedFile.value)
  formData.append('entscheidungen', JSON.stringify(entscheidungen.value))

  try {
    const res = await fetch('/api/csv/import', {
      method: 'POST',
      body: formData,
    })
    if (!res.ok) throw new Error('Fehler beim Import!')
    importErgebnis.value = await res.json()
  } catch (e) {
    alert('Fehler: ' + e.message)
  } finally {
    isImporting.value = false
  }
}
</script>

<style scoped>
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px 10px;
}
.card {
  background: #fff;
  padding: 24px 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px #0001;
}
h2, h3, h4 {
  margin-bottom: 12px;
}
.table-container {
  overflow-x: auto;
  margin-bottom: 16px;
}
table {
  width: 100%;
  border-collapse: collapse;
  background: #f8f8f8;
}
th, td {
  border: 1px solid #ddd;
  padding: 5px 7px;
  text-align: left;
}
th {
  background: #eee;
}
.button {
  padding: 7px 18px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  margin-right: 8px;
  margin-top: 14px;
  font-weight: 600;
  font-size: 1rem;
}
.button.primary {
  background: #1976d2;
  color: #fff;
}
.button.success {
  background: #4caf50;
  color: #fff;
}
.import-preview, .import-result {
  margin-top: 24px;
}
.loading-bar {
  margin-top: 16px;
}
.duplikate-box {
  margin-bottom: 16px;
}
.duplikat-row {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 4px;
}
.seriennummer {
  font-family: monospace;
  background: #f3f3f3;
  border-radius: 4px;
  padding: 1px 6px;
}
</style>
