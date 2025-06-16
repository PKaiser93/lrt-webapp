<template>
  <div class="studenten-wrapper container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4 gap-2 flex-wrap">
      <h2 class="mb-0 fw-bold text-gradient">
        <i class="bi bi-mortarboard-fill me-2"></i>Studenten
      </h2>
      <button class="btn btn-success shadow-sm rounded-pill" @click="showCreate = true">
        <i class="bi bi-person-plus me-1"></i> Student*in anlegen
      </button>
    </div>

    <div class="card shadow-sm rounded-4 border-0">
      <div class="card-body p-0">
        <div v-if="loading" class="py-5 text-center">
          <span class="spinner-border text-primary"></span>
        </div>
        <div v-else>
          <table class="table table-hover align-middle mb-0 table-striped">
            <thead class="table-light">
            <tr>
              <th>Name</th>
              <th>Vorname</th>
              <th>IdM</th>
              <th>FAU E-Mail</th>
              <th>Rechner</th>
              <th>Betriebssystem</th>
              <th class="text-end pe-4">Aktionen</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="stud in students" :key="stud._id">
              <td>{{ stud.name }}</td>
              <td>{{ stud.vorname }}</td>
              <td><span class="badge bg-light text-dark">{{ stud.idmAccount }}</span></td>
              <td>
                  <span class="badge bg-light text-dark">
                    <i class="bi bi-envelope me-1"></i>{{ stud.fauEmail }}
                  </span>
              </td>
              <td>
                  <span v-if="stud.computerObj">
                    <i class="bi bi-pc-display-horizontal me-1"></i>{{ stud.computerObj.dnsName || stud.computerObj.marke || stud.rechner }}
                  </span>
                <span v-else class="text-muted">{{ stud.rechner }}</span>
              </td>
              <td>
                  <span v-if="stud.betriebssystem">
                    <i class="bi bi-windows me-1"></i>{{ stud.betriebssystem.name }}
                  </span>
                <span v-else class="text-muted">—</span>
              </td>
              <td class="text-end pe-4">
                <div class="btn-group">
                  <button class="btn btn-sm btn-outline-primary" @click="editStudent(stud)" title="Bearbeiten">
                    <i class="bi bi-pencil-square"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-danger" @click="delStudent(stud._id)" title="Löschen">
                    <i class="bi bi-trash3"></i>
                  </button>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- MODAL Create/Edit -->
    <StudentEditModal v-if="showCreate || editForm"
                      :student="editForm"
                      @close="showCreate = false; editForm=null; fetchStudents()"
                      @saved="showCreate = false; editForm=null; fetchStudents()" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import http from '../api/http'
import StudentEditModal from './StudentEditModal.vue'

const students = ref([])
const loading = ref(false)
const showCreate = ref(false)
const editForm = ref(null)

async function fetchStudents() {
  loading.value = true
  try {
    const res = await http.get('/studenten')
    students.value = res.data
    // Rechner-Objekt laden (wenn ID gespeichert)
    for (const s of students.value) {
      if (s.rechner && s.rechner.match(/^[0-9a-f]{24}$/)) {
        s.computerObj = await http.get(`/computer/${s.rechner}`).then(r => r.data).catch(() => null)
      }
    }
  } finally {
    loading.value = false
  }
}

function editStudent(stud) {
  editForm.value = { ...stud }
}

async function delStudent(id) {
  if (!confirm('Wirklich löschen?')) return
  await http.delete(`/studenten/${id}`)
  await fetchStudents()
}

onMounted(fetchStudents)
</script>

<style scoped>
.studenten-wrapper {
  background: #f8fafc;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(44,62,80,0.07);
  margin-top: 30px;
}
.text-gradient {
  background: linear-gradient(90deg, #ff9360 10%, #388bfd 80%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
}
.card {
  border-radius: 1.3rem;
}
.table-hover > tbody > tr:hover {
  background: #f0f4fa !important;
}
.btn {
  border-radius: 0.8rem !important;
}
.badge {
  border-radius: 0.7rem;
  padding: 0.44em 0.9em;
  font-size: 0.98em;
  font-weight: 500;
}
@media (max-width: 700px) {
  .studenten-wrapper {
    padding: 12px 2px !important;
  }
}
</style>
