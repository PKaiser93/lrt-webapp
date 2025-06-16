<template>
  <div class="container py-4">
    <h2 class="mb-4"><i class="bi bi-bar-chart-line me-2"></i>Admin Dashboard</h2>
    <div class="row g-4 mb-4">
      <!-- Stat Cards -->
      <StatCard icon="bi-pc-display" title="Computer" :value="stats.computer" color="primary" />
      <StatCard icon="bi-windows" title="Betriebssysteme" :value="stats.os" color="info" />
      <StatCard icon="bi-tags" title="Kategorien" :value="stats.kategorie" color="success" />
      <StatCard icon="bi-mortarboard" title="Studenten" :value="stats.student" color="warning" />
    </div>

    <div class="row g-4 mb-4">
      <div class="col-md-5">
        <!-- PieChart Card -->
        <div class="card shadow-sm rounded-4 h-100">
          <div class="card-body">
            <h5 class="card-title mb-3"><i class="bi bi-pie-chart me-2"></i>Betriebssystem-Verteilung</h5>
            <canvas ref="osChart" style="min-height:250px"></canvas>
            <div v-if="osLabels.length === 0" class="text-muted mt-2">Keine Daten verfügbar.</div>
          </div>
        </div>
      </div>
      <div class="col-md-7">
        <!-- User Management -->
        <div class="card shadow-sm rounded-4 h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h5 class="card-title mb-0"><i class="bi bi-people me-2"></i>User Management</h5>
              <button class="btn btn-primary btn-sm" @click="showCreateUser = true">
                <i class="bi bi-plus-circle me-1"></i>Neuen User anlegen
              </button>
            </div>
            <table class="table table-striped align-middle mb-0">
              <thead>
              <tr>
                <th>Username</th>
                <th>E-Mail</th>
                <th>Rolle</th>
                <th class="text-end">Aktionen</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="u in users" :key="u._id">
                <td>{{ u.username }}</td>
                <td>{{ u.email || '—' }}</td>
                <td>
                    <span class="badge" :class="u.role==='admin' ? 'bg-danger' : 'bg-secondary'">
                      {{ u.role }}
                    </span>
                </td>
                <td class="text-end">
                  <button class="btn btn-sm btn-outline-secondary me-1"
                          @click="openPwReset(u)">
                    <i class="bi bi-arrow-repeat me-1"></i>PW zurücksetzen
                  </button>
                  <button class="btn btn-sm btn-outline-danger" @click="deleteUser(u._id)">
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="!users.length"><td colspan="4" class="text-center text-muted">Keine User gefunden</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal: User anlegen -->
    <div class="modal fade show" tabindex="-1" style="display:block; background:rgba(0,0,0,0.13)" v-if="showCreateUser">
      <div class="modal-dialog">
        <div class="modal-content rounded-4">
          <div class="modal-header">
            <h5 class="modal-title"><i class="bi bi-person-plus me-2"></i>Neuen User anlegen</h5>
            <button type="button" class="btn-close" @click="showCreateUser=false"></button>
          </div>
          <form @submit.prevent="createUser">
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">Username</label>
                <input v-model="newUser.username" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">E-Mail</label>
                <input v-model="newUser.email" class="form-control" type="email" />
              </div>
              <div class="mb-3">
                <label class="form-label">Rolle</label>
                <select v-model="newUser.role" class="form-select" required>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Passwort</label>
                <input v-model="newUser.password" class="form-control" required type="text" autocomplete="new-password" />
                <button type="button" class="btn btn-link p-0 mt-1" @click="generatePassword">Zufälliges Passwort</button>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-success" type="submit">Anlegen</button>
              <button class="btn btn-secondary" type="button" @click="showCreateUser=false">Abbrechen</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div v-if="showCreateUser" class="modal-backdrop fade show"></div>

    <!-- Modal: Passwort-Reset -->
    <div class="modal fade show" tabindex="-1" style="display:block; background:rgba(0,0,0,0.13)" v-if="showPwReset">
      <div class="modal-dialog">
        <div class="modal-content rounded-4">
          <div class="modal-header">
            <h5 class="modal-title"><i class="bi bi-arrow-repeat me-2"></i>Passwort zurücksetzen</h5>
            <button type="button" class="btn-close" @click="showPwReset=false"></button>
          </div>
          <div class="modal-body">
            <p class="mb-2">Neues Passwort für <b>{{ pwUser?.username }}</b>:</p>
            <div class="input-group">
              <input class="form-control" :value="resetPassword" readonly />
              <button class="btn btn-outline-secondary" type="button" @click="copyPw">
                <i class="bi bi-clipboard"></i>
              </button>
            </div>
            <small class="text-muted d-block mt-2">Das Passwort wird nur einmalig angezeigt!</small>
          </div>
          <div class="modal-footer">
            <button class="btn btn-success" @click="showPwReset=false">Schließen</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showPwReset" class="modal-backdrop fade show"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import http from '../api/http'
