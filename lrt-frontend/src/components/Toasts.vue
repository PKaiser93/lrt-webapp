<template>
  <div class="modern-toast-container">
    <transition-group name="toast-fade" tag="div">
      <div
          v-for="(t, i) in toasts"
          :key="i"
          class="modern-toast d-flex align-items-center shadow mb-3"
          :class="toastClass(t.type)"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
      >
        <i :class="iconClass(t.type) + ' me-3 flex-shrink-0 toast-icon'" />
        <div class="toast-body flex-grow-1">
          {{ t.message }}
        </div>
        <button
            type="button"
            class="btn-close ms-3"
            aria-label="Schließen"
            @click="remove(i)"
        ></button>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useToastStore } from '@/stores/toast'

const toastStore = useToastStore()
const toasts = computed(() => toastStore.toasts)

function remove(idx) {
  toastStore.remove(idx)
}

function toastClass(type) {
  // Farbliche Hintergründe je nach Status
  return {
    success: 'toast-success',
    danger:  'toast-danger',
    warning: 'toast-warning',
    info:    'toast-info'
  }[type] || 'toast-info'
}

function iconClass(type) {
  // Bootstrap Icons je Status
  return {
    success: 'bi bi-check-circle-fill text-success',
    danger:  'bi bi-x-circle-fill text-danger',
    warning: 'bi bi-exclamation-triangle-fill text-warning',
    info:    'bi bi-info-circle-fill text-info'
  }[type] || 'bi bi-info-circle-fill text-info'
}
</script>

<style scoped>
.modern-toast-container {
  position: fixed;
  top: 1.4rem;
  right: 1.4rem;
  z-index: 1200;
  width: 340px;
  max-width: calc(100vw - 2rem);
  pointer-events: none;
}

@media (max-width: 600px) {
  .modern-toast-container {
    top: 0.5rem;
    right: 0.5rem;
    width: 98vw;
    max-width: 98vw;
  }
}

.modern-toast {
  pointer-events: auto;
  min-width: 260px;
  max-width: 100%;
  border-radius: 1rem;
  padding: 0.75rem 1.2rem;
  display: flex;
  align-items: center;
  font-size: 1.06em;
  background: rgba(255,255,255,0.92);
  box-shadow: 0 6px 30px rgba(44,62,80,0.10);
  border-left: 7px solid;
  transition: box-shadow 0.18s, background 0.22s;
}

.toast-success   { border-color: #36c46e; }
.toast-danger    { border-color: #ee3e4e; }
.toast-warning   { border-color: #ffc107; }
.toast-info      { border-color: #388bfd; }

.toast-success   { background: linear-gradient(90deg, #e6fff1, #fafffc 80%); }
.toast-danger    { background: linear-gradient(90deg, #ffe6e9, #fff8f9 80%); }
.toast-warning   { background: linear-gradient(90deg, #fff9e6, #fffefa 80%); }
.toast-info      { background: linear-gradient(90deg, #e6f2ff, #fafdff 80%); }

.toast-body {
  flex-grow: 1;
  padding: 0 0.2em;
}

.toast-icon {
  font-size: 1.9em;
  opacity: 0.96;
}

.btn-close {
  filter: none;
  opacity: 0.5;
  transition: opacity 0.14s;
}
.btn-close:hover, .btn-close:focus {
  opacity: 1;
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all .35s cubic-bezier(.77,0,.18,1);
}
.toast-fade-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.toast-fade-enter-to {
  opacity: 1;
  transform: translateX(0);
}
.toast-fade-leave-from {
  opacity: 1;
}
.toast-fade-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
