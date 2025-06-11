<template>
  <div class="modal fade show d-block bg-dark bg-opacity-50" tabindex="-1" @click="$emit('close')">
    <div class="modal-dialog modal-lg" @click.stop>
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ computer.dnsName }}</h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>
        <div class="modal-body">
          <pre class="small">{{ computer }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
defineProps(['computer'])
</script>
