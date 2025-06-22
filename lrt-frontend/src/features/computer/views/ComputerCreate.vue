<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0 fw-bold text-gradient">
        <i class="bi bi-pc-display-horizontal me-2"></i>Neuen Computer anlegen
      </h2>
    </div>

    <!-- Infobox zu Pflichtfeldern -->
    <div class="alert alert-primary d-flex align-items-center mb-4 info-hint shadow-sm">
      <i class="bi bi-info-circle-fill me-2 fs-4"></i>
      <div>
        <strong>Hinweis:</strong><br>
        Die Felder <strong>Marke</strong>, <strong>Typ</strong>, <strong>Betriebssystem</strong>, <strong>DHCP</strong> und <strong>Kategorie</strong> sind Pflichtfelder und müssen ausgefüllt werden.
        <hr>
        <strong>Marke</strong> und <strong>Typ</strong> sind im Tab Computer
        <br><strong>Betriebssystem</strong> im Tab Betriebssystem
        <br><strong>DHCP</strong> im Tab Netzwerk
        <br><strong>Kategorie</strong> im Tab Raum
      </div>
    </div>

    <form @submit.prevent="submit" class="needs-validation" novalidate>
      <div class="card shadow-sm rounded-4 border-0">
        <!-- Tabs -->
        <ul class="nav nav-tabs px-3 pt-3 mb-2" role="tablist">
          <li class="nav-item" v-for="(tab, i) in tabs" :key="tab.key">
            <a class="nav-link"
               :class="{ active: activeTab === tab.key }"
               @click.prevent="activeTab = tab.key"
               href="#"
               role="tab">
              <i :class="tab.icon + ' me-1'"></i>{{ tab.label }}
            </a>
          </li>
        </ul>
        <div class="card-body">
          <!-- Tab Contents -->
          <div v-show="activeTab === 'hardware'">
            <div class="row g-3">
              <Field label="Marke" v-model="computer.marke" />
              <Field label="Typ" v-model="computer.typ" />
              <Field label="Seriennummer" v-model="computer.seriennummer" />
              <Field label="CPU" v-model="computer.cpu" />
              <Field label="RAM" v-model="computer.ram" />
              <Field label="HDD/SSD" v-model="computer.hddssd" />
              <Field label="Grafikkarte" v-model="computer.grafikkarte" />
              <Field label="Chipsatz" v-model="computer.chipsatz" />
              <Field label="TPM" v-model="computer.tpm" />
              <Field label="BIOS" v-model="computer.bios" />
              <Field label="Remote" v-model="computer.remote" />
            </div>
          </div>
          <div v-show="activeTab === 'os'">
            <div class="row g-3">
              <FormSelect label="Betriebssystem" v-model="computer.betriebssystem" :items="osList" />
              <Field label="Version" v-model="computer.version" />
              <Field label="Abstraktionsebene" v-model="computer.abstraktionsebene" />
            </div>
          </div>
          <div v-show="activeTab === 'network'">
            <div class="row g-3">
              <Field label="DNS-Name" v-model="computer.dnsName" />
              <Field label="IP-Adresse" v-model="computer.ipAdresse" />
              <Field label="MAC-Adresse" v-model="computer.macAdresse" />
              <FormSelect label="DHCP" v-model="computer.dhcp" :items="[{ _id: 'ja', name: 'ja' }, { _id: 'nein', name: 'nein' }]" />
            </div>
          </div>
          <div v-show="activeTab === 'user'">
            <div class="row g-3">
              <Field label="Benutzer" v-model="computer.benutzer" />
              <Field label="IdM-Kennung" v-model="computer.idmKennung" />
              <Field label="Betreuer" v-model="computer.betreuer" />
              <Field label="Art der Arbeit" v-model="computer.artDerArbeit" />
              <FormDate label="Startdatum" v-model="computer.startdatum" />
              <FormDate label="Abgabe" v-model="computer.abgabe" />
            </div>
          </div>
          <div v-show="activeTab === 'room'">
            <div class="row g-3">
              <Field label="Raumnummer" v-model="computer.raumnummer" />
              <FormSelect label="Kategorie" v-model="computer.kategorie" :items="kategorieList" />
              <Field label="Laufende Nummer" type="number" v-model="computer.laufendeNummer" />
              <Field label="StudPCs" type="number" v-model="computer.studPCs" />
            </div>
          </div>
          <div v-show="activeTab === 'procurement'">
            <div class="row g-3">
              <Field label="Inventarnummer" type="number" v-model="computer.inventarnummer" />
              <Field label="FAU-Inventarnummer" v-model="computer.fauInventarnummer" />
              <Field label="Beschaffungsjahr" type="number" v-model="computer.beschaffungsjahr" />
              <Field label="Wann ersetzen" v-model="computer.wannErsetzen" />
              <Field label="Studienzuschuss (Jahr)" type="number" v-model="computer.studienzuschuss" />
            </div>
          </div>
          <div v-show="activeTab === 'misc'">
            <div class="row g-3">
              <Field label="Info" v-model="computer.info" />
              <Field label="ToDo" v-model="computer.todo" />
              <Field label="Ablauf" v-model="computer.ablauf" />
            </div>
          </div>
        </div>
        <div class="text-end px-4 pb-4">
          <button class="btn btn-success shadow-sm rounded-pill">
            <i class="bi bi-save me-1"></i> Speichern
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import http from '@/api/http'
import { useRouter } from 'vue-router'
import { useToastStore } from '@/stores/toast'
import Field from '@/components/FormField.vue'
import FormSelect from '@/components/FormSelect.vue'
import FormDate from '@/components/FormDate.vue'

