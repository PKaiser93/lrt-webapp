<template>
  <footer class="glass-footbar py-2">
    <div class="container-fluid d-flex justify-content-between align-items-center">
      <!-- Links: Versionsnummer -->
      <div class="text-muted small">
        Version {{ version }}
      </div>
      <!-- Rechts: Copyright -->
      <div class="text-muted small">
        © {{ year }} Lehrstuhl für Regelungstechnik
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'
// Du kannst die Version zentral z. B. aus package.json importieren:
import pkg from '../../../package.json'

const version = pkg.version
const year    = ref(new Date().getFullYear())
</script>

<style scoped>
.glass-footbar {
  position: sticky;
  bottom: 0;
  background: rgba(245, 249, 255, 0.93);
  backdrop-filter: blur(18px) saturate(170%);
  border-top: 2px solid #e4eefa;
  box-shadow: 0 -8px 32px 0 rgba(56,139,253,0.13), 0 -2.5px 8px rgba(44,100,204,0.12);
  border-radius: 22px 22px 0 0;
}
.small {
  font-size: 0.85rem;
}
@media (max-width: 576px) {
  .glass-footbar {
    padding: 0.5rem 1rem;
  }
}
</style>
