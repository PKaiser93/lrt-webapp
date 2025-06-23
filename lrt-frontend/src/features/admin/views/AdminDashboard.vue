<template>
  <div class="admin-wrapper container-fluid p-4">
    <!-- Seite Titel -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="fs-3 text-gradient mb-0 d-flex align-items-center gap-2">
        <i class="bi bi-speedometer2"></i> Admin Dashboard
      </h1>
      <button class="btn btn-gradient" @click="createBackup">
        <i class="bi bi-hdd-stack-fill"></i> Backup jetzt
      </button>
    </div>

    <!-- Status & Kennzahlen -->
    <div class="row g-4 mb-4">
      <!-- Health Check -->
      <div class="col-lg-4">
        <div
            class="card status-card h-100"
            :class="health.status === 'ok' ? 'border-success' : 'border-danger'"
        >
          <div class="card-body">
            <div class="d-flex align-items-center mb-3">
              <i
                  class="bi bi-heart-pulse-fill fs-2 me-2"
                  :class="health.status === 'ok' ? 'text-success' : 'text-danger'"
              ></i>
              <h5 class="mb-0">System Health</h5>
            </div>
            <p>
              <strong>Status:</strong>
              <span :class="health.status === 'ok' ? 'text-success' : 'text-danger'">
                {{ health.status.toUpperCase() }}
              </span>
            </p>
            <p>
              <strong>DB:</strong>
              <span :class="health.db === 'connected' ? 'text-success' : 'text-danger'">
                {{ health.db }}
              </span>
            </p>
            <p><strong>Uptime:</strong> {{ formattedUptime }}</p>
            <small class="text-muted">Letzte Prüfung: {{ health.timestamp }}</small>
          </div>
        </div>
      </div>

      <!-- Backup Übersicht -->
      <div class="col-lg-4">
        <div class="card status-card h-100 border-primary">
          <div class="card-body d-flex flex-column justify-content-center align-items-center">
            <i class="bi bi-hdd-stack-fill fs-1 mb-2 text-primary"></i>
            <h5 class="mb-2">Letztes Backup</h5>
            <p v-if="lastBackup" class="mb-1">{{ formattedLastBackup }}</p>
            <p v-else class="mb-1 text-muted">Kein Backup vorhanden</p>
            <button
                class="btn btn-gradient d-flex align-items-center gap-1 mt-2"
                @click="createBackup"
                :disabled="savingBackup"
            >
              <span v-if="savingBackup" class="spinner-border spinner-border-sm me-1"></span>
              <i class="bi bi-hdd-stack-fill"></i>
              {{ savingBackup ? 'Erstelle …' : 'Backup erstellen' }}
            </button>
          </div>
        </div>
      </div>

      <!-- API Monitoring -->
      <div class="col-lg-4">
        <div class="card status-card h-100 border-info">
          <div class="card-body">
            <div class="d-flex align-items-center mb-3">
              <i class="bi bi-bar-chart-line-fill fs-2 me-2 text-info"></i>
              <h5 class="mb-0">API Monitoring</h5>
            </div>
            <p><strong>Requests:</strong> {{ metrics.totalRequests }}</p>
            <p><strong>Ø Latenz:</strong> {{ overallAvg }} ms</p>
            <small class="text-muted">Routen: {{ metrics.routes.length }}</small>
          </div>
        </div>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="row g-4 mb-4">
      <StatCard icon="bi-pc-display" title="Computer" :value="stats.computer" color="primary" />
      <StatCard icon="bi-window" title="Betriebssysteme" :value="stats.betriebssysteme" color="info" />
      <StatCard icon="bi-tags" title="Kategorien" :value="stats.kategorien" color="success" />
      <StatCard icon="bi-mortarboard-fill" title="Studenten" :value="stats.studenten" color="warning" />
    </div>

    <!-- Diagramm & Users -->
    <div class="row g-4">
      <!-- OS‑Verteilung -->
      <div class="col-xl-5">
        <div class="card chart-card h-100">
          <div class="card-body">
            <h5 class="card-title text-gradient d-flex align-items-center gap-2 mb-3">
              <i class="bi bi-pie-chart-fill"></i> OS‑Verteilung
            </h5>
            <canvas ref="osChart" class="w-100" style="min-height:280px;"></canvas>
            <div v-if="!osLabels.length" class="text-center text-muted mt-3">Keine Daten</div>
          </div>
        </div>
      </div>

      <!-- Users Management -->
      <div class="col-xl-7">
        <div class="card table-card h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h5 class="card-title text-gradient d-flex align-items-center gap-2 mb-0">
                <i class="bi bi-people-fill"></i> Users
              </h5>
              <button class="btn btn-gradient btn-sm" @click="showAddUser = true">
                <i class="bi bi-person-plus-fill"></i> Neu
              </button>
            </div>
            <div class="table-responsive">
              <table class="table table-striped align-middle mb-0">
                <thead class="table-light">
                <tr>
                  <th>Username</th>
                  <th>E‑Mail</th>
                  <th>Admin</th>
                  <th class="text-end">Aktionen</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="u in users" :key="u._id">
                  <td>{{ u.username }}</td>
                  <td>{{ u.email }}</td>
                  <td>
                    <i
                        :class="u.isAdmin
                          ? 'bi bi-check-circle-fill text-success'
                          : 'bi bi-x-circle-fill text-secondary'"
                    ></i>
                  </td>
                  <td class="text-end">
                    <button
                        class="btn btn-sm"
                        :class="u.isAdmin ? 'btn-outline-danger' : 'btn-outline-primary'"
                        @click="toggleAdmin(u)"
                    >
                      {{ u.isAdmin ? 'Entziehen' : 'Zum Admin' }}
                    </button>
                    <button
                        class="btn btn-sm btn-outline-secondary ms-1"
                        title="Passwort zurücksetzen"
                        @click="resetUserPassword(u)"
                    >
                      <i class="bi bi-key-fill"></i>
                    </button>
                  </td>
                </tr>
                <tr v-if="!users.length">
                  <td colspan="4" class="text-center text-muted py-3">Keine User gefunden</td>
                </tr>
                </tbody>
              </table>
            </div>
            <div
                v-if="resetPwInfo.pw"
                class="alert alert-success mt-3 d-flex align-items-center justify-content-between"
            >
              <div><i class="bi bi-key-fill me-2"></i> {{ resetPwInfo.pw }}</div>
              <div>
                <button class="btn btn-sm btn-outline-primary me-2" @click="copyPw(resetPwInfo.pw)">
                  <i class="bi bi-clipboard"></i>
                </button>
                <button class="btn btn-sm btn-close" @click="resetPwInfo = {}"></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add User Modal -->
    <div v-if="showAddUser">
      <div class="modal-backdrop fade show"></div>
      <div class="modal fade show d-block">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content rounded-4 shadow-lg overflow-hidden">
            <form @submit.prevent="addUser">
              <div class="modal-header border-0 bg-gradient-header text-white">
                <h5 class="modal-title d-flex align-items-center gap-2">
                  <i class="bi bi-person-plus-fill"></i> Neuer User
                </h5>
                <button class="btn-close btn-close-white" @click="showAddUser = false"></button>
              </div>
              <div class="modal-body p-4">
                <div class="mb-3">
                  <label class="form-label">Username</label>
                  <div class="input-group">
                    <span class="input-group-text"><i class="bi bi-person-fill"></i></span>
                    <input
                        v-model="addUserForm.username"
                        class="form-control"
                        required
                        autocomplete="off"
                    />
                  </div>
                </div>
                <div class="mb-3">
                  <label class="form-label">E‑Mail</label>
                  <div class="input-group">
                    <span class="input-group-text"><i class="bi bi-envelope-fill"></i></span>
                    <input
                        v-model="addUserForm.email"
                        type="email"
                        class="form-control"
                        required
                    />
                  </div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Passwort</label>
                  <div class="input-group">
                    <span class="input-group-text"><i class="bi bi-lock-fill"></i></span>
                    <input
                        v-model="addUserForm.password"
                        type="password"
                        class="form-control"
                        required
                    />
                  </div>
                </div>
                <div class="form-check">
                  <input
                      type="checkbox"
                      v-model="addUserForm.isAdmin"
                      class="form-check-input"
                      id="isAdmin"
                  />
                  <label class="form-check-label" for="isAdmin">Als Admin anlegen</label>
                </div>
              </div>
              <div class="modal-footer border-0 px-4 pb-4 d-flex justify-content-end gap-2">
                <button
                    type="button"
                    class="btn btn-outline-gradient"
                    @click="showAddUser = false"
                >
                  Abbrechen
                </button>
                <button type="submit" class="btn btn-gradient">Anlegen</button>
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
import http from '@/api/http.js'
import { useToastStore } from '@/stores/toast.js'
import Chart from 'chart.js/auto'