const toast = useToastStore()

const computer = ref({
  marke: '', typ: '', seriennummer: '', cpu: '', ram: '', hddssd: '', grafikkarte: '', chipsatz: '',
  tpm: '', bios: '', remote: '', betriebssystem: '', version: '', abstraktionsebene: '',
  dnsName: '', ipAdresse: '', macAdresse: '', dhcp: '', benutzer: '', idmKennung: '', betreuer: '',
  artDerArbeit: '', startdatum: null, abgabe: null, raumnummer: '', kategorie: '', laufendeNummer: null,
  studPCs: null, inventarnummer: null, fauInventarnummer: '', beschaffungsjahr: null,
  wannErsetzen: '', studienzuschuss: null, info: '', todo: '', ablauf: ''
})

const osList = ref([])
const kategorieList = ref([])
const router = useRouter()
const activeTab = ref('hardware')

const tabs = [
  { key: 'hardware', label: 'Computer', icon: 'bi bi-cpu' },
  { key: 'os', label: 'Betriebssystem', icon: 'bi bi-windows' },
  { key: 'network', label: 'Netzwerk', icon: 'bi bi-diagram-3' },
  { key: 'user', label: 'Benutzer', icon: 'bi bi-person-circle' },
  { key: 'room', label: 'Raum', icon: 'bi bi-building' },
  { key: 'procurement', label: 'Beschaffung', icon: 'bi bi-bag' },
  { key: 'misc', label: 'Sonstiges', icon: 'bi bi-info-circle' }
]

onMounted(async () => {
  try {
    const osRes = await http.get('/betriebssystem')
    const katRes = await http.get('/kategorie')
    osList.value = osRes.data
    kategorieList.value = katRes.data.map(k => ({
      _id: k._id,
      name: k.bezeichnung
    }))
  } catch (err) {
    toast.show('Fehler beim Laden von Optionen', 'danger')
    // Detaillierte Fehlerausgabe (optional)
    // console.error('[ERROR] Fehler beim Laden von Optionen:', err)
  }
})

const submit = async () => {
  if (!computer.value.typ) {
    toast.show('Bitte Typ angeben!', 'danger')
    return
  }
  // 🟢 Fix für dhcp
  let toSave = { ...computer.value }
  if (toSave.dhcp === 'ja') toSave.dhcp = true
  if (toSave.dhcp === 'nein') toSave.dhcp = false

  try {
    await http.post('/computer', toSave)
    toast.show('✅ Computer erfolgreich gespeichert', 'success')
    router.push('/computer')
  } catch (err) {
    toast.show('❌ Fehler beim Speichern', 'danger')
    // Detaillierte Fehlerausgabe (optional)
    // if (err.response) { ... }
  }
}
</script>

<style scoped>
.text-gradient {
  background: linear-gradient(90deg, #ff9360 10%, #388bfd 80%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
}
.card {
  border-radius: 1.5rem;
}
.nav-tabs .nav-link {
  border: none;
  background: none;
  color: #388bfd;
  font-weight: 500;
  padding: 0.8em 1.4em 0.7em 1.4em;
  font-size: 1.06em;
  border-radius: 0.8em 0.8em 0 0;
  transition: background 0.18s;
}
.nav-tabs .nav-link.active,
.nav-tabs .nav-link:hover {
  background: #f3f8fe;
  color: #1d2939;
  border-bottom: 2px solid #388bfd;
}
.card-body {
  padding-top: 1.8rem;
}
.btn-success {
  background: linear-gradient(90deg,#50d285,#22a6b3 90%);
  border: none;
}
.btn-success:active, .btn-success:focus {
  background: #22a6b3;
}
.btn-success .bi {
  font-size: 1.16em;
}
</style>
