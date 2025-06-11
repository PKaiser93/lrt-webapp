<template>
  <div class="card shadow-sm">
    <div class="card-body">
      <h5 class="card-title">{{ computer.dnsName }}</h5>
      <h6 class="card-subtitle mb-2 text-muted">{{ computer.ipAdresse }}</h6>
      <p class="card-text">
        {{ computer.marke }} {{ computer.typ }}<br />
        CPU: {{ computer.cpu }}<br />
        RAM: {{ computer.ram }}<br />
        HDD/SSD: {{ computer.hddssd }}
      </p>
    </div>
  </div>
</template>


<script setup>
defineProps(['computer'])
</script>
