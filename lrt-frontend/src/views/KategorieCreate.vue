<template>
  <div class="container py-4 d-flex justify-content-center align-items-center min-vh-70">
    <div class="card shadow-sm rounded-4 p-4" style="max-width: 440px; width: 100%;">
      <div class="d-flex align-items-center gap-2 mb-3">
        <i class="bi bi-tags-fill fs-3 text-warning"></i>
        <h2 class="mb-0 fw-bold flex-grow-1" style="font-size: 1.35rem;">Neue Kategorie anlegen</h2>
      </div>
      <form @submit.prevent="submit" autocomplete="off">
        <div class="mb-3">
          <label class="form-label">Bezeichnung</label>
          <input v-model="kategorie.bezeichnung" class="form-control rounded-pill" required maxlength="40" />
        </div>
        <div class="mb-3">
          <label class="form-label">Beschreibung</label>
          <input v-model="kategorie.beschreibung" class="form-control rounded-pill" maxlength="150" />
        </div>
        <div class="mb-3">
          <label class="form-label">Farbe (HEX)</label>
          <div class="input-group">
            <input v-model="kategorie.farbe" class="form-control rounded-pill" maxlength="7" pattern="#[0-9a-fA-F]{6}" required />
            <span class="input-group-text px-3 border-0 bg-transparent">
              <span :style="{display:'inline-block',width:'1.5em',height:'1.5em',background:kategorie.farbe,borderRadius:'50%',border:'1px solid #ccc'}"></span>
            </span>
          </div>
          <div class="form-text">z.B. <code>#4fd1c5</code></div>
        </div>
        <div class="mt-4 d-flex justify-content-end">
          <button class="btn btn-success px-4 rounded-pill shadow-sm">
            <i class="bi bi-save me-1"></i> Speichern
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import http from '../api/http'
import { useRouter } from 'vue-router'
import { showToast } from '../utils/toast'

const kategorie = ref({
  bezeichnung: '',
  beschreibung: '',
  farbe: '#4fd1c5'
})

const router = useRouter()

const submit = async () => {
  // HEX-Format validieren
  if (!/^#[0-9a-fA-F]{6}$/.test(kategorie.value.farbe)) {
    showToast('Bitte eine gültige HEX-Farbe angeben (z.B. #4fd1c5)', 'danger')
    return
  }
  try {
    await http.post('/kategorie', kategorie.value)
    showToast('Kategorie erfolgreich angelegt')
    router.push('/kategorie')
  } catch (err) {
    showToast('Fehler beim Anlegen', 'danger')
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
input, .form-select {
  font-size: 1.05rem;
  background: #f6fafd;
}
input:focus {
  border-color: #f7c873;
  box-shadow: 0 0 0 0.15rem #ffe5ae4d;
}
.btn-success {
  background: linear-gradient(90deg, #ffd86a, #fd853a 95%);
  border: none;
  font-weight: 600;
  letter-spacing: 0.03em;
  color: #664100;
}
.btn-success:active, .btn-success:focus {
  background: #fd853a;
  color: #fff;
}
</style>
