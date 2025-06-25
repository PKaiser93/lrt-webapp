<template>
  <div class="alert alert-info">{{ msg }}</div>
</template>

<script setup>
// Props deklarieren
defineProps({
  msg: {
    type: String,
    required: true
  }
})
</script>
