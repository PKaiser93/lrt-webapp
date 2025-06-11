<template>
  <div class="container py-4">
    <h2>📋 Kategorienliste</h2>
    <ul class="list-group">
      <li v-for="kat in kategorien" :key="kat._id" class="list-group-item d-flex justify-content-between">
        <span>
          <i class="bi bi-tag"></i> {{ kat.name }}
          <span class="ms-2 badge" :style="{ backgroundColor: kat.farbe }">{{ kat.farbe }}</span>
        </span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import http from '../api/http'

const kategorien = ref([])

onMounted(async () => {
  const res = await http.get('/kategorie')
  kategorien.value = res.data
})
</script>
