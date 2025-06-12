<template>
  <div class="container py-4">
    <h3 class="mb-4">🗂️ CSV-Feldzuordnung</h3>
    <form @submit.prevent="submitMapping">

      <div v-for="(field, index) in csvHeaders" :key="index" class="mb-3 row align-items-center">
        <label class="col-sm-4 col-form-label">{{ field }}</label>
        <div class="col-sm-8">
          <select class="form-select" v-model="mapping[field]">
            <option disabled value="">🧩 Ziel-Feld wählen...</option>
            <option v-for="(label, key) in targetFields" :key="key" :value="key">
              {{ label }}
            </option>
          </select>
        </div>
      </div>

      <button class="btn btn-primary mt-3" :disabled="!isValid">
        <i class="bi bi-arrow-right-circle"></i> Import starten
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

// Beispiel-Header aus CSV
const csvHeaders = ref([
  'Hersteller',
  'Typ',
  'Seriennummer',
  'IP',
  'MAC',
  'Benutzer',
  'Raum'
])

const mapping = ref({})

// Ziel-Felder in der DB
const targetFields = {
  marke: '💻 Marke',
  typ: '📦 Typ',
  seriennummer: '🔢 Seriennummer',
  cpu: '🧠 CPU',
  ram: '💾 RAM',
  hddssd: '💽 HDD/SSD',
  grafikkarte: '🎮 Grafikkarte',
  chipsatz: '🔌 Chipsatz',
  tpm: '🔐 TPM',
  bios: '🧬 BIOS',
  remote: '🌐 Remote',
  betriebssystem: '💽 Betriebssystem (ID)',
  version: '📦 OS-Version',
  abstraktionsebene: '🧱 Abstraktionsebene',
  dnsName: '🌍 DNS-Name',
  ipAdresse: '🌐 IP-Adresse',
  macAdresse: '🔗 MAC-Adresse',
  dhcp: '📡 DHCP',
  benutzer: '👤 Benutzer',
  idmKennung: '🆔 IdM-Kennung',
  betreuer: '🧑‍💼 Betreuer',
  artDerArbeit: '🛠️ Art der Arbeit',
  startdatum: '📅 Startdatum',
  abgabe: '📅 Abgabe',
  raumnummer: '🏢 Raum',
  kategorie: '🏷️ Kategorie (ID)',
  laufendeNummer: '🔢 Laufende Nummer',
  studPCs: '👨‍🎓 StudPCs',
  inventarnummer: '📦 Inventarnummer',
  fauInventarnummer: '🏷️ FAU-Nummer',
  beschaffungsjahr: '📆 Beschaffungsjahr',
  wannErsetzen: '♻️ Wann ersetzen',
  studienzuschuss: '🎓 Studienzuschuss',
  info: '🗒️ Info',
  todo: '📋 ToDo',
  ablauf: '📆 Ablauf'
}

const router = useRouter()

const isValid = computed(() => {
  return csvHeaders.value.every(h => mapping.value[h])
})

const submitMapping = () => {
  console.log('🧠 Mapping abgeschickt:', mapping.value)
  // -> Sende an Importer-Component oder API
  // router.push('/import/verarbeitung') // optional redirect
}
</script>
