<template>
  <div class="computerlist-wrapper container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
      <h2 class="mb-0 text-gradient fw-bold d-flex align-items-center gap-2">
        <i class="bi bi-pc-display"></i>Computerliste
      </h2>
      <router-link
          to="/computer/neu"
          class="btn btn-gradient d-flex align-items-center gap-2 shadow-sm"
      >
        <i class="bi bi-plus-circle"></i>
      </router-link>
    </div>

    <!-- Filterleiste, immer volle Breite -->
    <FilterSidebar
        :kategorieList="kategorieList"
        :osList="osList"
        v-model:search="search"
        v-model:useRegex="useRegex"
        v-model:selectedKategorie="selectedKategorie"
        v-model:selectedOS="selectedOS"
        @apply="fetchComputers"
    />

    <div v-if="computerStore.isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"><span class="visually-hidden">Lade...</span></div>
    </div>
    <div v-else>
      <div v-if="computerStore.error" class="alert alert-danger mb-3">{{ computerStore.error }}</div>
      <div class="table-responsive shadow-sm rounded-4">
        <table class="table table-striped table-hover align-middle">
          <thead class="table-light">
          <tr>
            <th @click="sortBy('dnsName')" style="cursor:pointer">
              <i class="bi bi-hash text-secondary me-1"></i>DNS
              <SortArrow :field="'dnsName'" :sortField="sortField" :sortDir="sortDir" />
            </th>
            <th @click="sortBy('ipAdresse')" style="cursor:pointer">
              <i class="bi bi-diagram-2 text-secondary me-1"></i>IP
              <SortArrow :field="'ipAdresse'" :sortField="sortField" :sortDir="sortDir" />
            </th>
            <th @click="sortBy('marke')" style="cursor:pointer">
              <i class="bi bi-building text-secondary me-1"></i>Marke
              <SortArrow :field="'marke'" :sortField="sortField" :sortDir="sortDir" />
            </th>
            <th @click="sortBy('cpu')" style="cursor:pointer">
              <i class="bi bi-cpu text-secondary me-1"></i>CPU
              <SortArrow :field="'cpu'" :sortField="sortField" :sortDir="sortDir" />
            </th>
            <th @click="sortBy('ram')" style="cursor:pointer">
              <i class="bi bi-memory text-secondary me-1"></i>RAM
              <SortArrow :field="'ram'" :sortField="sortField" :sortDir="sortDir" />
            </th>
            <th @click="sortBy('raumnummer')" style="cursor:pointer">
              <i class="bi bi-door-open text-secondary me-1"></i>Raum
              <SortArrow :field="'raumnummer'" :sortField="sortField" :sortDir="sortDir" />
            </th>
            <th @click="sortBy('kategorie.bezeichnung')" style="cursor:pointer">
              <i class="bi bi-tags text-secondary me-1"></i>Kategorie
              <SortArrow :field="'kategorie.bezeichnung'" :sortField="sortField" :sortDir="sortDir" />
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
            <td colspan="8" class="text-center text-muted py-4">
              <i class="bi bi-emoji-frown me-2"></i>Keine Computer gefunden.
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <!-- Pagination -->
      <nav v-if="totalPages > 1" class="mt-4">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: page === 1 }">
            <a class="page-link" @click.prevent="page > 1 && (page--)" href="#">«</a>
          </li>
          <li
              class="page-item"
              v-for="n in totalPages"
              :key="n"
              :class="{ active: page === n }"
          >
            <a class="page-link" @click.prevent="page = n" href="#">{{ n }}</a>
          </li>
          <li class="page-item" :class="{ disabled: page === totalPages }">
            <a class="page-link" @click.prevent="page < totalPages && (page++)" href="#">»</a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useComputerStore } from '@/features/computer/store/computerStore';
import SortArrow from '@/features/computer/components/SortArrow.vue';
import TableRow from '@/features/computer/components/TableRow.vue';
import FilterSidebar from '@/features/computer/components/FilterSidebar.vue';
import { useBetriebssystemStore } from '@/features/betriebssystem/store/betriebssystemStore';
import { useKategorieStore } from '@/features/kategorie/store/kategorieStore';
import { useToastStore } from '@/stores/toast';

const computerStore = useComputerStore();
const betriebssystemStore = useBetriebssystemStore();
const kategorieStore = useKategorieStore();
const toast = useToastStore();

onMounted(() => {
  kategorieStore.fetchAll();
  betriebssystemStore.fetchAll();
});

// Filter- und UI-State
const search = ref('');
const useRegex = ref(false);
const selectedKategorie = ref('');
const selectedOS = ref('');
const page = ref(1);
const perPage = 25;

// Sortierung
const sortField = ref('dnsName');
const sortDir = ref('asc');
function sortBy(field) {
  if (sortField.value === field) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortField.value = field;
    sortDir.value = 'asc';
  }
}

