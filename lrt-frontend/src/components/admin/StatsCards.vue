<template>
  <div class="row g-4">
    <div class="col-md-3" v-for="card in stats" :key="card.title">
      <div class="card text-white h-100 shadow-sm" :class="card.bg">
        <div class="card-body d-flex align-items-center justify-content-between">
          <div>
            <h5 class="card-title">{{ card.title }}</h5>
            <h3 class="card-text">{{ card.value }}</h3>
          </div>
          <i :class="card.icon" style="font-size: 2.5rem; opacity: 0.5;"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import http from '../../api/http'

const stats = ref([
  { title: 'Computer', value: 0, icon: 'bi bi-pc-display', bg: 'bg-primary' },
  { title: 'Benutzer', value: 0, icon: 'bi bi-people', bg: 'bg-success' },
  { title: 'Papierkorb', value: 0, icon: 'bi bi-trash3', bg: 'bg-danger' },
  { title: 'Letzter Import', value: '–', icon: 'bi bi-file-earmark-arrow-up', bg: 'bg-warning text-dark' }
])

onMounted(async () => {
  try {
    const [computer, user, trash, importLog] = await Promise.all([
      http.get('/dashboard/count/computer'),
      http.get('/dashboard/count/users'),
      http.get('/dashboard/count/trash'),
      http.get('/dashboard/last-import')
    ])

    stats.value[0].value = computer.data.count
    stats.value[1].value = user.data.count
    stats.value[2].value = trash.data.count
    stats.value[3].value = importLog.data?.date || '–'
  } catch (e) {
    console.error('❌ Fehler beim Laden der Dashboard-Stats:', e)
  }
})
</script>

<style scoped>
.card {
  border-radius: 1rem;
  transition: transform 0.2s ease;
}
.card:hover {
  transform: translateY(-5px);
}
</style>
