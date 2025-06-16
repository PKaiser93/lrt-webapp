<template>
  <div class="container py-4">
    <h2>🎓 Studenten</h2>
    <button class="btn btn-success mb-3" @click="showCreate = true">➕ Student*in anlegen</button>

    <div v-if="loading" class="py-5 text-center">
      <span class="spinner-border"></span>
    </div>
    <div v-else>
      <table class="table table-striped table-hover">
        <thead>
        <tr>
          <th>Name</th>
          <th>Vorname</th>
          <th>IdM</th>
          <th>FAU E-Mail</th>
          <th>Rechner</th>
          <th>Betriebssystem</th>
          <th>🛠️ Aktionen</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="stud in students" :key="stud._id">
          <td>{{ stud.name }}</td>
          <td>{{ stud.vorname }}</td>
          <td>{{ stud.idmAccount }}</td>
          <td>{{ stud.fauEmail }}</td>
          <td>
            <span v-if="stud.computerObj">{{ stud.computerObj.dnsName || stud.computerObj.marke || stud.rechner }}</span>
            <span v-else>{{ stud.rechner }}</span>
          </td>
          <td>{{ stud.betriebssystem?.name || '—' }}</td>
          <td>
            <button class="btn btn-sm btn-primary me-1" @click="editStudent(stud)">✏️</button>
            <button class="btn btn-sm btn-danger" @click="delStudent(stud._id)">🗑️</button>
          </td>
        </tr>
        </tbody>
      </table>
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

// --- Edit/Create Modal importieren ---
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
    // Für Rechner-Objekt anzeigen (wenn _id gespeichert)
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
