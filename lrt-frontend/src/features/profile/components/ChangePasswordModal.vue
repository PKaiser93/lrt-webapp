<template>
  <!-- Backdrop -->
  <div class="modal-backdrop fade show" @click.self="$emit('close')"></div>

  <!-- Modal -->
  <div class="modal fade show d-block" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-md">
      <div class="modal-content rounded-4 shadow-lg overflow-hidden">
        <form @submit.prevent="submit">
          <!-- Header mit Gradient und Icon -->
          <div class="modal-header border-0 bg-gradient-header text-white py-3">
            <h5 class="modal-title d-flex align-items-center gap-2">
              <i class="bi bi-key-fill"></i>
              Passwort ändern
            </h5>
            <button
                type="button"
                class="btn-close btn-close-white"
                @click="$emit('close')"
                aria-label="Schließen"
            ></button>
          </div>

          <!-- Body mit Input‑Groups -->
          <div class="modal-body p-4">
            <div v-if="error" class="alert alert-danger d-flex align-items-center mb-4">
              <i class="bi bi-exclamation-triangle-fill me-2"></i>
              <span>{{ error }}</span>
            </div>

            <div class="mb-3">
              <label class="form-label">Altes Passwort</label>
              <div class="input-group">
                <span class="input-group-text"><i class="bi bi-lock-fill"></i></span>
                <input
                    v-model="form.currentPassword"
                    type="password"
                    class="form-control"
                    placeholder="Altes Passwort"
                    required
                />
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Neues Passwort</label>
              <div class="input-group">
                <span class="input-group-text"><i class="bi bi-lock"></i></span>
                <input
                    v-model="form.newPassword"
                    type="password"
                    class="form-control"
                    placeholder="Neues Passwort"
                    required
                />
              </div>
            </div>

            <div class="mb-4">
              <label class="form-label">Neues Passwort bestätigen</label>
              <div class="input-group">
                <span class="input-group-text"><i class="bi bi-lock"></i></span>
                <input
                    v-model="form.confirmPassword"
                    type="password"
                    class="form-control"
                    placeholder="Passwort bestätigen"
                    required
                />
              </div>
            </div>
          </div>

          <!-- Footer: Buttons nebeneinander -->
          <div class="modal-footer border-0 px-4 pb-4 d-flex justify-content-end gap-2">
            <button
                type="button"
                class="btn btn-outline-gradient d-flex align-items-center gap-1"
                @click="$emit('close')"
                :disabled="saving"
            >
              <i class="bi bi-x-lg"></i> Abbrechen
            </button>
            <button
                type="submit"
                class="btn btn-gradient d-flex align-items-center gap-1"
                :disabled="saving"
            >
              <span v-if="saving" class="spinner-border spinner-border-sm me-1"></span>
              <i class="bi bi-check-lg"></i>
              {{ saving ? 'Speichern…' : 'Speichern' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import http from '@/api/http'
import { useToastStore } from '@/stores/toast'

const emit = defineEmits(['close'])
const toast = useToastStore()

const form = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})
const error = ref('')
const saving = ref(false)

async function submit() {
  error.value = ''
  if (form.value.newPassword !== form.value.confirmPassword) {
    error.value = 'Die neuen Passwörter stimmen nicht überein.'
    return
  }
  saving.value = true
  try {
    await http.post('/profile/password', {
      currentPassword: form.value.currentPassword,
      newPassword: form.value.newPassword
    })
    toast.show('Passwort geändert', 'success')
    emit('close')
  } catch (e) {
    error.value = e.response?.data?.error || 'Fehler beim Ändern'
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.3);
  z-index: 1040;
}
.modal {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}
.modal-content {
  border-radius: 1rem;
  overflow: hidden;
}
.bg-gradient-header {
  background: linear-gradient(120deg, #3a7bd5 0%, #00d2ff 90%);
}
.input-group-text {
  background: #f1f5fa;
  border-right: 0;
}
.form-control {
  border-left: 0;
}
.btn-gradient {
  background: linear-gradient(90deg, #3a7bd5, #00d2ff 70%);
  color: #fff;
  font-weight: 600;
  border: none;
  border-radius: 0.8rem;
  padding: 0.5rem 1.2rem;
  transition: background 0.3s, box-shadow 0.3s;
}
.btn-gradient:hover {
  background: linear-gradient(90deg, #00d2ff, #3a7bd5 70%);
}
.btn-outline-gradient {
  border: 2px solid #3a7bd5;
  color: #3a7bd5;
  background: #fff;
  font-weight: 500;
  border-radius: 0.8rem;
  padding: 0.45rem 1.1rem;
  transition: background 0.3s, color 0.3s, box-shadow 0.3s;
}
.btn-outline-gradient:hover {
  background: linear-gradient(90deg, #3a7bd5, #00d2ff 70%);
  color: #fff;
}
.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}
</style>
