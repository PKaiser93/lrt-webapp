<template>
  <div class="studentlist-wrapper container py-4">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
      <h2 class="mb-0 text-gradient fw-bold d-flex align-items-center gap-2">
        <i class="bi bi-mortarboard-fill me-2"></i>Studenten
      </h2>
      <!-- Neu anlegen Button mit Label -->
      <button
          class="btn btn-gradient d-flex align-items-center gap-2 shadow-sm"
          @click="openForm()"
      >
        <i class="bi bi-person-plus"></i>
        Neu anlegen
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Lade...</span>
      </div>
    </div>

    <div v-else>
      <!-- Wenn es Student*innen gibt, Tabelle anzeigen -->
      <div v-if="students.length" class="table-responsive shadow-sm rounded-4 mb-4">
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
          <tr v-for="stud in students" :key="stud._id">
            <td>{{ stud.name }}</td>
            <td>{{ stud.vorname }}</td>
            <td>
              <span class="badge bg-light text-dark">{{ stud.idmAccount }}</span>
            </td>
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

      <!-- Empty State -->
      <EmptyState
          v-else
          icon="bi bi-emoji-frown"
          title="Keine Student*innen gefunden"
          description="Lege über den 'Neu anlegen'-Button eine*n neue*n Student*in an."
      />
    </div>

    <!-- Modal Create/Edit -->
    <StudentEditModal
        v-if="showForm || editForm"
        :student="editForm"
        @close="closeForm()"
        @saved="onSaved()"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import http from '@/shared/api/http'
import { useToastStore } from '@/shared/stores/toast'
import StudentEditModal from './StudentEditModal.vue'
import EmptyState from '@/shared/components/EmptyState.vue'

const toast    = useToastStore()
const students = ref([])
const loading  = ref(false)
const showForm = ref(false)
const editForm = ref(null)

// OS‑Map für Icons
const osMap = {}

// Daten laden
async function fetchStudents() {
  loading.value = true
  try {
    const osRes = await http.get('/betriebssystem')
    osRes.data.forEach(o => (osMap[o._id] = o.name))

    const res = await http.get('/studenten')
    students.value = res.data

    // rechnerObjekt & OS‑Mapping
    for (const s of students.value) {
      if (s.rechner && /^[0-9a-f]{24}$/.test(s.rechner)) {
        s.computerObj = await http.get(`/computer/${s.rechner}`).then(r => r.data).catch(() => null)
      }
      if (s.betriebssystem && typeof s.betriebssystem === 'string') {
        const name = osMap[s.betriebssystem]
        if (name) s.betriebssystem = { name }
        else delete s.betriebssystem
      }
    }
  } catch (err) {
    toast.show(err.response?.data?.error || 'Fehler beim Laden der Studenten', 'danger')
  } finally {
    loading.value = false
  }
}

// Form‑Handling
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
  } catch (err) {
    toast.show(err.response?.data?.error || 'Fehler beim Löschen', 'danger')
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
  background: #f8fafc;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(44, 62, 80, 0.07);
  margin-top: 30px;
}

.mb-4:last-of-type {
  margin-bottom: 1.5rem; /* etwas mehr Abstand nach unten */
}

.text-gradient {
  background: linear-gradient(90deg, #388bfd 10%, #38d6ae 90%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.btn-gradient {
  background: linear-gradient(90deg, #3a7bd5, #00d2ff 70%);
  color: #fff;
  border: none;
}

.table-responsive {
  border-radius: 1.3rem;
  overflow: hidden;
}

.table-light th {
  background: #f1f5fa;
}

.shadow-sm {
  box-shadow: 0 2px 8px rgba(0,0,0,0.05) !important;
}
</style>
