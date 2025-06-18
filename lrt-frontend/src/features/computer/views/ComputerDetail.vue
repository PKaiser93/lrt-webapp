<template>
  <div class="computer-detail-wrapper container py-4">
    <div class="card shadow-sm rounded-4 border-0 p-4">
      <div v-if="isLoading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Lade...</span>
        </div>
      </div>
      <div v-else-if="error" class="alert alert-danger">
        {{ error }}
      </div>
      <div v-else-if="computer">
        <h2 class="mb-4 text-gradient">
          <i class="bi bi-pc-display me-2"></i>
          {{ computer.marke || 'Unbekannt' }}
          <span v-if="computer.typ">({{ computer.typ }})</span>
        </h2>
        <div class="table-responsive mb-4">
          <table class="table table-bordered">
            <tbody>
            <tr v-for="(label, key) in fieldLabels" :key="key">
              <td class="fw-semibold" style="width:180px">{{ label }}</td>
              <td>
                <template v-if="key === 'betriebssystem'">
                  {{ computer.betriebssystem?.name || '–' }}
                </template>
                <template v-else-if="key === 'kategorie'">
                  {{ computer.kategorie?.bezeichnung || '–' }}
                </template>
                <template v-else>
                  {{ displayValue(computer[key]) }}
                </template>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="d-flex gap-3">
          <router-link
              :to="`/computer/${computer._id}/edit`"
              class="btn btn-gradient d-flex align-items-center gap-1"
          >
            <i class="bi bi-pencil-square"></i> Bearbeiten
          </router-link>
          <router-link
              to="/computer"
              class="btn btn-outline-gradient d-flex align-items-center gap-1"
          >
            <i class="bi bi-arrow-left"></i> Zurück zur Liste
          </router-link>
        </div>
      </div>
      <div v-else class="alert alert-secondary">
        Computer nicht gefunden.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import http from '@/api/http'
import { useToastStore } from '@/stores/toast'

const route = useRoute()
const toast = useToastStore()

const computer = ref(null)
const isLoading = ref(true)
const error = ref('')

// Bezeichnung pro Feld
const fieldLabels = {
  seriennummer:        'Seriennummer',
  marke:               'Marke',
  typ:                 'Typ',
  cpu:                 'CPU',
  ram:                 'RAM',
  hddssd:              'HDD/SSD',
  grafikkarte:         'Grafikkarte',
  chipsatz:            'Chipsatz',
  tpm:                 'TPM',
  bios:                'BIOS',
  remote:              'Remote',
  betriebssystem:      'Betriebssystem',
  version:             'Version',
  abstraktionsebene:   'Abstraktionsebene',
  dnsName:             'DNS-Name',
  ipAdresse:           'IP-Adresse',
  macAdresse:          'MAC-Adresse',
  dhcp:                'DHCP',
  benutzer:            'Benutzer',
  idmKennung:          'IdM-Kennung',
  betreuer:            'Betreuer',
  artDerArbeit:        'Art der Arbeit',
  startdatum:          'Startdatum',
  abgabe:              'Abgabe',
  raumnummer:          'Raumnummer',
  kategorie:           'Kategorie',
  laufendeNummer:      'Laufende Nummer',
  studPCs:             'StudPCs',
  inventarnummer:      'Inventarnummer',
  fauInventarnummer:   'FAU-Inventarnummer',
  beschaffungsjahr:    'Beschaffungsjahr',
  wannErsetzen:        'Wann ersetzen',
  studienzuschuss:     'Studienzuschuss',
  info:                'Info',
  todo:                'ToDo',
  ablauf:              'Ablauf'
}

// Formatiert null/leer als "–"
function displayValue(val) {
  if (val === null || val === undefined || val === '') return '–'
  return val
}

onMounted(async () => {
  isLoading.value = true
  error.value     = ''
  try {
    const id = route.params.id
    const res = await http.get(`/computer/${id}`)
    computer.value = res.data
  } catch (e) {
    error.value = e.response?.data?.error || 'Fehler beim Laden'
    toast.show(error.value, 4000)
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.computer-detail-wrapper {
  max-width: 960px;
  margin: 0 auto;
}
.card {
  background: #fafdff;
}
.text-gradient {
  background: linear-gradient(90deg,#ff9360 10%,#388bfd 80%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.table-responsive {
  border-radius: 0.8rem;
  overflow: hidden;
}
.table {
  background: #fff;
}
.btn-gradient {
  background: linear-gradient(90deg,#50d285,#22a6b3 90%);
  color: #fff;
  border: none;
}
.btn-outline-gradient {
  border: 2px solid #50d285;
  color: #50d285;
  background: transparent;
}
</style>
