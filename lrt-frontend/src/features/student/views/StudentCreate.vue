<template>
  <div class="container py-4 d-flex justify-content-center align-items-center min-vh-70">
    <div class="card shadow-sm rounded-4 p-4" style="max-width: 480px; width: 100%;">
      <div class="d-flex align-items-center gap-2 mb-3">
        <i class="bi bi-person-plus-fill fs-3 text-success"></i>
        <h2 class="mb-0 fw-bold flex-grow-1" style="font-size: 1.4rem;">Student*in anlegen</h2>
      </div>
      <form @submit.prevent="addStudent" autocomplete="off">
        <div class="mb-3">
          <label class="form-label">Nachname</label>
          <input v-model="form.name" class="form-control rounded-pill" required />
        </div>
        <div class="mb-3">
          <label class="form-label">Vorname</label>
          <input v-model="form.vorname" class="form-control rounded-pill" required />
        </div>
        <div class="mb-3">
          <label class="form-label">IdM-Account</label>
          <input v-model="form.idmAccount" class="form-control rounded-pill" required />
        </div>
        <div class="mb-3">
          <label class="form-label">FAU E-Mail</label>
          <input v-model="form.fauEmail" class="form-control rounded-pill" type="email" required />
        </div>
        <div class="mb-3">
          <label class="form-label">Rechner</label>
          <input v-model="form.rechner" class="form-control rounded-pill" placeholder="z.B. personalisiert, Pool-Rechner, Gerätename..." required />
        </div>
        <div class="mb-3">
          <label class="form-label">Betriebssystem</label>
          <select v-model="form.betriebssystem" class="form-select rounded-pill">
            <option value="">—</option>
            <option v-for="os in osList" :key="os._id" :value="os._id">{{ os.name }}</option>
          </select>
        </div>
        <div class="mt-4 d-flex justify-content-end">
          <button class="btn btn-success px-4 rounded-pill shadow-sm" :disabled="saving">
            <span v-if="saving"><i class="bi bi-arrow-repeat me-1"></i>Speichern...</span>
            <span v-else><i class="bi bi-save me-1"></i>Speichern</span>
          </button>
        </div>
        <div v-if="msg" class="alert alert-info mt-3 mb-0 rounded-3 px-3 py-2">{{ msg }}</div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import http from '../../../api/http'

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
    msg.value = '✅ Student*in erfolgreich angelegt!'
    Object.assign(form.value, { name: '', vorname: '', idmAccount: '', fauEmail: '', rechner: '', betriebssystem: '' })
  } catch (e) {
    msg.value = e?.response?.data?.error || 'Fehler beim Anlegen'
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.card {
  background: #fafdff;
  border: none;
}
.form-label {
  font-weight: 500;
  color: #446;
}
input, select {
  font-size: 1.05rem;
  background: #f6fafd;
}
input:focus, select:focus {
  border-color: #49b88d;
  box-shadow: 0 0 0 0.15rem #53e0a84d;
}
.btn-success {
  background: linear-gradient(90deg, #50d285, #22a6b3 90%);
  border: none;
  font-weight: 600;
  letter-spacing: 0.03em;
}
.btn-success:active, .btn-success:focus {
  background: #22a6b3;
}
</style>