import { showToast } from '../utils/toast'
import Chart from 'chart.js/auto'

// Stat Card Component
const StatCard = {
  props: ['icon', 'title', 'value', 'color'],
  template: `
    <div class="col-6 col-md-3">
      <div :class="'card shadow-sm rounded-4 h-100 border-' + color">
        <div class="card-body d-flex flex-column align-items-center py-4">
          <i :class="'bi ' + icon + ' fs-2 mb-2 text-' + color"></i>
          <h6 class="mb-1 text-muted">{{ title }}</h6>
          <h3 class="fw-bold mb-0">{{ value }}</h3>
        </div>
      </div>
    </div>
  `
}

// --- DATA ---
const stats = ref({ computer: 0, os: 0, kategorie: 0, student: 0 })
const users = ref([])
const showCreateUser = ref(false)
const showPwReset = ref(false)
const pwUser = ref(null)
const resetPassword = ref('')
const osLabels = ref([])
const osCounts = ref([])
const osChart = ref(null)
const newUser = ref({ username: '', email: '', role: 'user', password: '' })

// --- METHODS ---
onMounted(async () => {
  await fetchStats()
  await fetchUsers()
  await fetchOSStats()
  await nextTick(drawChart)
})

async function fetchStats() {
  const res = await http.get('/admin/stats')
  stats.value = res.data
}

async function fetchUsers() {
  const res = await http.get('/admin/users')
  users.value = res.data
}

async function fetchOSStats() {
  const res = await http.get('/admin/os-stats')
  osLabels.value = res.data.labels
  osCounts.value = res.data.counts
  await nextTick(drawChart)
}

function drawChart() {
  if (!osChart.value) return
  if (window._osPieChart) window._osPieChart.destroy()
  if (!osLabels.value.length) return
  window._osPieChart = new Chart(osChart.value, {
    type: 'pie',
    data: {
      labels: osLabels.value,
      datasets: [{
        data: osCounts.value,
        backgroundColor: [
          '#388bfd', '#38d6ae', '#ffc107', '#fd7e14', '#dc3545', '#6c757d', '#8e44ad'
        ]
      }]
    },
    options: {
      plugins: {
        legend: { display: true, position: 'bottom' }
      }
    }
  })
}

// User create & actions
function generatePassword() {
  newUser.value.password = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-4)
}
async function createUser() {
  try {
    await http.post('/admin/users', newUser.value)
    showToast('User angelegt!', 'success')
    showCreateUser.value = false
    Object.assign(newUser.value, { username: '', email: '', role: 'user', password: '' })
    await fetchUsers()
  } catch (err) {
    showToast(err?.response?.data?.error || 'Fehler beim Anlegen', 'danger')
  }
}
function openPwReset(user) {
  pwUser.value = user
  resetPassword.value = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-4)
  showPwReset.value = true
  // Hier sollte ein POST kommen: await http.post(`/admin/user/resetpw/${user._id}`, { password: resetPassword.value })
}
async function deleteUser(id) {
  if (!confirm('Wirklich löschen?')) return
  await http.delete(`/admin/users/${id}`)
  showToast('User gelöscht!', 'success')
  await fetchUsers()
}
function copyPw() {
  navigator.clipboard.writeText(resetPassword.value)
  showToast('Passwort kopiert!')
}
</script>

<style scoped>
.card {
  border-radius: 1.3rem;
}
.card .card-title {
  font-weight: 600;
  font-size: 1.11rem;
}
.table {
  border-radius: 1.1rem;
  overflow: hidden;
}
.badge.bg-danger { background: #dc3545 !important; }
.badge.bg-secondary { background: #6c757d !important; }
</style>
