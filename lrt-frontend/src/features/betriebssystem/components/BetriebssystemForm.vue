<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    default: null
  }
})
const emit = defineEmits(['close', 'saved'])

const name = ref(props.item?.name ?? '')

watch(
    () => props.item,
    (val) => {
      name.value = val?.name ?? ''
    }
)

function submit() {
  emit('saved', { ...props.item, name: name.value })
}
</script>

<template>
  <teleport to="body">
    <div class="modal-overlay" @click.self="emit('close')">
      <div class="card modal-card">
        <header class="modal-header d-flex justify-content-between align-items-center">
          <h5 class="fw-bold mb-0 d-flex align-items-center gap-2">
            <i class="bi bi-windows"></i>
            {{ props.item ? 'Betriebssystem bearbeiten' : 'Neues Betriebssystem' }}
          </h5>
          <button class="btn-close" @click="emit('close')" aria-label="Schließen"></button>
        </header>
        <form @submit.prevent="submit" class="modal-body">
          <div class="mb-3">
            <label for="os-name" class="form-label fw-bold">Name</label>
            <input
                id="os-name"
                v-model="name"
                type="text"
                class="form-control"
                placeholder="z. B. Windows 11"
                required
                autofocus
            />
          </div>
          <div class="d-flex justify-content-end gap-3 mt-4">
            <button type="submit" class="btn btn-primary d-flex align-items-center gap-2">
              <i class="bi bi-check-circle"></i> Speichern
            </button>
            <button type="button" class="btn btn-outline d-flex align-items-center gap-2" @click="emit('close')">
              <i class="bi bi-x-circle"></i> Abbrechen
            </button>
          </div>
        </form>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(1.5px);
  z-index: 2000;
  animation: fadeIn 0.2s ease-out both;
}

@keyframes fadeIn {
  from { opacity: 0 }
  to   { opacity: 1 }
}

.modal-card {
  width: 100%;
  max-width: 420px;
  padding: var(--space-lg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-strong);
  animation: slideDown 0.25s ease-out both;
}

@keyframes slideDown {
  from { transform: translateY(-20px) scale(0.95); opacity: 0.6 }
  to   { transform: translateY(0) scale(1); opacity: 1 }
}

.modal-header {
  border-bottom: 1px solid var(--clr-border);
  padding-bottom: var(--space-sm);
}

.modal-body {
  padding-top: var(--space-md);
}

.btn-primary {
  /* nutzt globales primary */
}

.btn-outline {
  /* nutzt globales outline */
}
</style>
