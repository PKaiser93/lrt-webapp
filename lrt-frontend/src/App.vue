<template>
  <div id="app" class="bg-light min-vh-100 d-flex flex-column">
    <!-- 🔝 Zentrale TopBar -->
    <TopBar />

    <!-- 🔄 Seiteninhalt -->
    <main class="container flex-grow-1 py-4">
      <router-view />
    </main>

    <!-- 🔔 Toast-Container -->
    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 2000">
      <div
          v-for="(toast, index) in toasts"
          :key="index"
          class="toast show text-bg-light border-0 shadow-lg rounded"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
      >
        <div class="toast-body d-flex justify-content-between align-items-center">
          <span>{{ toast.message }}</span>
          <button
              type="button"
              class="btn-close ms-3"
              aria-label="Close"
              @click="removeToast(index)"
          ></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import TopBar from './components/TopBar.vue'
import { useToastStore } from './stores/toast'

const toastStore = useToastStore()
const toasts = toastStore.toasts
const removeToast = toastStore.remove
</script>

<style>
body {
  font-family: 'Inter', sans-serif;
  background-color: #f1f3f5;
  color: #212529;
}
</style>
