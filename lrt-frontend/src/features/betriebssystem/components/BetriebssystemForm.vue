<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  item: {
    type: Object,
    default: null
  }
});
const emit = defineEmits(['close', 'saved']);
const name = ref(props.item?.name ?? '');

watch(() => props.item, (val) => {
  name.value = val?.name ?? '';
});

function submit() {
  emit('saved', { ...props.item, name: name.value });
}
</script>

<template>
  <teleport to="body">
    <div class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-card animate-in">
        <div class="modal-header d-flex align-items-center justify-content-between pb-1">
          <h5 class="mb-0 fw-bold">
            <i class="bi bi-windows me-2"></i>
            {{ props.item ? 'Betriebssystem bearbeiten' : 'Neues Betriebssystem' }}
          </h5>
          <button class="btn-close" @click="$emit('close')" tabindex="-1"></button>
        </div>
        <form @submit.prevent="submit" class="modal-body">
          <div class="mb-3">
            <label for="os-name" class="form-label fw-bold">Name</label>
            <input
                v-model="name"
                id="os-name"
                type="text"
                class="form-control form-control-lg rounded-3"
                placeholder="z.B. Windows 11"
                required
                autofocus
            />
          </div>
          <div class="d-flex gap-3 mt-3 justify-content-end">
            <button type="submit" class="btn btn-gradient d-flex align-items-center gap-2">
              <i class="bi bi-check-circle"></i> Speichern
            </button>
            <button type="button" class="btn btn-outline-gradient d-flex align-items-center gap-2" @click="$emit('close')">
              <i class="bi bi-x-circle"></i> Abbrechen
            </button>
          </div>
        </form>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
/* Overlay Hintergrund */
.modal-overlay {
  position: fixed;
  z-index: 2000;
  inset: 0;
  background: rgba(25,36,54, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(1.5px);
  animation: fadeIn 0.17s;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
/* Das schwebende Fenster (Card-Modal) */
.modal-card {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 12px 44px 0 rgba(32,78,118,.14), 0 2px 12px #00d2ff18;
  min-width: 320px;
  max-width: 97vw;
  width: 420px;
  padding: 32px 26px 20px;
  position: relative;
  animation: slideDown 0.23s cubic-bezier(.7,-0.06,.45,1.14);
}
@keyframes slideDown {
  from { transform: translateY(-24px) scale(.95); opacity: 0.6; }
  to   { transform: translateY(0) scale(1); opacity: 1; }
}
.modal-header {
  border-bottom: 1px solid #e3f6ffcc;
  margin-bottom: 16px;
  padding-bottom: 8px;
}
.modal-body {
  padding: 0;
}
/* Gradient Buttons wie bei dir */
.btn-gradient {
  background: linear-gradient(90deg,#3a7bd5,#00d2ff 70%);
  color: #fff;
  border: none;
  font-weight: 600;
  border-radius: 14px;
  padding: 8px 20px;
  box-shadow: 0 2px 12px #00d2ff13;
  transition: background 0.2s, box-shadow 0.2s;
}
.btn-gradient:hover, .btn-gradient:focus {
  background: linear-gradient(90deg,#00d2ff,#3a7bd5 70%);
  color: #fff;
  box-shadow: 0 4px 18px #3a7bd525;
}
.btn-outline-gradient {
  border: 2px solid #3a7bd5;
  color: #3a7bd5;
  background: #fafdff;
  font-weight: 500;
  border-radius: 14px;
  transition: background 0.15s, color 0.15s, box-shadow 0.2s;
  box-shadow: 0 1px 6px #00d2ff11;
}
.btn-outline-gradient:hover, .btn-outline-gradient:focus {
  background: linear-gradient(90deg,#3a7bd5,#00d2ff 70%);
  color: #fff;
  box-shadow: 0 2px 10px #00d2ff22;
}
</style>