// KPI‐Card
const StatCard = {
  props: ['icon', 'title', 'value', 'color'],
  template: `
    <div class="col-6 col-sm-3">
      <div :class="'card shadow-sm rounded-4 h-100 border-' + color">
        <div class="card-body text-center py-4">
          <i :class="'bi ' + icon + ' fs-1 mb-2 text-' + color"></i>
          <h6 class="text-muted mb-1">{{ title }}</h6>
          <h4 class="fw-bold">{{ value }}</h4>
        </div>
      </div>
    </div>`,
}

const toast = useToastStore()

// System Health
const health = ref({ status: 'unknown', db: 'unknown', uptime: 0, timestamp: '' })
const formattedUptime = computed(() => {
  const s = Math.floor(health.value.uptime)
  const h = Math.floor(s / 3600),
      m = Math.floor((s % 3600) / 60),
      sec = s % 60
  return `${h}h ${m}m ${sec}s`
})
async function fetchHealth() {
  try {
    health.value = (await http.get('/health')).data
  } catch {
    health.value.status = 'error'
  }
}

// Backup
const lastBackup = ref(null)
const savingBackup = ref(false)
const formattedLastBackup = computed(() => {
  if (!lastBackup.value) return ''
  return new Date(lastBackup.value).toLocaleString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
})
async function fetchLastBackup() {
  try {
    const res = await http.get('/admin/backup/last')
    lastBackup.value = res.data.timestamp
  } catch {
    lastBackup.value = null
  }
}
async function createBackup() {
  savingBackup.value = true
  try {
    const res = await http.post('/admin/backup')
    toast.show('Backup erfolgreich erstellt', 'success')
    lastBackup.value = res.data.timestamp || lastBackup.value
  } catch {
    toast.show('Backup fehlgeschlagen', 'danger')
  } finally {
    savingBackup.value = false
  }
}

