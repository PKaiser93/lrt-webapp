<template>
  <div class="welcome-wrapper container d-flex flex-column align-items-center text-center py-5">
    <h1 class="display-4 text-gradient fw-bold mb-3">
      🖥️ LRT Computerverwaltung 2025
    </h1>

    <StatusBadge class="mb-4" />

    <p class="lead mb-4">
      Willkommen zur zentralen Verwaltungsplattform für
      <strong>Rechner, Betriebssysteme und Netzwerkgeräte</strong> im LRT.
    </p>
    <p class="text-muted mb-5">
      Effizient verwalten, auswerten und organisieren – mit moderner UI und intelligenter Logik.
    </p>

    <div class="d-flex gap-3 mb-4 flex-wrap justify-content-center">
      <router-link
          to="/login"
          class="btn btn-gradient btn-lg d-flex align-items-center gap-2 shadow-sm"
      >
        <i class="bi bi-lock-fill"></i>
        Jetzt einloggen
      </router-link>
    </div>

    <div class="text-muted small">
      <i class="bi bi-info-circle me-1"></i>
      Zugriff auf diese Plattform erfordert gültige Anmeldedaten.
    </div>
  </div>
</template>

<script setup>
import StatusBadge from '@/shared/components/StatusBadge.vue'
</script>

<style scoped>
.welcome-wrapper {
  background: #fafdff;
  border-radius: 1.5rem;
  padding: 60px 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  animation: fadeIn 0.8s ease-out both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(32px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.text-gradient {
  background: linear-gradient(90deg, #388bfd 10%, #38d6ae 90%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.btn-gradient {
  background: linear-gradient(90deg, #3a7bd5, #00d2ff 70%);
  color: #fff;
  border: none;
  font-weight: 600;
  border-radius: 14px;
  padding: 12px 28px;
  box-shadow: 0 2px 12px #00d2ff22;
  transition: background 0.2s, box-shadow 0.2s;
}

.btn-gradient:hover,
.btn-gradient:focus {
  background: linear-gradient(90deg, #00d2ff, #3a7bd5 70%);
  box-shadow: 0 4px 18px #00d2ff33;
}
</style>
