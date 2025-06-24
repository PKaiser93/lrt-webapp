<template>
  <div class="settings-wrapper container py-4">
    <h2 class="fs-lg mb-4 text-gradient d-flex align-items-center gap-2">
      <i class="bi bi-gear-fill"></i> App‑Einstellungen
    </h2>

    <!-- Maintenance Mode -->
    <div class="card mb-4">
      <div class="card-body d-flex justify-content-between align-items-center">
        <div>
          <h5 class="fs-md d-flex align-items-center gap-1">
            <i class="bi bi-tools"></i> Wartungsmodus
          </h5>
          <p class="text-muted fs-sm mb-0">
            Schaltet die gesamte App in den Wartungsmodus.
          </p>
        </div>
        <div class="form-check form-switch">
          <input
              class="form-check-input"
              type="checkbox"
              id="maintenanceSwitch"
              v-model="settings.maintenanceMode"
              @change="toggleMaintenance"
          />
          <label class="form-check-label fs-sm" for="maintenanceSwitch">
            {{ settings.maintenanceMode ? 'AN' : 'AUS' }}
          </label>
        </div>
      </div>
    </div>

    <!-- Feature Flags -->
    <div class="card" v-if="settings.featureFlags?.length >= 0">
      <div class="card-body">
        <h5 class="fs-md mb-3 d-flex align-items-center gap-1">
          <i class="bi bi-flower1"></i> Feature‑Flags
        </h5>
        <ul class="list-group">
          <li
              v-for="flag in settings.featureFlags"
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
              <label class="form-check-label fs-sm" :for="flag.name">
                {{ flag.enabled ? 'ENABLED' : 'DISABLED' }}
              </label>
            </div>
          </li>
          <li
              v-if="!settings.featureFlags.length"
              class="list-group-item text-center text-muted"
          >
            Keine Feature‑Flags definiert.
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted }         from 'vue'
import { useToastStore }     from '@/shared/stores/toast'
import { useSettingsStore }  from '@/shared/stores/settings'

const toast    = useToastStore()
const settings = useSettingsStore()

// beim Mount immer frisch laden
onMounted(async () => {
  await settings.fetch(true)  // force=true, lädt neu vom Server
})

async function toggleMaintenance() {
  try {
    await settings.toggleMaintenance()
    toast.show('Wartungsmodus aktualisiert', 'success')
  } catch {
    toast.show('Fehler beim Umschalten', 'danger')
  }
}

async function toggleFlag(flag) {
  try {
    await settings.toggleFlag(flag.name, flag.enabled)
    toast.show(`Feature-Flag "${flag.label}" aktualisiert`, 'success')
  } catch {
    toast.show('Fehler beim Umschalten', 'danger')
  }
}
</script>

<style scoped>
.settings-wrapper {
  max-width: 800px;
  margin: 0 auto;
}

/* Keine weiteren Farb- oder Abstandsangaben: alles aus main.css */
</style>