// Stats & Metrics
const stats = ref({ computer: 0, betriebssysteme: 0, kategorien: 0, studenten: 0 })
async function fetchStats() {
  stats.value = (await http.get('/admin/stats')).data
}

const metrics = ref({ totalRequests: 0, routes: [] })
const overallAvg = computed(() => {
  const r = metrics.value.routes
  if (!r.length) return 0
  return (r.reduce((a, b) => a + b.avgLatency, 0) / r.length).toFixed(1)
})
async function fetchMetrics() {
  const r = (await http.get('/admin/metrics')).data
  metrics.value = {
    totalRequests: r.totalRequests,
    routes: r.routes.map((x) => ({ ...x, avgLatency: +x.avgLatency.toFixed(1) })),
  }
}

// OS‑Stats
const osLabels = ref([]),
    osCounts = ref([])
async function fetchOSStats() {
  const r = (await http.get('/admin/os-stats')).data
  osLabels.value = r.labels
  osCounts.value = r.counts
}
function drawChart() {
  if (window._osPieChart) window._osPieChart.destroy()
  window._osPieChart = new Chart($refs.osChart, {
    type: 'pie',
    data: {
      labels: osLabels.value,
      datasets: [
        {
          data: osCounts.value,
          backgroundColor: ['#388bfd', '#38d6ae', '#ffc107', '#fd7e14', '#dc3545', '#6c757d'],
        },
      ],
    },
    options: { plugins: { legend: { position: 'bottom' } } },
  })
}

// Users Management
const users = ref([])
async function fetchUsers() {
  users.value = (await http.get('/admin/users')).data
}
async function toggleAdmin(u) {
  const r = await http.patch(`/admin/users/toggle-admin/${u._id}`)
  u.isAdmin = r.data.isAdmin
  toast.show(`"${u.username}" ist ${u.isAdmin ? 'Admin' : 'kein Admin'}`, 'info')
}
const resetPwInfo = ref({})
async function resetUserPassword(u) {
  if (!confirm(`Passwort für ${u.username} zurücksetzen?`)) return
  const r = await http.patch(`/admin/users/reset-password/${u._id}`)
  resetPwInfo.value = { id: u._id, pw: r.data.password }
  toast.show('Passwort zurückgesetzt', 'success')
}
function copyPw(pw) {
  navigator.clipboard.writeText(pw)
  toast.show('Kopiert', 'info')
}

// Add User
const showAddUser = ref(false)
const addUserForm = ref({ username: '', email: '', password: '', isAdmin: false })
async function addUser() {
  await http.post('/admin/users', addUserForm.value)
  toast.show('User angelegt', 'success')
  showAddUser.value = false
  Object.assign(addUserForm.value, { username: '', email: '', password: '', isAdmin: false })
  fetchUsers()
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    fetchHealth(),
    fetchStats(),
    fetchMetrics(),
    fetchUsers(),
    fetchOSStats(),
    fetchLastBackup(),
  ])
  await nextTick(drawChart)
})
</script>

<style scoped>
.admin-wrapper {
  background: #fafdff;
  border-radius: 1rem;
}
.text-gradient {
  background: linear-gradient(90deg, #ff9360, #388bfd);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.status-card {
  border-width: 2px !important;
}
.chart-card,
.table-card {
  border: 1px solid #e9ecef;
}
.bg-gradient-header {
  background: linear-gradient(120deg, #3a7bd5 0%, #00d2ff 90%);
}
.btn-gradient {
  background: linear-gradient(90deg, #3a7bd5, #00d2ff 70%);
  color: #fff;
  border: none;
  border-radius: 0.75rem;
  padding: 0.5rem 1rem;
}
.btn-gradient:hover {
  opacity: 0.9;
}
.btn-outline-gradient {
  border: 2px solid #3a7bd5;
  color: #3a7bd5;
  background: #fff;
  border-radius: 0.75rem;
  padding: 0.3rem 0.75rem;
}
.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}
.modal-backdrop {
  z-index: 1050;
}
.modal.fade.show.d-block { z-index: 1100; background: transparent; }
</style>
