<template>
  <div class="container py-4" style="max-width:500px">
    <h2>🎓 Student*in anlegen</h2>
    <form @submit.prevent="addStudent">
      <div class="mb-2">
        <label class="form-label">Nachname</label>
        <input v-model="form.name" class="form-control" required />
      </div>
      <div class="mb-2">
        <label class="form-label">Vorname</label>
        <input v-model="form.vorname" class="form-control" required />
      </div>
      <div class="mb-2">
        <label class="form-label">IdM-Account</label>
        <input v-model="form.idmAccount" class="form-control" required />
      </div>
      <div class="mb-2">
        <label class="form-label">FAU E-Mail</label>
        <input v-model="form.fauEmail" class="form-control" type="email" required />
      </div>
      <div class="mb-2">
        <label class="form-label">Rechner</label>
        <input v-model="form.rechner" class="form-control" placeholder="z.B. personalisiert, Pool-Rechner, Gerätename..." required />
      </div>
      <div class="mb-2">
        <label class="form-label">Betriebssystem</label>
        <select v-model="form.betriebssystem" class="form-select">
          <option value="">—</option>
          <option v-for="os in osList" :key="os._id" :value="os._id">{{ os.name }}</option>
        </select>
      </div>
      <div class="mt-4">
        <button class="btn btn-success" :disabled="saving">
          <span v-if="saving">Wird gespeichert...</span>
          <span v-else>Speichern</span>
        </button>
      </div>
      <div v-if="msg" class="alert alert-info mt-3">{{ msg }}</div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import http from '../api/http'

const form = ref({
  name: '',
  vorname: '',
  idmAccount: '',
  fauEmail: '',
  rechner: '',
  betriebssystem: ''
})
const osList = ref([])
const saving = ref(false)
const msg = ref('')

onMounted(async () => {
  const res = await http.get('/betriebssystem')
  osList.value = res.data
})

async function addStudent() {
  saving.value = true
  msg.value = ''
  try {
    await http.post('/studenten', form.value)
    msg.value = 'Student*in erfolgreich angelegt!'
    Object.assign(form.value, { name: '', vorname: '', idmAccount: '', fauEmail: '', rechner: '', betriebssystem: '' })
  } catch (e) {
    msg.value = e?.response?.data?.error || 'Fehler beim Anlegen'
  } finally {
    saving.value = false
  }
}
</script>
