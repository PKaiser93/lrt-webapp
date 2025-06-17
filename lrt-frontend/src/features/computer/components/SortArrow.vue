<script setup>
defineProps(['field', 'sortField', 'sortDir']);
</script>

<template>
  <span v-if="field === sortField">
    <i v-if="sortDir === 'asc'" class="bi bi-caret-up-fill"></i>
    <i v-else class="bi bi-caret-down-fill"></i>
  </span>
  <span v-else style="opacity:.4">
    <i class="bi bi-arrow-down-up"></i>
  </span>
</template>
