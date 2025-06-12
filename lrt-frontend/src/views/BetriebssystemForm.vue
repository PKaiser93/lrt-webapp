<template>
  <div class="container py-5">
    <div class="card shadow-lg rounded-4 px-4 py-5">
      <h2 class="mb-4">
        <i class="bi bi-plus-square-dotted me-2"></i>
        {{ isEditMode ? 'Betriebssystem bearbeiten' : 'Neues Betriebssystem anlegen' }}
      </h2>

      <form @submit.prevent="submit">
        <div class="mb-4">
          <label class="form-label fw-semibold">Name</label>
          <input
              v-model.trim="os.name"
              class="form-control form-control-lg rounded-3"
              placeholder="z. B. Windows 11"
              required
          />
        </div>

        <div class="d-flex justify-content-between">
          <router-link to="/betriebssystem" class="btn btn-outline-secondary rounded-3">
            <i class="bi bi-arrow-left-circle me-1"></i> Zurück
          </router-link>
          <button type="submit" class="btn btn-success rounded-3 shadow-sm">
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
