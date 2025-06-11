<template>
  <div class="container text-center py-5">
    <h1 class="mb-4">LRT Computerverwaltung 🖥️</h1>
    <p class="lead">Willkommen! Wähle eine Aktion:</p>
    <div class="d-flex justify-content-center gap-3 mt-4">
      <router-link class="btn btn-primary" to="/rechner">
        📋 Rechner anzeigen
      </router-link>
      <router-link class="btn btn-outline-secondary" to="/admin">
        📊 Admin-Dashboard
      </router-link>
    </div>
  </div>
</template>


<script setup>
</script>

<style scoped>
.home {
  text-align: center;
  padding: 40px;
}
nav a {
  margin: 0 10px;
  text-decoration: none;
  color: #3366cc;
  font-weight: bold;
}
</style>
