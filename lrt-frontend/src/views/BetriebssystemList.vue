<template>
  <div class="container py-4">
    <h2>📋 Betriebssystemliste</h2>
    <ul class="list-group">
      <li v-for="os in osList" :key="os._id" class="list-group-item">
        <i class="bi bi-cpu"></i> {{ os.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import http from '../api/http'

const osList = ref([])

onMounted(async () => {
  const res = await http.get('/betriebssystem')
  osList.value = res.data
})
</script>
