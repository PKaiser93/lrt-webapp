<template>
  <div class="modal-backdrop fade show" @click.self="$emit('close')"></div>
  <div class="modal fade show d-block" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content rounded-4 shadow-lg">
        <div class="modal-header">
          <h5 class="modal-title">Profil bearbeiten</h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>
        <form @submit.prevent="save">
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Benutzername</label>
              <input v-model="form.username" type="text" class="form-control" required />
            </div>
            <div class="mb-3">
              <label class="form-label">E‑Mail</label>
              <input v-model="form.email" type="email" class="form-control" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Vorname</label>
              <input v-model="form.firstName" type="text" class="form-control" />
            </div>
            <div class="mb-3">
              <label class="form-label">Nachname</label>
              <input v-model="form.lastName" type="text" class="form-control" />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" @click="$emit('close')">
              Abbrechen
            </button>
            <button type="submit" class="btn btn-primary" :disabled="saving">
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

const props = defineProps({
  initialProfile: { type: Object, required: true }
})
const emit  = defineEmits(['close','saved'])
const toast = useToastStore()
const form  = ref({ ...props.initialProfile })
const saving = ref(false)

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
}
</style>
