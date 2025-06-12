<template>
  <div class="accordion-item border-0">
    <h2 class="accordion-header">
      <button class="accordion-button collapsed" type="button" :data-bs-target="'#' + id" data-bs-toggle="collapse">
        {{ title }}
      </button>
    </h2>
    <div :id="id" class="accordion-collapse collapse">
      <div class="accordion-body">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ title: String, id: String, open: Boolean })
</script>
