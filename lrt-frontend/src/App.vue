<template>
  <div id="app" class="bg-light min-vh-100 d-flex flex-column">
    <!-- 🔝 Zentrale TopBar -->
    <TopBar />

    <!-- 🔄 Seiteninhalt -->
    <main class="container flex-grow-1 py-4">
      <router-view />
    </main>

    <!-- 🔝 Zentrale FooterBar -->
    <FooterBar />

    <!-- 🔔 Toast-Container -->
    <Toasts />
  </div>
</template>

<script setup>
import TopBar from '@/shared/components/TopBar.vue'
import Toasts  from '@/shared/components/Toasts.vue'  // <-- hier einbinden
import FooterBar from '@/shared/components/FooterBar.vue'
</script>
