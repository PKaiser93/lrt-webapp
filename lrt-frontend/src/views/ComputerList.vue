<template>
  <div class="container py-4">
    <h2 class="mb-4">🖥️ Computerliste</h2>

    <!-- 🔍 Suche & Filter -->
    <div class="row mb-4">
      <div class="col-md-4">
        <input v-model="search" class="form-control" placeholder="🔍 Suche in allen Feldern..." />
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

    <!-- 📋 Tabelle -->
    <table class="table table-striped table-hover align-middle">
      <thead>
      <tr>
        <th>DNS</th>
        <th>Benutzer</th>
        <th>Kategorie</th>
        <th>OS</th>
        <th>IP</th>
        <th>Raum</th>
        <th>🛠️ Aktionen</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="comp in paginatedComputers" :key="comp._id">
        <td>{{ comp.dnsName }}</td>
        <td>{{ comp.benutzer }}</td>
        <td>{{ comp.kategorie.bezeichnung }}</td>
        <td>{{ comp.betriebssystem.name }}</td>
        <td>{{ comp.ipAdresse }}</td>
        <td>{{ comp.raumnummer }}</td>
        <td>
          <router-link
              :to="'/computer/' + comp._id"
              class="btn btn-sm btn-outline-primary"
          >
            ✏️ Bearbeiten
          </router-link>
          <button
              class="btn btn-sm btn-outline-danger"
              @click="deleteComputer(comp._id)"
              title="Löschen"
          >
            🗑️
          </button>
        </td>
      </tr>
      </tbody>
    </table>

    <!-- 📄 Pagination -->
    <nav v-if="filteredComputers.length > perPage">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: page === 1 }">
          <a class="page-link" @click.prevent="page--">«</a>
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
          <a class="page-link" @click.prevent="page++">»</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import http from '../api/http'
import { useRouter } from 'vue-router'
import { showToast } from '../utils/toast'

const computers = ref([])
const kategorieList = ref([])
const osList = ref([])

const search = ref('')
const selectedKategorie = ref('')
const selectedOS = ref('')
const page = ref(1)
const perPage = 10

const router = useRouter()

onMounted(async () => {
  const [c, k, o] = await Promise.all([
    http.get('/computer'),
    http.get('/kategorie'),
    http.get('/betriebssystem')
  ])
  computers.value = c.data
  kategorieList.value = k.data
  osList.value = o.data
})

// 🔎 Suchfelder
const searchableFields = [
  'marke', 'typ', 'seriennummer', 'cpu', 'ram', 'hddssd',
  'grafikkarte', 'chipsatz', 'tpm', 'bios', 'remote',
  'betriebssystem', 'version', 'abstraktionsebene',
  'dnsName', 'ipAdresse', 'macAdresse', 'dhcp',
  'benutzer', 'idmKennung', 'betreuer', 'artDerArbeit',
  'raumnummer', 'kategorie', 'laufendeNummer', 'studPCs',
  'inventarnummer', 'fauInventarnummer', 'beschaffungsjahr',
  'wannErsetzen', 'studienzuschuss', 'info', 'todo', 'ablauf'
]

// 🔄 Filter + Suchlogik
const filteredComputers = computed(() => {
  const term = search.value.toLowerCase()
  return computers.value.filter(c => {
    const matchSearch = searchableFields.some(f =>
        (c[f] || '').toString().toLowerCase().includes(term)
    )
    const matchKategorie = !selectedKategorie.value || c.kategorie === selectedKategorie.value
    const matchOS = !selectedOS.value || c.betriebssystem === selectedOS.value
    return matchSearch && matchKategorie && matchOS
  })
})

// 📄 Pagination Slice
const totalPages = computed(() => Math.ceil(filteredComputers.value.length / perPage))
const paginatedComputers = computed(() => {
  const start = (page.value - 1) * perPage
  return filteredComputers.value.slice(start, start + perPage)
})

// ❌ Delete Handler
const deleteComputer = async (id) => {
  if (!confirm('Wirklich löschen?')) return
  try {
    await http.delete(`/computer/${id}`)
    computers.value = computers.value.filter(c => c._id !== id)
    showToast('🗑️ Eintrag gelöscht')
  } catch (err) {
    showToast('⚠️ Fehler beim Löschen', 'danger')
  }
}
</script>
