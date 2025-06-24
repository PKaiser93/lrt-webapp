<template>
  <div class="welcome-wrapper container d-flex flex-column align-items-center text-center py-5">
    <h1 class="display-5 fw-bold mb-3 gradient-text">
      <i class="bi bi-pc-display-horizontal me-2"></i>
      LRT IT‑Management
    </h1>

    <StatusBadge class="mb-4" />

    <p class="lead mb-2">
      Ihre zentrale Plattform für die Verwaltung von <strong>Arbeitsstationen</strong>, <strong>Betriebssystemen</strong> und <strong>Netzwerkgeräten</strong>.
    </p>
    <p class="text-muted mb-4">
      Intuitive Oberflächen, Live‑Status und umfassende Auswertungen – alles an einem Ort.
    </p>

    <div class="d-flex gap-3 flex-wrap justify-content-center mb-5">
      <router-link to="/computer" class="btn btn-lg btn-primary d-flex align-items-center gap-2">
        <i class="bi bi-hdd-network"></i> Computer‑Liste
      </router-link>
      <router-link to="/admin" class="btn btn-lg btn-outline-primary d-flex align-items-center gap-2">
        <i class="bi bi-bar-chart-line"></i> Admin‑Dashboard
      </router-link>
    </div>

    <div class="text-secondary small">
      <i class="bi bi-lock-fill me-1"></i>
      Nur mit gültigen Anmeldedaten zugänglich.
    </div>
  </div>
</template>

<script setup>
import StatusBadge from '@/shared/components/StatusBadge.vue'
</script>

<style scoped>
.welcome-wrapper {
  max-width: 720px;
  margin: 3rem auto;
  padding: 3rem 2rem;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 1.5rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(10px);
  animation: slideUpFadeIn 0.8s ease-out both;
}

.gradient-text {
  background: linear-gradient(90deg, #2979ff 20%, #00b8d9 80%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.btn-primary {
  background-color: #2979ff;
  border: none;
  color: #fff;
  border-radius: 0.75rem;
  padding: 0.75rem 1.5rem;
  transition: transform 0.2s, box-shadow 0.2s;
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(41, 121, 255, 0.4);
}

.btn-outline-primary {
  background-color: transparent;
  border: 2px solid #2979ff;
  color: #2979ff;
  border-radius: 0.75rem;
  padding: 0.75rem 1.5rem;
  transition: background-color 0.2s, color 0.2s, transform 0.2s;
}
.btn-outline-primary:hover {
  background-color: #2979ff;
  color: #fff;
  transform: translateY(-2px);
}

@keyframes slideUpFadeIn {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
