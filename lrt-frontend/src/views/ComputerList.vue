<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap">
      <h2 class="mb-0">🖥️ Computerliste</h2>
      <button class="btn btn-success d-flex align-items-center" @click="showAddModal = true">
        <span class="me-2">➕</span> Neu anlegen
      </button>
    </div>

    <!-- 🔍 Suche & Filter -->
    <div class="row mb-4 g-2 align-items-end">
      <div class="col-md-4">
        <input v-model="search" class="form-control" placeholder="🔍 Suche, z.B. DNS:lrt076 RAM<16" />
      </div>
      <div class="col-auto">
        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" id="regexSwitch" v-model="useRegex">
          <label class="form-check-label" for="regexSwitch">Regex/Teilwortsuche</label>
        </div>
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
      <div class="table-responsive">
        <table class="table table-striped table-hover align-middle">
          <thead>
          <tr>
            <th @click="sortBy('dnsName')" style="cursor:pointer">
              DNS
              <span v-if="sortField === 'dnsName'">
                <span v-if="sortDir === 'asc'">▲</span>
                <span v-else>▼</span>
              </span>
              <span v-else style="opacity:.5">↕</span>
            </th>
            <th @click="sortBy('ipAdresse')" style="cursor:pointer">
              IP
              <span v-if="sortField === 'ipAdresse'">
                <span v-if="sortDir === 'asc'">▲</span>
                <span v-else>▼</span>
              </span>
              <span v-else style="opacity:.5">↕</span>
            </th>
            <th @click="sortBy('marke')" style="cursor:pointer">
              Marke
              <span v-if="sortField === 'marke'">
                <span v-if="sortDir === 'asc'">▲</span>
                <span v-else>▼</span>
              </span>
              <span v-else style="opacity:.5">↕</span>
            </th>
            <th @click="sortBy('cpu')" style="cursor:pointer">
              CPU
              <span v-if="sortField === 'cpu'">
                <span v-if="sortDir === 'asc'">▲</span>
                <span v-else>▼</span>
              </span>
              <span v-else style="opacity:.5">↕</span>
            </th>
            <th @click="sortBy('ram')" style="cursor:pointer">
              RAM
              <span v-if="sortField === 'ram'">
                <span v-if="sortDir === 'asc'">▲</span>
                <span v-else>▼</span>
              </span>
              <span v-else style="opacity:.5">↕</span>
            </th>
            <th @click="sortBy('raumnummer')" style="cursor:pointer">
              Raum
              <span v-if="sortField === 'raumnummer'">
                <span v-if="sortDir === 'asc'">▲</span>
                <span v-else>▼</span>
              </span>
              <span v-else style="opacity:.5">↕</span>
            </th>
            <th @click="sortBy('kategorie.bezeichnung')" style="cursor:pointer">
              Kategorie
              <span v-if="sortField === 'kategorie.bezeichnung'">
                <span v-if="sortDir === 'asc'">▲</span>
                <span v-else>▼</span>
              </span>
              <span v-else style="opacity:.5">↕</span>
            </th>
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
              <!-- Detail-Seite -->
              <router-link
                  :to="`/computer/${comp._id}`"
                  class="btn btn-sm btn-outline-secondary me-1"
                  title="Details"
              >🔍</router-link>

              <!-- Bearbeiten -->
              <router-link
                  :to="`/computer/${comp._id}/edit`"
                  class="btn btn-sm btn-outline-primary me-1"
                  title="Bearbeiten"
              >✏️</router-link>

              <!-- Löschen -->
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
      </div>

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

    <!-- MODAL: Neuer Computer anlegen (wie gehabt) -->
    <div class="modal fade show" tabindex="-1" style="display: block; background: rgba(0,0,0,0.3)" v-if="showAddModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <form @submit.prevent="addComputer">
            <div class="modal-header">
              <h5 class="modal-title">Neuen Computer anlegen</h5>
              <button type="button" class="btn-close" @click="showAddModal = false"></button>
            </div>
            <div class="modal-body">
              <div class="mb-2">
                <label class="form-label">Marke</label>
                <input v-model="addForm.marke" class="form-control" required />
              </div>
              <div class="mb-2">
                <label class="form-label">Typ</label>
                <input v-model="addForm.typ" class="form-control" />
              </div>
              <div class="mb-2">
                <label class="form-label">DNS</label>
                <input v-model="addForm.dnsName" class="form-control" />
              </div>
              <div class="mb-2">
                <label class="form-label">IP-Adresse</label>
                <input v-model="addForm.ipAdresse" class="form-control" />
              </div>
              <div class="mb-2">
                <label class="form-label">RAM (GB)</label>
                <input v-model.number="addForm.ram" type="number" class="form-control" />
              </div>
              <div class="mb-2">
                <label class="form-label">Kategorie</label>
                <select v-model="addForm.kategorie" class="form-select">
                  <option value="">—</option>
                  <option v-for="k in kategorieList" :key="k._id" :value="k._id">{{ k.bezeichnung }}</option>
                </select>
              </div>
            </div>
            <div class="modal-footer">
              <button type="submit" class="btn btn-success">
                <span v-if="adding">Anlegen...</span>
                <span v-else>Speichern</span>
              </button>
              <button type="button" class="btn btn-secondary" @click="showAddModal = false" :disabled="adding">Abbrechen</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div v-if="showAddModal" class="modal-backdrop fade show"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import http from '../api/http'
