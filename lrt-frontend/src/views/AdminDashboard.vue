<template>
  <div class="admin-wrapper container py-4">
    <!-- Überschrift -->
    <h2 class="mb-4 text-gradient fw-bold d-flex align-items-center gap-2">
      <i class="bi bi-bar-chart-line me-2"></i>Admin Dashboard
    </h2>

    <!-- Health‑Check, Backup & API‑Monitoring -->
    <div class="row g-4 mb-4">
      <!-- Health-Check -->
      <div class="col-md-3">
        <div class="card shadow-sm rounded-4 h-100" :class="health.status === 'ok' ? 'border-success' : 'border-danger'">
          <div class="card-body">
            <h5 class="card-title mb-3"><i class="bi bi-heart-pulse me-2"></i>Health Check</h5>
            <p class="mb-1">
              Status:
              <span :class="health.status === 'ok' ? 'text-success' : 'text-danger'">{{ health.status.toUpperCase() }}</span>
            </p>
            <p class="mb-1">
              DB:
              <span :class="health.db === 'connected' ? 'text-success' : 'text-danger'">{{ health.db }}</span>
            </p>
            <p class="mb-1">Uptime: {{ formattedUptime }}</p>
            <p class="text-muted small mb-0">Aktualisiert: {{ health.timestamp }}</p>
          </div>
        </div>
      </div>
      <!-- Backup -->
      <div class="col-md-3">
        <div class="card shadow-sm rounded-4 h-100 border border-primary">
          <div class="card-body d-flex flex-column justify-content-center">
            <h5 class="card-title mb-3"><i class="bi bi-hdd-stack me-2"></i>Backup</h5>
            <button class="btn btn-gradient d-flex align-items-center gap-1" @click="createBackup">
              <i class="bi bi-hdd-stack"></i> Backup erstellen
            </button>
          </div>
        </div>
      </div>
      <!-- API Monitoring -->
      <div class="col-md-3">
        <div class="card shadow-sm rounded-4 h-100 border-info">
          <div class="card-body">
            <h5 class="card-title mb-3"><i class="bi bi-bar-chart me-2"></i>API Monitoring</h5>
            <p class="mb-1">
              Requests gesamt: <strong>{{ metrics.totalRequests }}</strong>
            </p>
            <p class="mb-1">Ø Latenz: <strong>{{ overallAvg }} ms</strong></p>
            <p class="text-muted small mb-0">Routen: {{ metrics.routes.length }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Statistikkarten -->
    <div class="row g-4 mb-4">
      <StatCard icon="bi-pc-display" title="Computer" :value="stats.computer" color="primary" />
      <StatCard icon="bi-windows" title="Betriebssysteme" :value="stats.betriebssysteme" color="info" />
      <StatCard icon="bi-tags" title="Kategorien" :value="stats.kategorien" color="success" />
      <StatCard icon="bi-mortarboard" title="Studenten" :value="stats.studenten" color="warning" />
    </div>

    <!-- OS‑Verteilung & Users Management -->
    <div class="row g-4">
      <!-- Pie Chart -->
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
      <!-- Users Management -->
      <div class="col-md-7">
        <div class="card shadow-sm rounded-4 h-100 border-0">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
              <h5 class="card-title text-gradient mb-0 d-flex align-items-center gap-2">
                <i class="bi bi-people"></i>Users Management
              </h5>
              <button class="btn btn-gradient d-flex align-items-center gap-1" @click="showAddUser = true">
                <i class="bi bi-person-plus"></i> Benutzer hinzufügen
              </button>
            </div>
            <div class="table-responsive">
              <table class="table table-striped align-middle mb-0 rounded-4">
                <thead class="table-light">
                <tr>
                  <th>Username</th>
                  <th>E-Mail</th>
                  <th>isAdmin</th>
                  <th class="text-end">Aktionen</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="u in users" :key="u._id">
                  <td>{{ u.username }}</td>
                  <td>{{ u.email }}</td>
                  <td>{{ u.isAdmin ? 'Ja' : 'Nein' }}</td>
                  <td class="text-end">
                    <button
                        class="btn btn-sm"
                        :class="u.isAdmin ? 'btn-outline-danger' : 'btn-outline-primary'"
                        @click="toggleAdmin(u)"
                    >
                      {{ u.isAdmin ? 'Entziehen' : 'Zum Admin machen' }}
                    </button>
                    <button
                        class="btn btn-sm btn-outline-secondary ms-1"
                        title="Passwort zurücksetzen"
                        @click="resetUserPassword(u)"
                    >
                      <i class="bi bi-key"></i>
                    </button>
                  </td>
                </tr>
                <tr v-if="!users.length">
                  <td colspan="4" class="text-center text-muted py-3">
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

    <div v-if="resetPwInfo.pw" class="alert alert-success mt-3 d-flex align-items-center gap-2">
      <span><i class="bi bi-key"></i> Neues Passwort:</span>
      <code style="font-size:1.15em">{{ resetPwInfo.pw }}</code>
      <button class="btn btn-sm btn-outline-primary ms-2" @click="copyPw(resetPwInfo.pw)">
        <i class="bi bi-clipboard"></i> Kopieren
      </button>
      <button class="btn btn-close ms-2" @click="resetPwInfo = {}" aria-label="Schließen"></button>
    </div>


    <!-- Benutzer hinzufügen Modal -->
    <div v-if="showAddUser">
      <div class="modal-backdrop fade show"></div>
      <div class="modal fade show d-block">
        <div class="modal-dialog">
          <div class="modal-content rounded-4">
            <div class="modal-header">
              <h5 class="modal-title"><i class="bi bi-person-plus me-2"></i>Neuer Benutzer</h5>
              <button class="btn-close" @click="showAddUser = false"></button>
            </div>
            <form @submit.prevent="addUser">
              <div class="modal-body">
                <div class="mb-3">
                  <label>Username</label>
                  <input v-model="addUserForm.username" class="form-control" required autocomplete="off"/>
                </div>
                <div class="mb-3">
                  <label>E-Mail</label>
                  <input v-model="addUserForm.email" type="email" class="form-control" required autocomplete="off"/>
                </div>
                <div class="mb-3">
                  <label>Passwort</label>
                  <input v-model="addUserForm.password" type="password" class="form-control" required autocomplete="new-password"/>
                </div>
                <div class="mb-2">
                  <label>
                    <input type="checkbox" v-model="addUserForm.isAdmin" class="form-check-input me-1"/>
                    Als Admin anlegen
                  </label>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" @click="showAddUser = false">Abbrechen</button>
                <button type="submit" class="btn btn-gradient">Benutzer anlegen</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import http from '@/api/http'
import { useToastStore } from '@/stores/toast'
import Chart from 'chart.js/auto'

// StatCard‑Komponente für KPIs
const StatCard = {
  props: ['icon', 'title', 'value', 'color'],
  template: `
    <div class="col-6 col-md-3">
      <div :class="'card shadow-sm rounded-4 h-100 border-' + color">
        <div class="card-body d-flex flex-column align-items-center py-4">
          <i :class="'bi ' + icon + ' fs-2 mb-2 text-' + color"></i>
          <h6 class="text-muted mb-1">{{ title }}</h6>
          <h3 class="fw-bold mb-0">{{ value }}</h3>
        </div>
      </div>
    </div>`
}

const toast = useToastStore()
const resetPwInfo = ref({})

async function resetUserPassword(user) {
  if (!confirm(`Passwort für "${user.username}" wirklich zurücksetzen?`)) return
  try {
    const res = await http.patch(`/admin/users/reset-password/${user._id}`)
    resetPwInfo.value = { id: user._id, pw: res.data.password }
    toast.show('Passwort zurückgesetzt', 3500)
  } catch {
    toast.show('Fehler beim Zurücksetzen', 3500)
  }
}
function copyPw(pw) {
  navigator.clipboard.writeText(pw)
  toast.show('Kopiert!', 2000)
}

// Health
const health = ref({ status: 'unknown', db: 'unknown', uptime: 0, timestamp: '' })
const formattedUptime = computed(() => {
  const s = Math.floor(health.value.uptime)
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60
  return `${h}h ${m}m ${sec}s`
})
async function fetchHealth() {
  try {
    const res = await http.get('/health')
    health.value = res.data
  } catch {
    health.value.status = 'error'
  }
}

// Backup
async function createBackup() {
  try {
    await http.post('/admin/backup')
    toast.show('Backup erfolgreich erstellt', 3000)
  } catch {
    toast.show('Backup fehlgeschlagen', 3000)
  }
}

// Statistiken
const stats = ref({ computer: 0, betriebssysteme: 0, kategorien: 0, studenten: 0 })
async function fetchStats() {
  const res = await http.get('/admin/stats')
  stats.value = res.data
}

// OS Statistik
const osLabels = ref([])
const osCounts = ref([])
const osChart = ref(null)
async function fetchOSStats() {
  const res = await http.get('/admin/os-stats')
  osLabels.value = res.data.labels
  osCounts.value = res.data.counts
}
function drawChart() {
  if (!osChart.value || !osLabels.value.length) return
  if (window._osPieChart) window._osPieChart.destroy()
  window._osPieChart = new Chart(osChart.value, {
    type: 'pie',
    data: { labels: osLabels.value, datasets: [{ data: osCounts.value, backgroundColor: ['#388bfd', '#38d6ae', '#ffc107', '#fd7e14', '#dc3545', '#6c757d', '#8e44ad'] }] },
    options: { plugins: { legend: { display: true, position: 'bottom' } } }
  })
}

// Users Management
const users = ref([])
async function fetchUsers() {
  try {
    const res = await http.get('/admin/users')
    users.value = res.data
  } catch {
    toast.show('Fehler beim Laden der User', 4000)
  }
}
async function toggleAdmin(u) {
  try {
    const res = await http.patch(`/admin/users/toggle-admin/${u._id}`)
    u.isAdmin = res.data.isAdmin
    toast.show(`User "${u.username}" ist nun ${u.isAdmin ? 'Admin' : 'kein Admin'}.`, 3000)
  } catch {
    toast.show('Fehler beim Umschalten', 3000)
  }
}

// Benutzer hinzufügen Modal
const showAddUser = ref(false)
const addUserForm = ref({ username: '', email: '', password: '', isAdmin: false })
async function addUser() {
  try {
    await http.post('/admin/users', addUserForm.value)
    toast.show('Benutzer angelegt!', 3000)
    showAddUser.value = false
    addUserForm.value = { username: '', email: '', password: '', isAdmin: false }
    fetchUsers()
  } catch (e) {
    toast.show('Fehler beim Anlegen des Benutzers', 3500)
  }
}

// API‑Monitoring
const metrics = ref({ totalRequests: 0, routes: [] })
async function fetchMetrics() {
  try {
    const res = await http.get('/admin/metrics')
    metrics.value = {
      totalRequests: res.data.totalRequests,
      routes: res.data.routes.map(r =>
          ({ ...r, avgLatency: parseFloat(r.avgLatency.toFixed(1)) })
      )
    }
  } catch {
    toast.show('Fehler beim Laden der Metriken', 3000)
  }
}
const overallAvg = computed(() => {
  if (!metrics.value.routes.length) return 0
  const sum = metrics.value.routes.reduce((a, b) => a + b.avgLatency, 0)
  return (sum / metrics.value.routes.length).toFixed(1)
})

// Lifecycle
onMounted(async () => {
  await fetchHealth()
  await fetchStats()
  await fetchUsers()
  await fetchOSStats()
  await nextTick(drawChart)
  await fetchMetrics()
})
</script>

<style scoped>
.admin-wrapper {
  background: #fafdff;
  border-radius: 1.3rem;
  box-shadow: 0 8px 32px rgba(44,62,80,.05);
}
.text-gradient {
  background: linear-gradient(90deg,#ff9360,#388bfd);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.btn-gradient {
  background: linear-gradient(90deg,#3a7bd5,#00d2ff 70%);
  color: #fff;
  border: none;
  border-radius: 14px;
  padding: 8px 18px;
  box-shadow: 0 2px 12px #00d2ff13;
  transition: background .2s, box-shadow .2s;
}
.btn-gradient:hover {
  background: linear-gradient(90deg,#00d2ff,#3a7bd5 70%);
  box-shadow: 0 4px 18px #3a7bd525;
}
.table {
  border-radius: .8rem;
  overflow: hidden;
}
.btn-outline-primary, .btn-outline-danger {
  border-radius: .75rem;
}
.modal-backdrop { z-index: 1050; }
.modal.fade.show.d-block { z-index: 1100; background: transparent; }
</style>
