<template>
  <div class="maintenance-page d-flex flex-column justify-content-center align-items-center text-center">
    <div class="card shadow-lg rounded-4 p-5 bg-white text-center">
      <div class="mb-4">
        <div class="icon-container mb-3 mx-auto">
          <i class="bi bi-wrench"></i>
        </div>
        <h1 class="h3 fw-bold mb-2">Wartungsarbeiten</h1>
        <p class="text-muted mb-4">
          Unsere Seite wird derzeit gewartet.<br>
          Wir sind in Kürze wieder für dich da!
        </p>
      </div>
      <div class="d-flex gap-2 justify-content-center">
        <button class="btn btn-primary d-flex align-items-center" @click="reload">
          <i class="bi bi-arrow-clockwise me-2"></i>Neu laden
        </button>
        <router-link to="/" class="btn btn-outline-secondary d-flex align-items-center">
          <i class="bi bi-house-door me-2"></i>Zur Startseite
        </router-link>
      </div>
    </div>
    <footer class="mt-4 text-muted small">
      © {{ new Date().getFullYear() }} Lehrstuhl für Regelungstechnik
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useSettingsStore } from '@/shared/stores/settings'

const router   = useRouter()
const settings = useSettingsStore()

async function reload() {
  // Flag neu vom Server holen
  await settings.fetch()

  // Wenn Wartungsmodus aus, weiterleiten
  if (!settings.maintenanceMode) {
    router.replace('/')  // oder router.push('/')
  }
  // sonst Seite neu laden, um ggf. weiterhin in Wartung zu bleiben
  else {
    window.location.reload()
  }
}
</script>

<style scoped>
.maintenance-page {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: linear-gradient(135deg, #f0f4fa 0%, #e2ebf7 100%);
  padding: 1rem;
}
.card {
  max-width: 400px; width: 100%;
}
.icon-container {
  width: 72px; height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%);
  display: flex; align-items: center; justify-content: center;
  font-size: 2rem; color: #fff;
}
.btn-primary,
.btn-outline-secondary {
  border-radius: 2rem;
  padding: 0.5rem 1.5rem;
}
footer {
  opacity: 0.6;
}
</style>
