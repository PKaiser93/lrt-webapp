<template>
  <div class="computerlist-wrapper container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
      <h2 class="mb-0 text-gradient fw-bold"><i class="bi bi-pc-display me-2"></i>Computerliste</h2>
      <router-link
          to="/computer/neu"
          class="btn btn-success d-flex align-items-center shadow-sm"
          style="min-width:170px"
      >
        <i class="bi bi-plus-circle me-2"></i> Neu anlegen
      </router-link>
    </div>

    <!-- 🔍 Suche & Filter -->
    <div class="row mb-4 g-2 align-items-end">
      <div class="col-md-4">
        <input v-model="search" class="form-control shadow-sm" placeholder="🔍 Suche, z.B. DNS:lrt076 RAM<16" />
      </div>
      <div class="col-auto">
        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" id="regexSwitch" v-model="useRegex">
          <label class="form-check-label" for="regexSwitch">Regex/Teilwortsuche</label>
        </div>
      </div>
      <div class="col-md-3">
        <select v-model="selectedKategorie" class="form-select shadow-sm">
          <option value="">📁 Kategorie (alle)</option>
          <option v-for="k in kategorieList" :key="k._id" :value="k.bezeichnung">{{ k.bezeichnung }}</option>
        </select>
      </div>
      <div class="col-md-3">
        <select v-model="selectedOS" class="form-select shadow-sm">
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
      <div class="table-responsive shadow-sm rounded-4">
        <table class="table table-striped table-hover align-middle mb-0">
          <thead class="table-light">
          <tr>
            <th @click="sortBy('dnsName')" style="cursor:pointer">
              DNS
              <SortArrow :field="'dnsName'" :sortField="sortField" :sortDir="sortDir"/>
            </th>
            <th @click="sortBy('ipAdresse')" style="cursor:pointer">
              IP
              <SortArrow :field="'ipAdresse'" :sortField="sortField" :sortDir="sortDir"/>
            </th>
            <th @click="sortBy('marke')" style="cursor:pointer">
              Marke
              <SortArrow :field="'marke'" :sortField="sortField" :sortDir="sortDir"/>
            </th>
            <th @click="sortBy('cpu')" style="cursor:pointer">
              CPU
              <SortArrow :field="'cpu'" :sortField="sortField" :sortDir="sortDir"/>
            </th>
            <th @click="sortBy('ram')" style="cursor:pointer">
              RAM
              <SortArrow :field="'ram'" :sortField="sortField" :sortDir="sortDir"/>
            </th>
            <th @click="sortBy('raumnummer')" style="cursor:pointer">
              Raum
              <SortArrow :field="'raumnummer'" :sortField="sortField" :sortDir="sortDir"/>
            </th>
            <th @click="sortBy('kategorie.bezeichnung')" style="cursor:pointer">
              Kategorie
              <SortArrow :field="'kategorie.bezeichnung'" :sortField="sortField" :sortDir="sortDir"/>
            </th>
            <th>Aktionen</th>
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
              <span class="badge text-dark" :style="{ backgroundColor: comp.kategorie?.farbe || '#eee', fontWeight: 500 }">
                {{ comp.kategorie?.bezeichnung || '—' }}
              </span>
            </td>
            <td>
              <!-- Detail-Seite -->
              <router-link
                  :to="`/computer/${comp._id}`"
                  class="btn btn-sm btn-outline-secondary me-1"
                  title="Details"
              ><i class="bi bi-search"></i></router-link>
              <!-- Bearbeiten -->
              <router-link
                  :to="`/computer/${comp._id}/edit`"
                  class="btn btn-sm btn-outline-primary me-1"
                  title="Bearbeiten"
              ><i class="bi bi-pencil-square"></i></router-link>
              <!-- Löschen -->
              <button
                  class="btn btn-sm btn-outline-danger"
                  @click="deleteComputer(comp._id)"
                  :disabled="deletingId === comp._id"
                  title="Löschen"
              >
                <span v-if="deletingId === comp._id" class="spinner-border spinner-border-sm"></span>
                <span v-else><i class="bi bi-trash3"></i></span>
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- 📄 Pagination -->
      <nav v-if="totalPages > 1" class="mt-4">
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
import { ref, computed, watch } from 'vue'
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

// Sort Arrow component for table headers
const SortArrow = {
  props: ['field', 'sortField', 'sortDir'],
  template: `
    <span v-if="field === sortField">
      <i v-if="sortDir === 'asc'" class="bi bi-caret-up-fill"></i>
      <i v-else class="bi bi-caret-down-fill"></i>
    </span>
    <span v-else style="opacity:.4">
      <i class="bi bi-arrow-down-up"></i>
    </span>
  `
}

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

function naturalSort(a, b) {
  if (a == null && b == null) return 0
  if (a == null) return 1
  if (b == null) return -1
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

const sortedComputers = computed(() => {
  let arr = [...computers.value]
  arr.sort((a, b) => {
    const dir = sortDir.value === 'asc' ? 1 : -1
    let va, vb
    if (sortField.value.includes('.')) {
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
    await http.post('/computer', {
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
.computerlist-wrapper {
  background: #f8fafc;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(44, 62, 80, 0.08);
  margin-top: 30px;
}
.text-gradient {
  background: linear-gradient(90deg, #388bfd 10%, #38d6ae 90%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
}
.table {
  border-radius: 1.3rem;
  overflow: hidden;
}
.table thead th {
  font-weight: 600;
  border-top: none;
  user-select: none;
  background: #f1f5fa;
}
.table-striped > tbody > tr:nth-of-type(odd) {
  background: #f8fafc;
}
.table-hover > tbody > tr:hover {
  background: #e0f2fe !important;
}
.badge {
  border-radius: 0.75rem;
  font-size: 0.97em;
  padding: 0.55em 1em;
  box-shadow: 0 2px 8px rgba(56, 143, 253, 0.06);
  background: #e0f2fe;
}
.btn {
  border-radius: 0.75rem !important;
}
.modal-content {
  border-radius: 1.3rem;
}
@media (max-width: 700px) {
  .computerlist-wrapper {
    padding: 12px 3px !important;
  }
  .table-responsive {
    border-radius: 0.7rem;
    margin-bottom: 12px;
  }
}
</style>
