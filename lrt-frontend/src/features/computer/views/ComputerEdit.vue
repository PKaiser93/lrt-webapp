<template>
  <div class="container py-4">
    <div class="d-flex align-items-center mb-4 gap-2">
      <i class="bi bi-pencil-square fs-3 text-primary"></i>
      <h2 class="mb-0 fw-bold text-gradient">Computer bearbeiten</h2>
    </div>

    <!-- Infobox zu Pflichtfeldern -->
    <div class="alert alert-primary d-flex align-items-center mb-4 info-hint shadow-sm">
      <i class="bi bi-info-circle-fill me-2 fs-4"></i>
      <div>
        <strong>Hinweis:</strong><br>
        Die Felder <strong>Marke</strong>, <strong>Typ</strong>, <strong>Betriebssystem</strong>, <strong>DHCP</strong> und <strong>Kategorie</strong> sind Pflichtfelder und müssen ausgefüllt werden.
        <hr>
        <strong>Marke</strong> und <strong>Typ</strong> sind im Tab Computer<br>
        <strong>Betriebssystem</strong> im Tab Betriebssystem<br>
        <strong>DHCP</strong> im Tab Netzwerk<br>
        <strong>Kategorie</strong> im Tab Raum
      </div>
    </div>

    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-primary"></div>
    </div>
    <div v-else>
      <div v-if="error" class="alert alert-danger">{{ error }}</div>
      <form @submit.prevent="saveComputer">
        <div class="card shadow-sm rounded-4 border-0">
          <!-- TABS -->
          <ul class="nav nav-tabs modern-tabs mb-3" role="tablist">
            <li class="nav-item" v-for="tab in tabs" :key="tab.key" role="presentation">
              <button
                  class="nav-link"
                  :class="{ active: activeTab === tab.key }"
                  @click="activeTab = tab.key"
                  type="button"
                  role="tab"
              >
                <i :class="tab.icon + ' me-1'"></i>{{ tab.label }}
              </button>
            </li>
          </ul>

          <div class="tab-content p-3 pb-1">
            <!-- Geräte-Info -->
            <div v-if="activeTab === 'info'">
              <div class="row g-3">
                <div class="col-md-4"><label class="form-label">Marke</label><input v-model="form.marke" class="form-control" /></div>
                <div class="col-md-4"><label class="form-label">Typ</label><input v-model="form.typ" class="form-control" /></div>
                <div class="col-md-4"><label class="form-label">Seriennummer</label><input v-model="form.seriennummer" class="form-control" /></div>
                <div class="col-md-4"><label class="form-label">DNS Name</label><input v-model="form.dnsName" class="form-control" /></div>
                <div class="col-md-4"><label class="form-label">RAM (GB)</label><input v-model.number="form.ram" type="number" min="0" class="form-control" /></div>
                <div class="col-md-4"><label class="form-label">CPU</label><input v-model="form.cpu" class="form-control" /></div>
                <div class="col-md-4"><label class="form-label">Grafikkarte</label><input v-model="form.grafikkarte" class="form-control" /></div>
                <div class="col-md-4"><label class="form-label">Chipsatz</label><input v-model="form.chipsatz" class="form-control" /></div>
              </div>
            </div>
            <!-- Betriebssystem -->
            <div v-else-if="activeTab === 'os'">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">Betriebssystem</label>
                  <select v-model="form.betriebssystem" class="form-select">
                    <option value="">—</option>
                    <option v-for="os in osList" :key="os._id" :value="os._id">{{ os.name }}</option>
                  </select>
                </div>
                <div class="col-md-6"><label class="form-label">Version</label><input v-model="form.version" class="form-control" /></div>
                <div class="col-md-6"><label class="form-label">Abstraktionsebene</label><input v-model="form.abstraktionsebene" class="form-control" /></div>
              </div>
            </div>
            <!-- Netzwerk -->
            <div v-else-if="activeTab === 'net'">
              <div class="row g-3">
                <div class="col-md-4"><label class="form-label">IP-Adresse</label><input v-model="form.ipAdresse" class="form-control" /></div>
                <div class="col-md-4"><label class="form-label">MAC-Adresse</label><input v-model="form.macAdresse" class="form-control" /></div>
                <div class="col-md-4">
                  <label class="form-label">DHCP</label>
                  <select v-model="form.dhcp" class="form-select">
                    <option :value="true">Ja</option>
                    <option :value="false">Nein</option>
                  </select>
                </div>
                <div class="col-md-4"><label class="form-label">Remote</label><input v-model="form.remote" class="form-control" /></div>
                <div class="col-md-4"><label class="form-label">Raumnummer</label><input v-model="form.raumnummer" class="form-control" /></div>
              </div>
            </div>
            <!-- Benutzer -->
            <div v-else-if="activeTab === 'user'">
              <div class="row g-3">
                <div class="col-md-4"><label class="form-label">Benutzer</label><input v-model="form.benutzer" class="form-control" /></div>
                <div class="col-md-4"><label class="form-label">Betreuer</label><input v-model="form.betreuer" class="form-control" /></div>
                <div class="col-md-4"><label class="form-label">Art der Arbeit</label><input v-model="form.artDerArbeit" class="form-control" /></div>
              </div>
            </div>
            <!-- Beschaffung -->
            <div v-else-if="activeTab === 'proc'">
              <div class="row g-3">
                <div class="col-md-4"><label class="form-label">Beschaffungsjahr</label><input v-model.number="form.beschaffungsjahr" type="number" class="form-control" /></div>
                <div class="col-md-4"><label class="form-label">Inventarnummer</label><input v-model="form.inventarnummer" class="form-control" /></div>
                <div class="col-md-4"><label class="form-label">Laufende Nummer</label><input v-model.number="form.laufendeNummer" type="number" class="form-control" /></div>
                <div class="col-md-4"><label class="form-label">StudPCs</label><input v-model.number="form.studPCs" type="number" class="form-control" /></div>
                <div class="col-md-4"><label class="form-label">Studienzuschuss</label><input v-model.number="form.studienzuschuss" type="number" class="form-control" /></div>
                <div class="col-md-4"><label class="form-label">FAU Inventarnummer</label><input v-model="form.fauInventarnummer" class="form-control" /></div>
              </div>
            </div>
            <!-- Kategorie -->
            <div v-else-if="activeTab === 'kat'">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">Kategorie</label>
                  <select v-model="form.kategorie" class="form-select">
                    <option value="">—</option>
                    <option v-for="k in kategorieList" :key="k._id" :value="k._id">{{ k.bezeichnung }}</option>
                  </select>
                </div>
              </div>
            </div>
            <!-- Sonstiges -->
            <div v-else-if="activeTab === 'other'">
              <div class="row g-3">
                <div class="col-md-6"><label class="form-label">BIOS</label><input v-model="form.bios" class="form-control" /></div>
                <div class="col-md-6"><label class="form-label">TPM</label><input v-model="form.tpm" class="form-control" /></div>
                <div class="col-md-6"><label class="form-label">Info</label><input v-model="form.info" class="form-control" /></div>
                <div class="col-md-6"><label class="form-label">ToDo</label><input v-model="form.todo" class="form-control" /></div>
                <div class="col-md-6"><label class="form-label">Ablauf</label><input v-model="form.ablauf" class="form-control" /></div>
              </div>
            </div>
          </div>
          <!-- /Tab-Content -->

          <div class="text-end px-4 pb-4">
            <button class="btn btn-success shadow-sm rounded-pill px-4" type="submit" :disabled="saving">
              <span v-if="saving"><i class="bi bi-arrow-repeat me-1"></i>Speichern…</span>
              <span v-else><i class="bi bi-save me-1"></i>Speichern</span>
            </button>
            <router-link class="btn btn-outline-secondary rounded-pill px-4 ms-2" to="/computer">
              <i class="bi bi-x-lg me-1"></i>Abbrechen
            </router-link>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import http from '@/api/http'
