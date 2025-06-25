<template>
  <div class="studentlist-wrapper container py-4">
    <!-- Header + New button -->
    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
      <h2 class="mb-0 text-gradient fw-bold d-flex align-items-center gap-2">
        <i class="bi bi-mortarboard-fill me-2"></i>Studenten
      </h2>
      <button class="btn btn-primary d-flex align-items-center gap-2" @click="openForm()">
        <i class="bi bi-plus-circle"></i> Neuen Studenten anlegen
      </button>
    </div>

    <!-- Search bar -->
    <div class="student-list-actions d-flex flex-wrap align-items-center mb-3 gap-3">
      <div class="input-group search-group">
        <span class="input-group-text"><i class="bi bi-search"></i></span>
          <input
              v-model="search"
              type="text"
              class="form-control"
              placeholder="Suche nach Name, Vorname, IdM oder E‑Mail…"
          />
      </div>
    </div>

    <!-- Loading spinner -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <div v-else>
      <!-- Table or EmptyState -->
      <div v-if="filteredStudents.length" class="table-responsive shadow-sm rounded-4 mb-4">
        <table class="table table-striped table-hover align-middle mb-0">
          <thead class="table-light">
          <tr>
            <th>Name</th>
            <th>Vorname</th>
            <th>IdM</th>
            <th>FAU E‑Mail</th>
            <th>Rechner</th>
            <th>Betriebssystem</th>
            <th class="text-end">Aktionen</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="stud in filteredStudents" :key="stud._id">
            <td>{{ stud.name }}</td>
            <td>{{ stud.vorname }}</td>
            <td><span class="badge bg-light text-dark">{{ stud.idmAccount }}</span></td>
            <td>
                <span class="badge bg-light text-dark">
                  <i class="bi bi-envelope me-1"></i>{{ stud.fauEmail || '–' }}
                </span>
            </td>
            <td>
                <span v-if="stud.computerObj">
                  <i class="bi bi-pc-display-horizontal me-1"></i>
                  {{ stud.computerObj.dnsName || stud.computerObj.marke || stud.rechner }}
                </span>
              <span v-else class="text-muted">{{ stud.rechner }}</span>
            </td>
            <td>
                <span v-if="stud.betriebssystem">
                  <i :class="getOSIcon(stud.betriebssystem.name) + ' me-1'"></i>
                  {{ stud.betriebssystem.name }}
                </span>
              <span v-else class="text-muted">—</span>
            </td>
            <td class="text-end">
              <div class="d-inline-flex gap-1">
                <button
                    class="btn btn-sm btn-outline-primary"
                    @click="editStudent(stud)"
                    title="Bearbeiten"
                >
                  <i class="bi bi-pencil-square"></i>
                </button>
                <button
                    class="btn btn-sm btn-outline-danger"
                    @click="delStudent(stud._id)"
                    title="Löschen"
                >
                  <i class="bi bi-trash3"></i>
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <EmptyState
          v-else
          icon="bi bi-emoji-frown"
          title="Keine Student*innen gefunden"
          description="Lege über den 'Neuen Studenten anlegen'-Button einen neue*n Student*in an."
      />
    </div>

    <!-- Modal Create/Edit -->
    <StudentEditModal
        v-if="showForm"
        :student="editForm"
        @close="closeForm"
        @saved="onSaved"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import http from '@/shared/api/http'
import { useToastStore } from '@/shared/stores/toast'
import StudentEditModal from './StudentEditModal.vue'
import EmptyState from '@/shared/components/EmptyState.vue'

const toast      = useToastStore()
const students   = ref([])
const loading    = ref(false)
const showForm   = ref(false)
const editForm   = ref(null)
const search     = ref('')
const osMap      = {}

// fetch all students + OS lookup
async function fetchStudents() {
  loading.value = true
  try {
    // load OS names
    const osRes = await http.get('/betriebssystem')
    osRes.data.forEach(o => (osMap[o._id] = o.name))

    // load students
    const stRes = await http.get('/studenten')
    students.value = await Promise.all(stRes.data.map(async s => {
      // attach computerObj if needed
      if (s.rechner && /^[0-9a-f]{24}$/.test(s.rechner)) {
        try {
          s.computerObj = await http.get(`/computer/${s.rechner}`).then(r => r.data)
        } catch { /* ignore */ }
      }
      // map OS
      if (s.betriebssystem && typeof s.betriebssystem === 'string') {
        const name = osMap[s.betriebssystem]
        if (name) s.betriebssystem = { _id: s.betriebssystem, name }
        else delete s.betriebssystem
      }
      return s
    }))
  } catch (err) {
    toast.show(err.response?.data?.error || 'Fehler beim Laden der Studenten', 'danger')
  } finally {
    loading.value = false
  }
}

// search-filtered list
const filteredStudents = computed(() => {
  const term = search.value.trim().toLowerCase()
  if (!term) return students.value
  return students.value.filter(s =>
      s.name.toLowerCase().includes(term) ||
      s.vorname.toLowerCase().includes(term) ||
      s.idmAccount.toLowerCase().includes(term) ||
      (s.fauEmail||'').toLowerCase().includes(term)
  )
})

// CRUD helpers
function openForm() {
  editForm.value = null
  showForm.value = true
}
function editStudent(s) {
  editForm.value = { ...s }
  showForm.value = true
}
function closeForm() {
  showForm.value = false
  editForm.value = null
}
async function onSaved() {
  closeForm()
  await fetchStudents()
}
async function delStudent(id) {
  if (!confirm('Wirklich löschen?')) return
  try {
    await http.delete(`/studenten/${id}`)
    toast.show('Student*in gelöscht', 'success')
    await fetchStudents()
  } catch (e) {
    toast.show(e.response?.data?.error || 'Fehler beim Löschen', 'danger')
  }
}
function getOSIcon(name) {
  if (!name) return 'bi bi-laptop'
  const n = name.toLowerCase()
  if (n.includes('windows')) return 'bi bi-windows'
  if (n.includes('ubuntu'))  return 'bi bi-ubuntu'
  if (n.includes('linux'))   return 'bi bi-hdd-network'
  if (n.includes('mac'))     return 'bi bi-apple'
  if (n.includes('android')) return 'bi bi-android'
  return 'bi bi-laptop'
}

onMounted(fetchStudents)
</script>

<style scoped>
.studentlist-wrapper {
  background: var(--clr-bg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-light);
  margin-top: var(--space-lg);
  padding: var(--space-md);
}
.text-gradient {
  background: linear-gradient(90deg, var(--clr-primary-start), var(--clr-primary-end));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.mb-4 { margin-bottom: var(--space-lg) !important; }
.table-responsive { margin-bottom: var(--space-md); }
</style>
