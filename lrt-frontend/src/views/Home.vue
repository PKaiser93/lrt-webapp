<template>
  <div class="welcome-wrapper container d-flex flex-column align-items-center justify-content-center text-center py-5">
    <h1 class="display-4 fw-bold mb-3 text-gradient">
      <i class="bi bi-pc-display-horizontal me-2"></i> LRT Computerverwaltung
    </h1>
    <StatusBadge class="mb-3" />

    <p class="lead mb-3">
      Willkommen zur zentralen Verwaltungsplattform für <strong>Rechner, Betriebssysteme und Netzwerkgeräte</strong> im LRT.
    </p>
    <p class="text-muted mb-4">
      Effizient verwalten, auswerten und organisieren – mit smarter UI, Auswertungen und umfassendem CSV-Import.
    </p>

    <div class="d-flex gap-3 mt-3 flex-wrap justify-content-center">
      <router-link to="/computer" class="btn btn-lg btn-glass shadow-sm d-flex align-items-center gap-2">
        <i class="bi bi-hdd-network"></i> Computer Liste
      </router-link>
      <router-link to="/admin" class="btn btn-lg btn-glass shadow-sm d-flex align-items-center gap-2">
        <i class="bi bi-bar-chart-line"></i> Admin-Dashboard
      </router-link>
    </div>

    <div class="mt-5 text-muted small">
      <i class="bi bi-info-circle me-1"></i>
      Zugriff auf diese Plattform erfordert gültige Anmeldedaten.
    </div>
  </div>
</template>

<script setup>
import StatusBadge from '../components/StatusBadge.vue'
</script>

<style scoped>
.welcome-wrapper {
  background: rgba(255,255,255,0.92);
  border-radius: 2rem;
  padding: 60px 30px;
  box-shadow: 0 10px 40px rgba(30, 60, 150, 0.10);
  animation: fadeIn 1s ease-out;
  max-width: 700px;
  margin-top: 40px;
}

.text-gradient {
  background: linear-gradient(90deg, #2979ff 20%, #00b8d9 80%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.btn-glass {
  background: rgba(245,250,255,0.85);
  border: 1.5px solid #e3e8f0;
  color: #205080;
  font-weight: 500;
  border-radius: 1.2em;
  padding: 0.72em 2em;
  transition: all .14s cubic-bezier(.4,0,.2,1);
  box-shadow: 0 4px 18px rgba(60, 80, 200, 0.04);
}

.btn-glass:hover {
  background: #e7f1fb;
  color: #176bcb;
  border-color: #b5d2f3;
  box-shadow: 0 6px 24px rgba(60, 80, 200, 0.07);
  transform: translateY(-2px) scale(1.02);
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
