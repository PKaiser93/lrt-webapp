<template>
  <div>
    <h2>Dashboard</h2>
    <p>Rechner insgesamt: {{ data.total }}</p>
    <h3>Top 5 Betriebssysteme</h3>
    <ul>
      <li v-for="os in data.topOS" :key="os.name">{{ os.name }} – {{ os.count }}</li>
    </ul>
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Chart from 'chart.js/auto'
import http from '../api/http'

const data = ref({ total: 0, topOS: [], yearChart: [] })
const chartCanvas = ref(null)

onMounted(async () => {
  const res = await http.get('/dashboard')
  data.value = res.data

  new Chart(chartCanvas.value, {
    type: 'bar',
    data: {
      labels: data.value.yearChart.map(y => y._id),
      datasets: [{
        label: 'Rechner pro Jahr',
        data: data.value.yearChart.map(y => y.count),
        backgroundColor: '#3399ff'
      }]
    }
  })
})
</script>
