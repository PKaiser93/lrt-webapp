<template>
  <div class="admin-wrapper container py-4">
    <!-- Überschrift -->
    <h2 class="mb-4 text-gradient fw-bold d-flex align-items-center gap-2">
      <i class="bi bi-bar-chart-line me-2"></i>Admin Dashboard
    </h2>

    <!-- Statistikkarten -->
    <div class="row g-4 mb-4">
      <StatCard icon="bi-pc-display"        title="Computer"           :value="stats.computer"           color="primary" />
      <StatCard icon="bi-windows"            title="Betriebssysteme"    :value="stats.betriebssysteme"    color="info"    />
      <StatCard icon="bi-tags"               title="Kategorien"         :value="stats.kategorien"         color="success" />
      <StatCard icon="bi-mortarboard"        title="Studenten"         :value="stats.studenten"          color="warning" />
    </div>

    <div class="row g-4">
      <!-- Pie-Chart für OS-Verteilung -->
      <div class="col-md-5">
        <div class="card shadow-sm rounded-4 h-100 border-0">
          <div class="card-body">
            <h5 class="card-title text-gradient mb-3 d-flex align-items-center gap-2">
              <i class="bi bi-pie-chart"></i>Betriebssystem‑Verteilung
            </h5>
            <canvas ref="osChart" class="w-100" style="min-height:250px"></canvas>
            <div v-if="!osLabels.length" class="text-muted mt-2">Keine Daten verfügbar.</div>
            <div v-if="osLabels.includes('Unbekannt')" class="alert alert-warning mt-3 py-1">
              Achtung: Einige Computer haben kein oder unbekanntes Betriebssystem!
            </div>
          </div>
        </div>
      </div>

      <!-- User‑Management -->
      <div class="col-md-7">
        <div class="card shadow-sm rounded-4 h-100 border-0">
          <div class="card-body">
            <h5 class="card-title text-gradient mb-3 d-flex align-items-center gap-2">
              <i class="bi bi-people"></i>Users Management
            </h5>
            <div class="table-responsive">
              <table class="table table-striped align-middle mb-0 rounded-4">
                <thead class="table-light">
                <tr>
                  <th>Username</th>
                  <th>isAdmin</th>
                  <th class="text-end">Aktionen</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="u in users" :key="u._id">
                  <td>{{ u.username }}</td>
                  <td>{{ u.isAdmin }}</td>
                  <td class="text-end">
                    <button
                        class="btn btn-sm"
                        :class="u.isAdmin ? 'btn-outline-danger' : 'btn-outline-primary'"
                        @click="toggleAdmin(u)"
                    >
                      {{ u.isAdmin ? 'Entziehen' : 'Zum Admin machen' }}
                    </button>
                  </td>
                </tr>
                <tr v-if="!users.length">
                  <td colspan="3" class="text-center text-muted py-3">
                    Keine User gefunden.
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import http from '@/api/http'
import { useToastStore } from '@/stores/toast'
import Chart from 'chart.js/auto'

const toast = useToastStore()

// StatCard‑Komponente
const StatCard = {
  props: ['icon','title','value','color'],
  template: `
    <div class="col-6 col-md-3">
      <div :class="'card shadow-sm rounded-4 h-100 border-' + color">
        <div class="card-body d-flex flex-column align-items-center py-4">
          <i :class="'bi ' + icon + ' fs-2 mb-2 text-' + color"></i>
          <h6 class="text-muted mb-1">{{ title }}</h6>
          <h3 class="fw-bold mb-0">{{ value }}</h3>
        </div>
      </div>
    </div>
  `
}

// State
const stats      = ref({ computer:0, betriebssysteme:0, kategorien:0, studenten:0 })
const osLabels   = ref([])
const osCounts   = ref([])
const osChart    = ref(null)
const users      = ref([])

// Lifecycle
onMounted(async () => {
  await fetchStats()
  await fetchOSStats()
  await nextTick(drawChart)
  await fetchUsers()
})

// API‑Aufrufe
async function fetchStats() {
  const res = await http.get('/admin/stats')
  stats.value = res.data
}
async function fetchOSStats() {
  const res = await http.get('/admin/os-stats')
  osLabels.value = res.data.labels
  osCounts.value = res.data.counts
}
async function fetchUsers() {
  try {
    const res = await http.get('/admin/users')
    users.value = res.data
  } catch {
    toast.show('Fehler beim Laden der User', 4000)
  }
}

// Chart.js initialisieren
function drawChart() {
  if (!osChart.value || !osLabels.value.length) return
  if (window._osPieChart) window._osPieChart.destroy()
  window._osPieChart = new Chart(osChart.value, {
    type: 'pie',
    data: {
      labels: osLabels.value,
      datasets: [{ data: osCounts.value, backgroundColor: [
          '#388bfd','#38d6ae','#ffc107','#fd7e14','#dc3545','#6c757d','#8e44ad'
        ]}]
    },
    options: { plugins: { legend: { display:true, position:'bottom' } } }
  })
}

// isAdmin umschalten
async function toggleAdmin(user) {
  try {
    const res = await http.patch(`/admin/users/toggle-admin/${user._id}`)
    user.isAdmin = res.data.isAdmin
    toast.show(
        `User "${user.username}" ist jetzt ${user.isAdmin ? 'Admin' : 'kein Admin'}.`,
        3000
    )
  } catch {
    toast.show('Fehler beim Umschalten', 3000)
  }
}
</script>

<style scoped>
.admin-wrapper {
  background: #fafdff;
  border-radius: 1.3rem;
  box-shadow: 0 8px 32px rgba(44,62,80,0.05);
}
.text-gradient {
  background: linear-gradient(90deg,#ff9360,#388bfd);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.table {
  border-radius: .8rem;
  overflow: hidden;
}
.btn-outline-primary {
  border-radius: .75rem;
  border-color: #0d6efd;
  color: #0d6efd;
}
.btn-outline-danger {
  border-radius: .75rem;
  border-color: #dc3545;
  color: #dc3545;
}
</style>
