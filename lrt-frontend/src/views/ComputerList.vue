<template>
  <div class="container py-4">
    <h2 class="mb-4">🖥️ Computerliste</h2>

    <!-- 🔍 Suche & Filter -->
    <div class="row mb-4">
      <div class="col-md-4">
        <input v-model="search" class="form-control" placeholder="🔍 Suche, z.B. DNS:lrt076 RAM:>=16" />
      </div>
      <div class="form-check form-switch ms-2">
        <input class="form-check-input" type="checkbox" id="regexSwitch" v-model="useRegex">
        <label class="form-check-label" for="regexSwitch">Regex/Teilwortsuche</label>
      </div>
      <div class="col-md-3">
        <select v-model="selectedKategorie" class="form-select">
          <option value="">📁 Kategorie (alle)</option>
          <option v-for="k in kategorieList" :key="k._id" :value="k.bezeichnung">{{ k.bezeichnung }}</option>
        </select>
      </div>
      <div class="col-md-3">
        <select v-model="selectedOS" class="form-select">
          <option value="">💽 OS (alle)</option>
          <option v-for="os in osList" :key="os._id" :value="os.name">{{ os.name }}</option>
        </select>
      </div>
    </div>

    <!-- Ladeindikator und Fehleranzeige -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"><span class="visually-hidden">Lade...</span></div>
    </div>
    <div v-else>
      <div v-if="error" class="alert alert-danger mb-3">{{ error }}</div>
      <!-- Tabelle -->
      <table class="table table-striped table-hover align-middle">
        <thead>
        <tr>
          <th>DNS</th>
          <th>IP</th>
          <th>Marke</th>
          <th>CPU</th>
          <th>RAM</th>
          <th>Raum</th>
          <th>Kategorie</th>
          <th>🛠️ Aktionen</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="comp in paginatedComputers" :key="comp._id">
          <td>{{ comp.dnsName }}</td>
          <td>{{ comp.ipAdresse }}</td>
          <td>{{ comp.marke }}</td>
          <td>{{ comp.cpu }}</td>
          <td>{{ comp.ram }}</td>
          <td>{{ comp.raumnummer }}</td>
          <td>
            <span class="badge text-dark" :style="{ backgroundColor: comp.kategorie?.farbe || '#aaa' }">
              {{ comp.kategorie?.bezeichnung || '—' }}
            </span>
          </td>
          <td>
            <router-link
                :to="`/computer/${comp._id}`"
                class="btn btn-sm btn-outline-primary me-1"
                title="Bearbeiten"
            >✏️</router-link>
            <button
                class="btn btn-sm btn-outline-danger"
                @click="deleteComputer(comp._id)"
                :disabled="deletingId === comp._id"
                title="Löschen"
            >
              <span v-if="deletingId === comp._id" class="spinner-border spinner-border-sm"></span>
              <span v-else>🗑️</span>
            </button>
          </td>
        </tr>
        </tbody>
      </table>

      <!-- 📄 Pagination -->
      <nav v-if="totalPages > 1">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: page === 1 }">
            <a class="page-link" @click.prevent="page > 1 && page--">«</a>
          </li>
          <li
              class="page-item"
              v-for="n in totalPages"
              :key="n"
              :class="{ active: page === n }"
          >
            <a class="page-link" @click.prevent="page = n">{{ n }}</a>
          </li>
          <li class="page-item" :class="{ disabled: page === totalPages }">
            <a class="page-link" @click.prevent="page < totalPages && page++">»</a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import http from '../api/http'
import { showToast } from '../utils/toast'

const computers = ref([])
const kategorieList = ref([])
const osList = ref([])
const loading = ref(false)
const error = ref('')
const deletingId = ref(null)

const search = ref('')
const debouncedSearch = ref('')
const selectedKategorie = ref('')
const selectedOS = ref('')
const page = ref(1)
const perPage = 10

const useRegex = ref(false)

// Debounce für Suche
let searchTimeout = null
watch(search, value => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    debouncedSearch.value = value
    page.value = 1
  }, 300)
})

// Serverseitige Suche (immer wenn Suche/Kat/OS/Regex sich ändert)
async function fetchComputers() {
  loading.value = true
  error.value = ''
  try {
    // Query zusammenbauen
    let query = debouncedSearch.value
    if (selectedKategorie.value) query += ` KATEGORIE:${selectedKategorie.value}`
    if (selectedOS.value) query += ` OS:${selectedOS.value}`
    const params = new URLSearchParams()
    params.set('query', query)
    params.set('regex', useRegex.value ? 'true' : 'false')

    const [c, k, o] = await Promise.all([
      http.get('/computer/search?' + params.toString()),
      http.get('/kategorie'),
      http.get('/betriebssystem')
    ])
    computers.value = c.data
    kategorieList.value = k.data
    osList.value = o.data
  } catch (err) {
    showToast(err?.response?.data?.error || 'Fehler beim Laden der Daten', 'danger')
    error.value = err?.message || 'Unbekannter Fehler'
  } finally {
    loading.value = false
  }
}

// Automatisch nachladen bei Such-/Filter-Änderung
watch([debouncedSearch, selectedKategorie, selectedOS, useRegex], fetchComputers, { immediate: true })

// Löschfunktion mit Bestätigung
const deleteComputer = async (id) => {
  if (!confirm('Willst du diesen Computer wirklich löschen?')) return
  deletingId.value = id
  try {
    await http.delete(`/computer/${id}`)
    // Nach Löschen neu laden
    await fetchComputers()
    showToast('Computer gelöscht', 'success')
  } catch (err) {
    showToast(err?.response?.data?.error || 'Löschen fehlgeschlagen', 'danger')
  } finally {
    deletingId.value = null
  }
}

// Pagination
const totalPages = computed(() =>
    Math.ceil(computers.value.length / perPage)
)

const paginatedComputers = computed(() => {
  const start = (page.value - 1) * perPage
  return computers.value.slice(start, start + perPage)
})
</script>
