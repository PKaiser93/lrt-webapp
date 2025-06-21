<template>
  <div id="app" class="bg-light min-vh-100 d-flex flex-column">
    <!-- 🔝 Zentrale TopBar -->
    <TopBar />

    <!-- 🔄 Seiteninhalt -->
    <main class="container flex-grow-1 py-4">
      <router-view />
    </main>

    <!-- 🔔 Toast-Container -->
    <Toasts />
  </div>
</template>

<script setup>
import TopBar from '@/components/TopBar.vue'
import Toasts  from '@/components/Toasts.vue'  // <-- hier einbinden
</script>