import { showToast } from '../utils/toast'

// Sort-Icons als Mini-Komponente (Pfeil hoch/runter je nach Status)
const SortIcon = {
  props: ['field', 'sortField', 'sortDir'],
  template: `
    <span v-if="field === sortField">
      <span v-if="sortDir === 'asc'">▲</span>
      <span v-else>▼</span>
    </span>
    <span v-else style="opacity:.5">↕</span>
  `
}

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
const perPage = 25

const useRegex = ref(false)

const showAddModal = ref(false)
const adding = ref(false)
const addForm = ref({
  marke: '',
  typ: '',
  dnsName: '',
  ipAdresse: '',
  ram: null,
  kategorie: '',
})

// SORT
const sortField = ref('dnsName')
const sortDir = ref('asc')

function sortBy(field) {
  if (sortField.value === field) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDir.value = 'asc'
  }
}

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
watch([debouncedSearch, selectedKategorie, selectedOS, useRegex], fetchComputers, { immediate: true })

const deleteComputer = async (id) => {
  if (!confirm('Willst du diesen Computer wirklich löschen?')) return
  deletingId.value = id
  try {
    await http.delete(`/computer/${id}`)
    await fetchComputers()
    showToast('Computer gelöscht', 'success')
  } catch (err) {
    showToast(err?.response?.data?.error || 'Löschen fehlgeschlagen', 'danger')
  } finally {
    deletingId.value = null
  }
}

const totalPages = computed(() =>
    Math.ceil(computers.value.length / perPage)
)

// ---- Natural sort for DNS ----
function naturalSort(a, b) {
  // Both null/undefined
  if (a == null && b == null) return 0
  if (a == null) return 1
  if (b == null) return -1
  // Extract prefix, number (e.g. lrt10 => ['lrt', 10])
  const parse = v => {
    if (typeof v !== 'string') return [v, 0]
    const m = v.match(/^([a-zA-Z\-]*)(\d+)$/)
    if (m) return [m[1], parseInt(m[2])]
    return [v, 0]
  }
  const [ap, an] = parse(a)
  const [bp, bn] = parse(b)
  if (ap === bp) return an - bn
  return ap.localeCompare(bp)
}

// Sortierfunktion für alle Felder
const sortedComputers = computed(() => {
  let arr = [...computers.value]
  arr.sort((a, b) => {
    const dir = sortDir.value === 'asc' ? 1 : -1
    let va, vb
    if (sortField.value.includes('.')) {
      // Nested field, z.B. kategorie.bezeichnung
      const [p, f] = sortField.value.split('.')
      va = a[p]?.[f]
      vb = b[p]?.[f]
    } else {
      va = a[sortField.value]
      vb = b[sortField.value]
    }
    if (sortField.value === 'dnsName') {
      return naturalSort(va, vb) * dir
    }
    // Numerisch?
    if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * dir
    if (va == null && vb == null) return 0
    if (va == null) return 1
    if (vb == null) return -1
    return String(va).localeCompare(String(vb), undefined, { numeric: true }) * dir
  })
  return arr
})

const paginatedComputers = computed(() => {
  const start = (page.value - 1) * perPage
  return sortedComputers.value.slice(start, start + perPage)
})

async function addComputer() {
  adding.value = true
  try {
    const { marke, typ, dnsName, ipAdresse, ram, kategorie } = addForm.value
    const res = await http.post('/computer', {
      marke,
      typ,
      dnsName,
      ipAdresse,
      ram: ram ? Number(ram) : undefined,
      kategorie: kategorie || undefined,
    })
    showToast('Computer angelegt!', 'success')
    showAddModal.value = false
    Object.assign(addForm.value, { marke: '', typ: '', dnsName: '', ipAdresse: '', ram: null, kategorie: '' })
    await fetchComputers()
  } catch (err) {
    showToast(err?.response?.data?.error || 'Anlegen fehlgeschlagen', 'danger')
  } finally {
    adding.value = false
  }
}
</script>

<style scoped>
.modal-backdrop {
  z-index: 1040 !important;
}
.modal {
  z-index: 1050 !important;
}
@media (max-width: 700px) {
  .modal-dialog {
    max-width: 95vw;
  }
}
th {
  user-select: none;
}
th:hover {
  background: #f8f9fa;
}
</style>