// Daten vom Server laden (filterabhängig)
async function fetchComputers() {
  const queryParts = [];
  if (search.value) queryParts.push(search.value);
  if (selectedKategorie.value) queryParts.push(`KATEGORIE:${selectedKategorie.value}`);
  if (selectedOS.value) queryParts.push(`OS:${selectedOS.value}`);
  await computerStore.fetchAll({
    query: queryParts.join(' '),
    regex: useRegex.value
  });
  page.value = 1;
}
watch([search, selectedKategorie, selectedOS, useRegex], fetchComputers, { immediate: true });

// Pagination & Sorting
const totalPages = computed(() =>
    Math.ceil((Array.isArray(computerStore.computers) ? computerStore.computers.filter(Boolean).length : 0) / perPage)
);

function naturalSort(a, b) {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  const parse = v => {
    if (typeof v !== 'string') return [v, 0];
    const m = v.match(/^([a-zA-Z\-]*)(\d+)$/);
    if (m) return [m[1], parseInt(m[2])];
    return [v, 0];
  };
  const [ap, an] = parse(a);
  const [bp, bn] = parse(b);
  if (ap === bp) return an - bn;
  return ap.localeCompare(bp);
}

const sortedComputers = computed(() => {
  let arr = Array.isArray(computerStore.computers)
      ? [...computerStore.computers]
      : [];
  arr.sort((a, b) => {
    const dir = sortDir.value === 'asc' ? 1 : -1;
    let va, vb;
    if (sortField.value.includes('.')) {
      const [p, f] = sortField.value.split('.');
      va = a[p]?.[f];
      vb = b[p]?.[f];
    } else {
      va = a[sortField.value];
      vb = b[sortField.value];
    }
    if (sortField.value === 'dnsName') return naturalSort(va, vb) * dir;
    if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * dir;
    if (va == null && vb == null) return 0;
    if (va == null) return 1;
    if (vb == null) return -1;
    return String(va).localeCompare(String(vb), undefined, { numeric: true }) * dir;
  });
  return arr;
});

const paginatedComputers = computed(() => {
  const start = (page.value - 1) * perPage;
  return sortedComputers.value.slice(start, start + perPage);
});

// Löschen
const deletingId = ref(null);
async function deleteComputer(id) {
  if (!confirm('Willst du diesen Computer wirklich löschen?')) return;
  deletingId.value = id;
  try {
    await computerStore.delete(id);
    toast.show('Computer gelöscht', 'success');
    fetchComputers();
  } catch (err) {
    toast.show(computerStore.error || 'Löschen fehlgeschlagen', 'danger');
  } finally {
    deletingId.value = null;
  }
}

// Filter-Listen für Selects
const kategorieList = computed(() =>
    Array.isArray(kategorieStore.items) ? kategorieStore.items : []
);
const osList = computed(() =>
    Array.isArray(betriebssystemStore.items) ? betriebssystemStore.items : []
);
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
.card {
  border-radius: 1.3rem;
}
.badge {
  border-radius: 0.75rem;
  font-size: 0.97em;
  padding: 0.55em 1em;
  box-shadow: 0 2px 8px #388bfd0c;
  background: #e0f2fe;
}
.table { border-radius: 1.3rem; overflow: hidden; }
.table thead th { font-weight: 600; border-top: none; user-select: none; background: #f1f5fa; }
.table-striped > tbody > tr:nth-of-type(odd) { background: #f8fafc; }
.table-hover > tbody > tr:hover { background: #e0f2fe !important; }
.btn { border-radius: 0.75rem !important; }
.btn-gradient {
  background: linear-gradient(90deg,#3a7bd5,#00d2ff 70%);
  color: #fff;
  font-weight: 600;
  border: none;
  border-radius: 1.2em;
  padding: 8px 22px;
  box-shadow: 0 2px 10px #00d2ff12;
  transition: background 0.2s;
}
.btn-gradient:hover, .btn-gradient:focus {
  background: linear-gradient(90deg,#00d2ff,#3a7bd5 70%);
  color: #fff;
}
.btn-outline-gradient {
  border: 2px solid #3a7bd5;
  color: #3a7bd5;
  background: #fafdff;
  font-weight: 500;
  border-radius: 1.2em;
  transition: background 0.15s, color 0.15s;
}
.btn-outline-gradient:hover, .btn-outline-gradient:focus {
  background: linear-gradient(90deg,#3a7bd5,#00d2ff 70%);
  color: #fff;
}
@media (max-width: 700px) {
  .computerlist-wrapper { padding: 12px 3px !important; }
  .table-responsive { border-radius: 0.7rem; margin-bottom: 12px; }
}
</style>
