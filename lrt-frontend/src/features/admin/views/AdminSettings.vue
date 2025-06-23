<template>
  <div class="settings-wrapper container py-4">
    <h2 class="mb-4 text-gradient d-flex align-items-center gap-2">
      <i class="bi bi-gear-fill"></i> App‑Einstellungen
    </h2>

    <!-- Maintenance Mode -->
    <div class="card mb-4 shadow-sm rounded-4">
      <div class="card-body d-flex justify-content-between align-items-center">
        <div>
          <h5><i class="bi bi-tools me-2"></i> Wartungsmodus</h5>
          <p class="mb-0 text-muted">Schaltet die gesamte App in den Wartungsmodus.</p>
        </div>
        <div class="form-check form-switch">
          <input
              class="form-check-input"
              type="checkbox"
              id="maintenanceSwitch"
              v-model="maintenanceMode"
              @change="toggleMaintenance"
          />
          <label class="form-check-label" for="maintenanceSwitch">
            {{ maintenanceMode ? 'AN' : 'AUS' }}
          </label>
        </div>
      </div>
    </div>

    <!-- Feature Flags -->
    <div class="card shadow-sm rounded-4">
      <div class="card-body">
        <h5 class="mb-3"><i class="bi bi-flower1 me-2"></i> Feature‑Flags</h5>
        <ul class="list-group">
          <li
              v-for="flag in featureFlags"
              :key="flag.name"
              class="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <strong>{{ flag.label }}</strong>
              <small class="text-muted d-block">{{ flag.name }}</small>
            </div>
            <div class="form-check form-switch">
              <input
                  class="form-check-input"
                  type="checkbox"
                  :id="flag.name"
                  v-model="flag.enabled"
                  @change="toggleFlag(flag)"
              />
              <label class="form-check-label" :for="flag.name">
                {{ flag.enabled ? 'ENABLED' : 'DISABLED' }}
              </label>
            </div>
          </li>
          <li v-if="!featureFlags.length" class="list-group-item text-center text-muted">
            Keine Feature‑Flags definiert.
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import http from '@/api/http'
import { useToastStore } from '@/stores/toast'

const toast = useToastStore()
const maintenanceMode = ref(false)
const featureFlags    = ref([])

async function loadSettings() {
  const res = await http.get('/admin/settings')
  maintenanceMode.value = res.data.maintenanceMode
  featureFlags.value    = res.data.featureFlags
}

async function toggleMaintenance() {
  try {
    const res = await http.patch('/admin/settings/maintenance', { enabled: maintenanceMode.value })
    maintenanceMode.value = res.data.maintenanceMode
    toast.show('Wartungsmodus aktualisiert', 'success')
  } catch {
    toast.show('Fehler beim Umschalten', 'danger')
  }
}

async function toggleFlag(flag) {
  try {
    const res = await http.patch(`/admin/settings/flag/${flag.name}`, { enabled: flag.enabled })
    flag.enabled = res.data.enabled
    toast.show(`Feature-Flag "${flag.label}" aktualisiert`, 'success')
  } catch {
    toast.show('Fehler beim Umschalten', 'danger')
  }
}

onMounted(loadSettings)
</script>

<style scoped>
.settings-wrapper {
  max-width: 800px;
  margin: 0 auto;
}
.text-gradient {
  background: linear-gradient(90deg, #3a7bd5 0%, #00d2ff 90%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.card {
  border-radius: 1rem;
}
</style>
