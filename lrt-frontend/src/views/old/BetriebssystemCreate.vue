<template>
  <div class="container py-5">
    <div class="card shadow-lg rounded-4 border-0">
      <div class="card-body p-4">
        <h2 class="mb-4 text-primary-emphasis">
          <i class="bi bi-cpu me-2"></i> Neues Betriebssystem anlegen
        </h2>

        <form @submit.prevent="submit">
          <div class="mb-3">
            <label for="osName" class="form-label">Name</label>
            <input
                id="osName"
                v-model.trim="os.name"
                class="form-control rounded-3 shadow-sm"
                placeholder="z. B. Windows 11"
                required
            />
          </div>

          <div class="text-end">
            <button class="btn btn-success rounded-3 shadow-sm" :disabled="!os.name">
              <i class="bi bi-save me-1"></i> Speichern
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import http from '../api/http'
import { showToast } from '../utils/toast'
import { useRouter } from 'vue-router'

const os = ref({ name: '' })
const router = useRouter()

const submit = async () => {
  try {
    await http.post('/betriebssystem', os.value)
    showToast('✅ Betriebssystem erfolgreich angelegt')
    router.push('/betriebssystem')
  } catch (err) {
    showToast('❌ Fehler beim Anlegen', 'danger')
  }
}
</script>

<style scoped>
/* Optional: modern transition effects */
input:focus {
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}
</style>
