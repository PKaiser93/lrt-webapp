<template>
  <div class="container py-5">
    <div class="card shadow-lg rounded-4 px-4 py-5" style="max-width: 480px; margin: 0 auto;">
      <h2 class="mb-4 fw-bold d-flex align-items-center gap-2">
        <i class="bi bi-plus-square-dotted text-warning" v-if="!isEditMode"></i>
        <i class="bi bi-pencil-square text-primary" v-else></i>
        <span>
          {{ isEditMode ? 'Betriebssystem bearbeiten' : 'Neues Betriebssystem anlegen' }}
        </span>
      </h2>

      <form @submit.prevent="submit" autocomplete="off">
        <div class="mb-4">
          <label class="form-label fw-semibold">Name</label>
          <input
              v-model.trim="os.name"
              class="form-control form-control-lg rounded-3"
              placeholder="z. B. Windows 11"
              required
              maxlength="50"
              autofocus
          />
        </div>

        <div class="d-flex justify-content-between gap-2">
          <router-link to="/betriebssystem" class="btn btn-outline-secondary rounded-3">
            <i class="bi bi-arrow-left-circle me-1"></i> Zurück
          </router-link>
          <button type="submit" class="btn btn-success rounded-3 shadow-sm px-4">
            <i class="bi bi-save2 me-1"></i> Speichern
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import http from '../api/http'
import { showToast } from '../utils/toast'

const os = ref({ name: '' })
const route = useRoute()
const router = useRouter()
const isEditMode = ref(false)

onMounted(async () => {
  if (route.params.id) {
    isEditMode.value = true
    try {
      const res = await http.get(`/betriebssystem/${route.params.id}`)
      os.value = res.data
    } catch {
      showToast('❌ Fehler beim Laden', 'danger')
    }
  }
})

const submit = async () => {
  try {
    if (isEditMode.value) {
      await http.patch(`/betriebssystem/${route.params.id}`, os.value)
      showToast('✅ Betriebssystem aktualisiert')
    } else {
      await http.post('/betriebssystem', os.value)
      showToast('✅ Betriebssystem gespeichert')
    }
    router.push('/betriebssystem')
  } catch {
    showToast('❌ Fehler beim Speichern', 'danger')
  }
}
</script>

<style scoped>
.card {
  background: #fafdff;
  border: none;
}
.form-label {
  color: #446;
  font-weight: 500;
}
input, .form-control-lg {
  background: #f6fafd;
  font-size: 1.09rem;
}
input:focus {
  border-color: #ffd86a;
  box-shadow: 0 0 0 0.15rem #ffe5ae60;
}
.btn-success {
  background: linear-gradient(90deg, #ffd86a, #fd853a 95%);
  border: none;
  font-weight: 600;
  color: #664100;
  letter-spacing: 0.01em;
}
.btn-success:active, .btn-success:focus {
  background: #fd853a;
  color: #fff;
}
</style>
