<template>
  <div class="container py-lg">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center flex-wrap mb-4">
      <h2 class="fs-xl fw-bold gradient-text d-flex align-items-center gap-sm mb-0">
        <i class="bi bi-pc-display"></i>
        Computerliste
      </h2>
      <router-link
          to="/computer/neu"
          class="btn btn-primary d-flex align-items-center gap-sm"
          title="Neuen Computer anlegen"
      >
        <i class="bi bi-plus-circle"></i>&nbsp;Neuen Computer anlegen
      </router-link>
    </div>

    <!-- Filter -->
    <FilterSidebar
        :kategorieList="kategorieList"
        :osList="osList"
        v-model:search="search"
        v-model:useRegex="useRegex"
        v-model:selectedKategorie="selectedKategorie"
        v-model:selectedOS="selectedOS"
        v-model:selectedStatus="selectedStatus"
        @apply="fetchComputers"
        class="mb-4"
    />

    <!-- Info -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>Gefundene Computer: <strong>{{ total }}</strong></div>
      <div v-if="totalPages > 1" class="fs-sm">Seite {{ page }} von {{ totalPages }}</div>
    </div>

    <!-- Loading -->
    <div v-if="computerStore.isLoading" class="text-center py-xl">
      <span class="spinner-border"></span>
    </div>

    <div v-else>
      <div v-if="computerStore.error" class="alert alert-danger mb-4">{{ computerStore.error }}</div>

      <!-- Tabelle -->
      <div class="card">
        <div class="table-responsive">
          <table class="table mb-0">
            <thead>
            <tr>
              <th @click="sortBy('dnsName')" class="cursor-pointer">
                <i class="bi bi-hash me-sm"></i>DNS
                <SortArrow field="dnsName" :sortField="sortField" :sortDir="sortDir" />
              </th>
              <th @click="sortBy('ipAdresse')" class="cursor-pointer">
                <i class="bi bi-diagram-2 me-sm"></i>IP
                <SortArrow field="ipAdresse" :sortField="sortField" :sortDir="sortDir" />
              </th>
              <th @click="sortBy('marke')" class="cursor-pointer">
                <i class="bi bi-building me-sm"></i>Marke
                <SortArrow field="marke" :sortField="sortField" :sortDir="sortDir" />
              </th>
              <th @click="sortBy('cpu')" class="cursor-pointer">
                <i class="bi bi-cpu me-sm"></i>CPU
                <SortArrow field="cpu" :sortField="sortField" :sortDir="sortDir" />
              </th>
              <th @click="sortBy('ram')" class="cursor-pointer">
                <i class="bi bi-memory me-sm"></i>RAM
                <SortArrow field="ram" :sortField="sortField" :sortDir="sortDir" />
              </th>
              <th @click="sortBy('raumnummer')" class="cursor-pointer">
                <i class="bi bi-door-open me-sm"></i>Raum
                <SortArrow field="raumnummer" :sortField="sortField" :sortDir="sortDir" />
              </th>
              <th @click="sortBy('kategorie.bezeichnung')" class="cursor-pointer">
                <i class="bi bi-tags me-sm"></i>Kategorie
                <SortArrow field="kategorie.bezeichnung" :sortField="sortField" :sortDir="sortDir" />
              </th>
              <th @click="sortBy('status')" class="cursor-pointer">
                <i class="bi bi-info-circle me-sm"></i>Status
                <SortArrow field="status" :sortField="sortField" :sortDir="sortDir" />
              </th>
              <th>Aktionen</th>
            </tr>
            </thead>
            <tbody>
            <template v-if="paginatedComputers.length">
              <TableRow
                  v-for="comp in paginatedComputers"
                  :key="comp._id"
                  :comp="comp"
                  :deletingId="deletingId"
                  @delete="deleteComputer"
              />
            </template>
            <tr v-else>
              <td colspan="9" class="text-center text-secondary py-xl">
                <i class="bi bi-emoji-frown me-sm"></i>Keine Computer gefunden.
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <nav v-if="totalPages > 1" class="mt-4">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: page === 1 }">
            <button class="page-link" @click="page > 1 && page--">«</button>
          </li>
          <li
              class="page-item"
              v-for="n in totalPages"
              :key="n"
              :class="{ active: page === n }"
          >
            <button class="page-link" @click="page = n">{{ n }}</button>
          </li>
          <li class="page-item" :class="{ disabled: page === totalPages }">
            <button class="page-link" @click="page < totalPages && page++">»</button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useComputerStore } from '@/features/computer/store/computerStore'
