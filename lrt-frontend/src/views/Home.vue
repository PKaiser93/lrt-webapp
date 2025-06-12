<template>
  <div class="container text-center py-5">
    <h1 class="display-5 fw-bold mb-4 text-primary-emphasis">
      🖥️ LRT Computerverwaltung
    </h1>
    <p class="lead text-secondary mb-5">Willkommen zur zentralen Verwaltungsplattform.</p>

    <div class="d-flex justify-content-center flex-wrap gap-4">
      <router-link to="/computer" class="btn btn-lg btn-outline-primary shadow-sm rounded-pill">
        📋 Rechner anzeigen
      </router-link>
      <router-link to="/admin" class="btn btn-lg btn-outline-dark shadow-sm rounded-pill">
        📊 Admin-Dashboard
      </router-link>
    </div>
  </div>
</template>

<script setup>
// no logic needed
</script>

<style scoped>
.container {
  max-width: 720px;
}

.btn {
  min-width: 220px;
  transition: all 0.2s ease-in-out;
}

.btn:hover {
  transform: scale(1.03);
}
</style>
