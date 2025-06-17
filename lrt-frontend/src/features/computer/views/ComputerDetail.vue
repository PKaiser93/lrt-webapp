<template>
  <div class="container">
    <div class="card">
      <div v-if="isLoading" class="mb-3">Lade Computer-Daten...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else-if="computer">
        <h2>
          Computer-Detail: {{ computer.marke || 'Unbekannt' }} <span v-if="computer.typ">({{ computer.typ }})</span>
        </h2>
        <div class="table-container">
          <table>
            <tbody>
            <tr v-for="(value, key) in detailFields" :key="key">
              <td class="label">{{ fieldLabels[key] || key }}</td>
              <td>
                <template v-if="key === 'betriebssystem'">
                  {{ computer.betriebssystem?.name || '-' }}
                </template>
                <template v-else-if="key === 'kategorie'">
                  {{ computer.kategorie?.name || '-' }}
                </template>
                <template v-else>
                  {{ value !== undefined && value !== '' ? value : '-' }}
                </template>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="actions">
          <router-link
              :to="`/computer/${computer._id}/edit`"
              class="button primary"
          >
            Bearbeiten
          </router-link>
          <router-link
              to="/computer"
              class="button"
          >
            Zurück zur Liste
          </router-link>
        </div>
      </div>
      <div v-else class="info">Computer nicht gefunden.</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const computer = ref(null)
const isLoading = ref(true)
const error = ref('')

const fieldLabels = {
  seriennummer: 'Seriennummer',
  marke: 'Marke',
  typ: 'Typ',
  cpu: 'CPU',
  ram: 'RAM',
  hddssd: 'HDD/SSD',
  grafikkarte: 'Grafikkarte',
  chipsatz: 'Chipsatz',
  tpm: 'TPM',
  bios: 'BIOS',
  remote: 'Remote',
  betriebssystem: 'Betriebssystem',
  version: 'Version',
  abstraktionsebene: 'Abstraktionsebene',
  dnsName: 'DNS-Name',
  ipAdresse: 'IP-Adresse',
  macAdresse: 'MAC-Adresse',
  dhcp: 'DHCP',
  benutzer: 'Benutzer',
  idmKennung: 'IdM-Kennung',
  betreuer: 'Betreuer',
  artDerArbeit: 'Art der Arbeit',
  startdatum: 'Startdatum',
  abgabe: 'Abgabe',
  raumnummer: 'Raumnummer',
  kategorie: 'Kategorie',
  laufendeNummer: 'Laufende Nummer',
  studPCs: 'StudPCs',
  inventarnummer: 'Inventarnummer',
  fauInventarnummer: 'FAU-Inventarnummer',
  beschaffungsjahr: 'Beschaffungsjahr',
  wannErsetzen: 'Wann ersetzen',
  studienzuschuss: 'Studienzuschuss',
  info: 'Info',
  todo: 'ToDo',
  ablauf: 'Ablauf',
}

const fields = [
  'seriennummer','marke','typ','cpu','ram','hddssd','grafikkarte','chipsatz','tpm','bios','remote',
  'betriebssystem','version','abstraktionsebene','dnsName','ipAdresse','macAdresse','dhcp','benutzer','idmKennung',
  'betreuer','artDerArbeit','startdatum','abgabe','raumnummer','kategorie','laufendeNummer','studPCs','inventarnummer',
  'fauInventarnummer','beschaffungsjahr','wannErsetzen','studienzuschuss','info','todo','ablauf'
]

const detailFields = computed(() => {
  if (!computer.value) return {}
  const filtered = {}
  fields.forEach(key => {
    filtered[key] = computer.value[key]
  })
  return filtered
})

onMounted(async () => {
  isLoading.value = true
  try {
    const id = route.params.id
    const res = await fetch(`/api/computer/${id}`)
    if (!res.ok) throw new Error('Computer nicht gefunden')
    computer.value = await res.json()
  } catch (e) {
    error.value = e.message
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px 10px;
}
.card {
  background: #fff;
  padding: 24px 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px #0001;
}
h2 {
  margin-bottom: 18px;
}
.table-container {
  overflow-x: auto;
  margin-bottom: 18px;
}
table {
  width: 100%;
  border-collapse: collapse;
  background: #f8f8f8;
}
.label {
  font-weight: 600;
  min-width: 150px;
  background: #eee;
  border-right: 1px solid #ddd;
}
td {
  border: 1px solid #ddd;
  padding: 5px 7px;
  vertical-align: top;
}
.actions {
  margin-top: 18px;
  display: flex;
  gap: 12px;
}
.button {
  padding: 7px 18px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  background: #e0e0e0;
  color: #333;
  text-decoration: none;
}
.button.primary {
  background: #1976d2;
  color: #fff;
}
.error {
  color: #c00;
}
.info {
  color: #666;
}
</style>
