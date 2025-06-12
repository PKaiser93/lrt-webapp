<template>
  <div class="welcome-wrapper container d-flex flex-column align-items-center justify-content-center text-center py-5 animate-fadein">
    <h1 class="display-4 fw-bold mb-3">🖥️ LRT Computerverwaltung 2025</h1>

    <StatusBadge class="mb-3" />

    <p class="lead mb-3">
      Willkommen zur zentralen Verwaltungsplattform für <strong>Rechner, Betriebssysteme und Netzwerkgeräte</strong> im LRT.
    </p>
    <p class="text-muted">
      Effizient verwalten, auswerten und organisieren – mit moderner UI, intelligenter Logik und umfassendem CSV-Import.
    </p>

    <div class="d-flex gap-3 mt-4">
      <router-link to="/admin" class="btn btn-outline-secondary btn-lg shadow">
        📊 Admin-Dashboard
      </router-link>
    </div>

    <div class="mt-5 text-muted small">
      <i class="bi bi-info-circle me-1"></i> Zugriff auf diese Plattform erfordert gültige Anmeldedaten.
    </div>
  </div>
</template>

<script setup>
import StatusBadge from '../components/StatusBadge.vue'
</script>

<style scoped>
.welcome-wrapper {
  background: linear-gradient(145deg, #f9fafb, #eef1f5);
  border-radius: 20px;
  padding: 60px 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  animation: fadeIn 1s ease-out;
}

@keyframes fadeIn {
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
