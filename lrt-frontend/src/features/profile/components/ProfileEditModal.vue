<template>
  <!-- Backdrop -->
  <div class="modal-backdrop" @click.self="$emit('close')"></div>

  <!-- Modal -->
  <div class="modal d-block" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-md">
      <div class="modal-content rounded-4 shadow-lg overflow-hidden">
        <form @submit.prevent="save">
          <!-- Header mit Gradient und Icon -->
          <div class="modal-header border-0 bg-gradient-header text-white py-3">
            <h5 class="modal-title d-flex align-items-center gap-2">
              <i class="bi bi-person-circle"></i>
              Profil bearbeiten
            </h5>
            <button
                type="button"
                class="btn-close btn-close-white"
                @click="$emit('close')"
                aria-label="Schließen"
            ></button>
          </div>

          <!-- Body mit Input‑Groups und Icons -->
          <div class="modal-body p-4">
            <div class="row g-3">
              <div class="col-12">
                <label class="form-label">Benutzername</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-person-fill"></i></span>
                  <input
                      v-model="form.username"
                      type="text"
                      class="form-control"
                      placeholder="Benutzername"
                      required
                  />
                </div>
              </div>

              <div class="col-12">
                <label class="form-label">E‑Mail</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-envelope-fill"></i></span>
                  <input
                      v-model="form.email"
                      type="email"
                      class="form-control"
                      placeholder="beispiel@domain.de"
                      required
                  />
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label">Vorname</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-person-lines-fill"></i></span>
                  <input
                      v-model="form.firstName"
                      type="text"
                      class="form-control"
                      placeholder="Vorname"
                  />
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label">Nachname</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-person-badge-fill"></i></span>
                  <input
                      v-model="form.lastName"
                      type="text"
                      class="form-control"
                      placeholder="Nachname"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Footer: Buttons nebeneinander mit Icons -->
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
              <span v-if="saving" class="spinner-border spinner-border-sm"></span>
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
import { ref, watch } from 'vue'
import http from '@/shared/api/http'
import { useToastStore } from '@/shared/stores/toast'

const toast = useToastStore()

const props = defineProps({
  initialProfile: { type: Object, required: true }
})
const emit = defineEmits(['close', 'saved'])

const form = ref({ ...props.initialProfile })
const saving = ref(false)

// Form neu setzen, wenn initialProfile sich ändert
watch(() => props.initialProfile, val => {
  form.value = { ...val }
}, { immediate: true })

async function save() {
  saving.value = true
  try {
    const res = await http.patch('/profile', form.value)
    toast.show('Profil gespeichert', 'success')
    emit('saved', res.data)
  } catch (err) {
    const msg = err.response?.data?.error || 'Speichern fehlgeschlagen'
    toast.show(msg, 'danger')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
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
  transition: background 0.3s, color 0.3s;
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