import { useToastStore } from '@/stores/toast'

// Pinia Store für Toast holen
const toast = useToastStore()

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const saving = ref(false)
const error = ref('')

const kategorieList = ref([])
const osList        = ref([])

const form = ref({
  marke: '', typ: '', seriennummer: '', dnsName: '', ram: null, cpu: '', grafikkarte: '', chipsatz: '',
  betriebssystem: '', version: '', abstraktionsebene: '',
  ipAdresse: '', macAdresse: '', dhcp: false, remote: '', raumnummer: '',
  benutzer: '', betreuer: '', artDerArbeit: '',
  beschaffungsjahr: null, inventarnummer: '', laufendeNummer: null, studPCs: null, studienzuschuss: null, fauInventarnummer: '',
  kategorie: '',
  bios: '', tpm: '', info: '', todo: '', ablauf: ''
})

const tabs = [
  { key: 'info',  label: 'Geräte-Info',     icon: 'bi bi-cpu' },
  { key: 'os',    label: 'Betriebssystem',   icon: 'bi bi-windows' },
  { key: 'net',   label: 'Netzwerk',         icon: 'bi bi-diagram-3' },
  { key: 'user',  label: 'Benutzer',         icon: 'bi bi-person-circle' },
  { key: 'proc',  label: 'Beschaffung',      icon: 'bi bi-bag' },
  { key: 'kat',   label: 'Kategorie',        icon: 'bi bi-tag' },
  { key: 'other', label: 'Sonstiges',        icon: 'bi bi-info-circle' },
]

