<template>
  <div class="empty-state text-center py-5">
    <div v-if="icon" class="fs-1 mb-2 text-secondary">
      <i :class="icon"></i>
    </div>
    <h5 class="fw-semibold mb-1">{{ title }}</h5>
    <p class="text-muted mb-3">{{ description }}</p>
    <slot />
  </div>
</template>

<script setup>
defineProps({
  icon: String,
  title: { type: String, required: true },
  description: String
})
</script>

<style scoped>
.empty-state {
  background: #f8fafc;
  border-radius: 1.2rem;
  border: 1.5px dashed #e0e6ef;
  box-shadow: 0 2px 8px #00d2ff12;
  margin: 28px 0;
}
</style>
