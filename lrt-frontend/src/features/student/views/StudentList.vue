<template>
  <div class="studentlist-wrapper container py-4">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
      <h2 class="mb-0 text-gradient fw-bold d-flex align-items-center gap-2">
        <i class="bi bi-mortarboard-fill me-2"></i>Studenten
      </h2>
      <!-- Neu anlegen Button mit Gradient‑Style -->
      <button
          class="btn btn-gradient d-flex align-items-center gap-2 shadow-sm"
          @click="openForm()"
      >
        <i class="bi bi-person-plus"></i>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Lade...</span>
      </div>
    </div>

    <div v-else>
      <!-- Table -->
      <div class="table-responsive shadow-sm rounded-4">
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
          <tr v-if="!students.length">
            <td colspan="7" class="text-center text-muted py-4">
              <i class="bi bi-emoji-frown me-2"></i>Keine Student*innen gefunden.
            </td>
          </tr>
          </tbody>
        </table>
      </div>
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
import http from '@/api/http'
import { useToastStore } from '@/stores/toast'
import StudentEditModal from './StudentEditModal.vue'

const toast    = useToastStore()
const students = ref([])
const loading  = ref(false)
const showForm = ref(false)
const editForm = ref(null)

// Hier speichern wir einmal alle OS nach ihrer ID
const osMap = {}

// Lifecycle
async function fetchStudents() {
  loading.value = true
  try {
    // 1) Alle Betriebssysteme holen und in osMap speichern
    const osRes = await http.get('/betriebssystem')
    osRes.data.forEach(os => {
      osMap[os._id] = os.name
    })

    // 2) Studenten laden
    const res = await http.get('/studenten')
    students.value = res.data

    // 3) Rechner‑Objekt nachladen, falls nötig, und OS ID→Name mappen
    for (const s of students.value) {
      if (s.rechner && /^[0-9a-f]{24}$/.test(s.rechner)) {
        s.computerObj = await http
            .get(`/computer/${s.rechner}`)
            .then(r => r.data)
            .catch(() => null)
      }
      // Wenn betriebssystem eine ID ist, mappen wir auf den Namen
      if (s.betriebssystem && typeof s.betriebssystem === 'string') {
        const name = osMap[s.betriebssystem]
        if (name) {
          s.betriebssystem = { name }
        } else {
          delete s.betriebssystem
        }
      }
    }
  } catch (err) {
    toast.show(err.response?.data?.error || 'Fehler beim Laden der Studenten', 4000)
  } finally {
    loading.value = false
  }
}

function openForm() {
  editForm.value = null
  showForm.value = true
}
function editStudent(stud) {
  editForm.value = { ...stud }
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
    toast.show('Student*in gelöscht', 3000)
    await fetchStudents()
  } catch (err) {
    toast.show(err.response?.data?.error || 'Fehler beim Löschen', 4000)
  }
}

// OS‑Name → Icon‑Klasse
function getOSIcon(osName) {
  if (!osName || typeof osName !== 'string') return 'bi-laptop'
  const n = osName.toLowerCase()
  if (n.includes('windows')) return 'bi-windows'
  if (n.includes('ubuntu'))  return 'bi-ubuntu'
  if (n.includes('linux'))   return 'bi-hdd-network'
  if (n.includes('mac') || n.includes('ios') || n.includes('ipad')) return 'bi-apple'
  if (n.includes('android')) return 'bi-android'
  return 'bi-laptop'
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
.text-gradient {
  background: linear-gradient(90deg,#388bfd 10%,#38d6ae 90%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.table-responsive {
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
.btn {
  border-radius: 0.75rem !important;
}
/* btn-gradient wie in KategorieList.vue */
.btn-gradient {
  background: linear-gradient(90deg,#3a7bd5,#00d2ff 70%);
  color: #fff;
  border: none;
  font-weight: 600;
  border-radius: 1.2em;
  padding: 8px 22px;
  box-shadow: 0 2px 10px #00d2ff12;
  transition: background 0.2s, box-shadow 0.2s;
}
.btn-gradient:hover,
.btn-gradient:focus {
  background: linear-gradient(90deg,#00d2ff,#3a7bd5 70%);
  color: #fff;
}

/* Optional: btn-outline-gradient, falls Du es auch brauchst */
.btn-outline-gradient {
  border: 2px solid #3a7bd5;
  color: #3a7bd5;
  background: #fafdff;
  font-weight: 500;
  border-radius: 14px;
  transition: background 0.15s, color 0.15s, box-shadow 0.2s;
  box-shadow: 0 1px 6px #00d2ff11;
}
.btn-outline-gradient:hover,
.btn-outline-gradient:focus {
  background: linear-gradient(90deg,#3a7bd5,#00d2ff 70%);
  color: #fff;
  box-shadow: 0 2px 10px #00d2ff22;
}

.badge {
  border-radius: 0.75rem;
  font-size: 0.97em;
  padding: 0.55em 1em;
  box-shadow: 0 2px 8px rgba(56,143,253,0.06);
  background: #e0f2fe;
}
.modal-content {
  border-radius: 1.3rem;
}
@media (max-width: 700px) {
  .studentlist-wrapper { padding: 12px 3px !important; }
}
</style>