const activeTab = ref('info')

onMounted(async () => {
  loading.value = true
  try {
    const [compRes, katRes, osRes] = await Promise.all([
      http.get(`/computer/${route.params.id}`),
      http.get('/kategorie'),
      http.get('/betriebssystem')
    ])
    Object.assign(form.value, compRes.data)
    kategorieList.value = katRes.data
    osList.value        = osRes.data

    // IDs extrahieren falls populated
    if (typeof form.value.betriebssystem === 'object' && form.value.betriebssystem)
      form.value.betriebssystem = form.value.betriebssystem._id
    if (typeof form.value.kategorie === 'object' && form.value.kategorie)
      form.value.kategorie = form.value.kategorie._id

  } catch (err) {
    error.value = err?.response?.data?.error || 'Fehler beim Laden.'
  } finally {
    loading.value = false
  }
})

async function saveComputer() {
  saving.value = true
  error.value  = ''
  try {
    await http.patch(`/computer/${route.params.id}`, form.value)
    toast.show('Änderungen gespeichert', 'success')
    router.push('/computer')
  } catch (err) {
    error.value = err?.response?.data?.error || 'Speichern fehlgeschlagen.'
    toast.show(error.value, 'danger')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.text-gradient {
  background: linear-gradient(90deg, #ff9360 10%, #388bfd 80%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.card {
  border-radius: 1.5rem;
}
.modern-tabs .nav-link {
  font-weight: 600;
  font-size: 1.04rem;
  border: none;
  color: #4a5876;
  background: #f6fafd;
  border-radius: 1rem 1rem 0 0;
  margin-right: 2px;
  transition: all .14s;
}
.modern-tabs .nav-link.active,
.modern-tabs .nav-link:focus {
  background: #eaf2ff;
  color: #388bfd;
  border-bottom: 2px solid #388bfd;
}
.tab-content {
  background: #fff;
  border-radius: 0 0 1.5rem 1.5rem;
  box-shadow: 0 3px 16px 0 #0001;
  margin-top: -4px;
}
.info-hint {
  border-radius: 1rem;
}
.btn-success {
  background: linear-gradient(90deg, #50d285, #22a6b3 90%);
  border: none;
}
.btn-success:active,
.btn-success:focus {
  background: #22a6b3;
}
.btn-success .bi {
  font-size: 1.12em;
}
</style>
