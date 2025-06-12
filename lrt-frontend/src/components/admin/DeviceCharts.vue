<template>
  <div class="card shadow-sm p-3">
    <h5 class="mb-3">🖥️ Geräte je Betriebssystem</h5>
    <Bar v-if="chartData" :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import http from '../../api/http'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const chartData = ref(null)

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: context => `${context.parsed.y} Geräte`
      }
    }
  },
  scales: {
    y: { beginAtZero: true, title: { display: true, text: 'Anzahl' } },
    x: { title: { display: true, text: 'Betriebssystem' } }
  }
}

onMounted(async () => {
  const res = await http.get('/dashboard/devices-per-os')
  const labels = res.data.map(entry => entry._id || 'Unbekannt')
  const values = res.data.map(entry => entry.count)

  chartData.value = {
    labels,
    datasets: [{
      label: 'Geräte',
      data: values,
      backgroundColor: '#3b82f6'
    }]
  }
})
</script>
