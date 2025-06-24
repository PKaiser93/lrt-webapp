<template>
  <div class="swagger-view d-flex flex-column vh-100">
    <div class="px-4 py-2 bg-white shadow-sm d-flex align-items-center">
      <h4 class="mb-0"><i class="bi bi-code-slash me-2"></i>API Docs</h4>
    </div>
    <iframe
        src="/api/docs"
        frameborder="0"
        class="flex-grow-1 w-100"
    ></iframe>
  </div>
</template>

<script setup>
// kein JS nötig
</script>

<style scoped>
.swagger-view { background: #f8f9fa; }
iframe { border: none; }
</style>