import SortArrow from '@/features/computer/components/SortArrow.vue'
import TableRow from '@/features/computer/components/TableRow.vue'
import FilterSidebar from '@/features/computer/components/FilterSidebar.vue'
import { useBetriebssystemStore } from '@/features/betriebssystem/store/betriebssystemStore'
import { useKategorieStore } from '@/features/kategorie/store/kategorieStore'
import { useToastStore } from '@/shared/stores/toast'

const computerStore       = useComputerStore()
const betriebssystemStore = useBetriebssystemStore()
const kategorieStore      = useKategorieStore()
const toast               = useToastStore()

// Filter und Paging
const search            = ref('')
const useRegex          = ref(false)
const selectedKategorie = ref('')
const selectedOS        = ref('')
const selectedStatus    = ref('in_betrieb') // Default auf "In Betrieb"
const page              = ref(1)
const perPage           = 25

// Sortierung
const sortField = ref('dnsName')
const sortDir   = ref('asc')

// Gesamtzahl
const total = computed(() => computerStore.total)
const totalPages = computed(() => Math.ceil(total.value / perPage))

function sortBy(field) {
  if (sortField.value === field) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDir.value   = 'asc'
  }
}

async function fetchComputers() {
  const queryParts = []
  if (search.value)            queryParts.push(search.value)
  if (selectedKategorie.value) queryParts.push(`KATEGORIE:${selectedKategorie.value}`)
  if (selectedOS.value)        queryParts.push(`OS:${selectedOS.value}`)
  if (selectedStatus.value)    queryParts.push(`STATUS:${selectedStatus.value}`)

  await computerStore.fetchAll({
    query: queryParts.join(' '),
    regex: useRegex.value,
    page:  page.value,
    perPage
  })
}

// Re-fetch bei Änderung der Filter
watch([search, useRegex, selectedKategorie, selectedOS, selectedStatus], () => {
  page.value = 1
  fetchComputers()
}, { immediate: true })
watch(page, fetchComputers)

// Sortiert und paginiert
const sortedComputers = computed(() => {
  const arr = [...(computerStore.items || [])]
  const dir = sortDir.value === 'asc' ? 1 : -1
  arr.sort((a, b) => {
    let va = a[sortField.value]
    let vb = b[sortField.value]
    if (typeof va === 'string') va = va.toLowerCase()
    if (typeof vb === 'string') vb = vb.toLowerCase()
    if (va < vb) return -1 * dir
    if (va > vb) return 1 * dir
    return 0
  })
  return arr
})
const paginatedComputers = computed(() =>
    sortedComputers.value.slice((page.value - 1) * perPage, page.value * perPage)
)

// Delete
const deletingId = ref(null)
async function deleteComputer(id) {
  if (!confirm('Willst du diesen Computer wirklich löschen?')) return
  deletingId.value = id
  try {
    await computerStore.delete(id)
    toast.show('Computer gelöscht', 'success')
    fetchComputers()
  } catch {
    toast.show(computerStore.error || 'Löschen fehlgeschlagen', 'danger')
  } finally {
    deletingId.value = null
  }
}

// Laden der Lookup‑Daten
const kategorieList = computed(() => kategorieStore.items || [])
const osList        = computed(() => betriebssystemStore.items || [])

onMounted(() => {
  kategorieStore.fetchAll()
  betriebssystemStore.fetchAll()
})
</script>

<style scoped>
.cursor-pointer { cursor: pointer; }
.mb-4 { margin-bottom: 1.5rem !important; }
</style>
