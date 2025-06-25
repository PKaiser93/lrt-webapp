<template>
  <div class="container py-4">
    <div class="d-flex align-items-center mb-4 gap-2">
      <i class="bi bi-pencil-square fs-3 text-primary"></i>
      <h2 class="mb-0 fw-bold text-gradient">Computer bearbeiten</h2>
    </div>

    <!-- Infobox zu Pflichtfeldern -->
    <div class="info-hint">
      <i class="bi bi-info-circle-fill"></i>
      <div>
        <strong>Hinweis:</strong><br>
        Die Felder <strong>Marke</strong>, <strong>Typ</strong>, <strong>Betriebssystem</strong>, <strong>DHCP</strong> und <strong>Kategorie</strong> sind Pflichtfelder und müssen ausgefüllt werden.
        <hr>
        <strong>Marke</strong> und <strong>Typ</strong> sind im Tab Computer<br>
        <strong>Betriebssystem</strong> im Tab Betriebssystem<br>
        <strong>DHCP</strong> im Tab Netzwerk<br>
        <strong>Kategorie</strong> im Tab Raum
        <hr>
        Die <strong>Seriennummer</strong> ist <strong><i>Unique</i></strong>. Sollte keine Seriennummer vorliegen, bitte einen Platzhalter eintragen!
      </div>
    </div>

    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-primary"></div>
    </div>
    <div v-else>
      <div v-if="error" class="alert alert-danger">{{ error }}</div>
      <form @submit.prevent="saveComputer">
        <div class="card">
          <!-- TABS -->
          <ul class="nav modern-tabs" role="tablist">
            <li class="nav-item" v-for="tab in tabs" :key="tab.key">
              <button
                  class="nav-link"
                  :class="{ active: activeTab === tab.key }"
                  @click="activeTab = tab.key"
                  type="button"
              >
                <i :class="tab.icon + ' me-1'"></i> {{ tab.label }}
              </button>
            </li>
          </ul>

          <div class="tab-content">
            <!-- Geräte‑Info -->
            <div v-if="activeTab === 'info'" class="row g-3">
              <div>
                <label class="form-label">Marke *</label>
                <input v-model="form.marke" required class="form-control" />
              </div>
              <div>
                <label class="form-label">Typ *</label>
                <input v-model="form.typ" required class="form-control" />
              </div>
              <div>
                <label class="form-label">Seriennummer *</label>
                <input v-model="form.seriennummer" required class="form-control" />
              </div>
              <div>
                <label class="form-label">DNS Name</label>
                <input v-model="form.dnsName" class="form-control" />
              </div>
              <div>
                <label class="form-label">RAM (GB)</label>
                <input v-model.number="form.ram" type="number" min="0" class="form-control" />
              </div>
              <div>
                <label class="form-label">CPU</label>
                <input v-model="form.cpu" class="form-control" />
              </div>
              <div>
                <label class="form-label">Grafikkarte</label>
                <input v-model="form.grafikkarte" class="form-control" />
              </div>
              <div>
                <label class="form-label">Chipsatz</label>
                <input v-model="form.chipsatz" class="form-control" />
              </div>
              <div>
                <label class="form-label">Status</label>
                <select v-model="form.status" required class="form-select">
                  <option value="in_betrieb">In Betrieb</option>
                  <option value="bald_ersetzen">Bald ersetzen</option>
                  <option value="ausser_betrieb">Außer Betrieb</option>
                  <option value="auf_lager">Auf Lager</option>
                  <option value="unbekannt">Unbekannt</option>
                </select>
              </div>
            </div>

            <!-- Betriebssystem -->
            <div v-else-if="activeTab === 'os'" class="row g-3">
              <div>
                <label class="form-label">Betriebssystem *</label>
                <select v-model="form.betriebssystem" required class="form-select">
                  <option value="">—</option>
                  <option v-for="os in osList" :key="os._id" :value="os._id">{{ os.name }}</option>
                </select>
              </div>
              <div>
                <label class="form-label">Version</label>
                <input v-model="form.version" class="form-control" />
              </div>
              <div>
                <label class="form-label">Abstraktionsebene</label>
                <input v-model="form.abstraktionsebene" class="form-control" />
              </div>
              <div>
                <label class="form-label">Kernel</label>
                <input v-model="form.kernel" class="form-control" />
              </div>
            </div>

            <!-- Netzwerk -->
            <div v-else-if="activeTab === 'net'" class="row g-3">
              <div>
                <label class="form-label">IP-Adresse</label>
                <input v-model="form.ipAdresse" class="form-control" />
              </div>
              <div>
                <label class="form-label">MAC-Adresse</label>
                <input v-model="form.macAdresse" class="form-control" />
              </div>
              <div>
                <label class="form-label">DHCP *</label>
                <select v-model="form.dhcp" required class="form-select">
                  <option :value="true">Ja</option>
                  <option :value="false">Nein</option>
                </select>
              </div>
              <div>
                <label class="form-label">Remote</label>
                <input v-model="form.remote" class="form-control" />
              </div>
              <div>
                <label class="form-label">Raumnummer *</label>
                <input v-model="form.raumnummer" required class="form-control" />
              </div>
            </div>

            <!-- Benutzer -->
            <div v-else-if="activeTab === 'user'" class="row g-3">
              <div>
                <label class="form-label">Benutzer</label>
                <input v-model="form.benutzer" class="form-control" />
              </div>
              <div>
                <label class="form-label">Betreuer</label>
                <input v-model="form.betreuer" class="form-control" />
              </div>
              <div>
                <label class="form-label">Art der Arbeit</label>
                <input v-model="form.artDerArbeit" class="form-control" />
              </div>
              <div>
                <label class="form-label">Startdatum</label>
                <input type="date" v-model="form.startdatum" class="form-control" />
              </div>
              <div>
                <label class="form-label">Abgabe/Vortrag</label>
                <input type="date" v-model="form.abgabe" class="form-control" />
              </div>
            </div>

            <!-- Beschaffung -->
            <div v-else-if="activeTab === 'proc'" class="row g-3">
              <div>
                <label class="form-label">Beschaffungsjahr</label>
                <input v-model.number="form.beschaffungsjahr" type="number" class="form-control" />
              </div>
              <div>
                <label class="form-label">Inventarnummer</label>
                <input v-model="form.inventarnummer" class="form-control" />
              </div>
              <div>
                <label class="form-label">Laufende Nummer</label>
                <input v-model.number="form.laufendeNummer" type="number" class="form-control" />
              </div>
              <div>
                <label class="form-label">StudPCs</label>
                <input v-model.number="form.studPCs" type="number" class="form-control" />
              </div>
              <div>
                <label class="form-label">Studienzuschuss</label>
                <input v-model.number="form.studienzuschuss" type="number" class="form-control" />
              </div>
              <div>
                <label class="form-label">FAU Inventarnummer</label>
                <input v-model="form.fauInventarnummer" class="form-control" />
              </div>
            </div>

            <!-- Kategorie -->
            <div v-else-if="activeTab === 'kat'" class="row g-3">
              <div>
                <label class="form-label">Kategorie *</label>
                <select v-model="form.kategorie" required class="form-select">
                  <option value="">—</option>
                  <option v-for="k in kategorieList" :key="k._id" :value="k._id">{{ k.bezeichnung }}</option>
                </select>
              </div>
            </div>

            <!-- Sonstiges -->
            <div v-else-if="activeTab === 'other'" class="row g-3">
              <div>
                <label class="form-label">BIOS</label>
                <input v-model="form.bios" class="form-control" />
              </div>
              <div>
                <label class="form-label">TPM</label>
                <input v-model="form.tpm" class="form-control" />
              </div>
              <div>
                <label class="form-label">Info</label>
                <input v-model="form.info" class="form-control" />
              </div>
              <div>
                <label class="form-label">ToDo</label>
                <input v-model="form.todo" class="form-control" />
              </div>
              <div>
                <label class="form-label">Ablauf</label>
                <input v-model="form.ablauf" class="form-control" />
              </div>
            </div>
          </div>

          <div class="text-end px-4 pb-4">
            <button class="btn btn-gradient" type="submit" :disabled="saving">
              <i class="bi bi-save me-1"></i>
              {{ saving ? 'Speichern …' : 'Speichern' }}
            </button>
            <router-link class="btn btn-outline-secondary ms-3" to="/computer">
              <i class="bi bi-x-lg me-1"></i> Abbrechen
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
import http from '@/shared/api/http'
import { useToastStore } from '@/shared/stores/toast'

const toast = useToastStore()
const route = useRoute()
const router = useRouter()

const loading = ref(true)
const saving = ref(false)
const error   = ref('')

const kategorieList = ref([])
const osList        = ref([])

const form = ref({
  marke: '', typ: '', seriennummer: '', dnsName: '', ram: null, cpu: '', grafikkarte: '', chipsatz: '', status: '',
  betriebssystem: '', version: '', abstraktionsebene: '', kernel: '',
  ipAdresse: '', macAdresse: '', dhcp: false, remote: '', raumnummer: '',
  benutzer: '', betreuer: '', artDerArbeit: '', startdatum: '', abgabe: '',
  beschaffungsjahr: null, inventarnummer: '', laufendeNummer: null, studPCs: null, studienzuschuss: null, fauInventarnummer: '',
  kategorie: '', bios: '', tpm: '', info: '', todo: '', ablauf: ''
})

const tabs = [
  { key: 'info',  label: 'Geräte‑Info',     icon: 'bi bi-cpu' },
  { key: 'os',    label: 'Betriebssystem',   icon: 'bi bi-windows' },
  { key: 'net',   label: 'Netzwerk',         icon: 'bi bi-diagram-3' },
  { key: 'user',  label: 'Benutzer',         icon: 'bi bi-person-circle' },
  { key: 'proc',  label: 'Beschaffung',      icon: 'bi bi-bag' },
  { key: 'kat',   label: 'Kategorie',        icon: 'bi bi-tag' },
  { key: 'other', label: 'Sonstiges',        icon: 'bi bi-info-circle' }
]

const activeTab = ref('info')

onMounted(async () => {
  try {
    const [compRes, katRes, osRes] = await Promise.all([
      http.get(`/computer/${route.params.id}`),
      http.get('/kategorie'),
      http.get('/betriebssystem')
    ])

    const comp = compRes.data
    // Kopiere alle anderen Felder …
    Object.assign(form.value, comp)

    // … und überschreibe betriebssystem & kategorie mit ihren IDs
    form.value.betriebssystem = comp.betriebssystem?._id || ''
    form.value.kategorie      = comp.kategorie?._id      || ''

    // Datum-Felder wie gehabt
    form.value.startdatum = comp.startdatum
        ? new Date(comp.startdatum).toISOString().substr(0, 10)
        : ''
    form.value.abgabe = comp.abgabe
        ? new Date(comp.abgabe).toISOString().substr(0, 10)
        : ''

    kategorieList.value = katRes.data
    osList.value        = osRes.data
  } catch (err) {
    toast.show(err.response?.data?.error || 'Fehler beim Laden.', 'danger')
  } finally {
    loading.value = false
  }
})

async function saveComputer() {
  saving.value = true
  error.value  = ''
  // Strings in Date-Objekte umwandeln
  const payload = {
    ...form.value,
    startdatum: form.value.startdatum ? new Date(form.value.startdatum) : null,
    abgabe:     form.value.abgabe     ? new Date(form.value.abgabe)     : null
  }
  try {
    await http.patch(`/computer/${route.params.id}`, payload)
    toast.show('Änderungen gespeichert', 'success')
    router.push('/computer')
  } catch (err) {
    error.value = err.response?.data?.error || 'Speichern fehlgeschlagen.'
    toast.show(error.value, 'danger')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
:root {
  --clr-primary-start: #4f93ff;
  --clr-primary-end:   #3ecf8e;
  --clr-bg-light:      #f9fafb;
  --clr-card-bg:       #ffffff;
  --clr-text:          #2e3a59;
  --clr-border:        #e1e8f0;
  --shadow-light:      0 4px 16px rgba(0,0,0,0.04);
}

.container.py-4 {
  max-width: 960px;
  margin: 0 auto;
  background: var(--clr-bg-light);
  border-radius: 1rem;
}

.text-gradient {
  background: linear-gradient(135deg, var(--clr-primary-start), var(--clr-primary-end));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 2rem;
  margin-bottom: 1.5rem;
}

.info-hint {
  background: #eef5ff;
  border-left: 4px solid var(--clr-primary-start);
  padding: 1rem 1.5rem;
  border-radius: 0.75rem;
  margin-bottom: 1.5rem;
  display: flex;
  gap: 0.75rem;
}

.info-hint i {
  font-size: 1.5rem;
  color: var(--clr-primary-start);
}

.card {
  background: var(--clr-card-bg);
  box-shadow: var(--shadow-light);
  border: none;
  border-radius: 1rem;
  margin-bottom: 2rem;
}

.modern-tabs {
  display: flex;
  background: var(--clr-card-bg);
  border-bottom: 1px solid var(--clr-border);
}

.modern-tabs .nav-link {
  flex: 1;
  text-align: center;
  padding: 0.75rem;
  color: #6c7a93;
  font-weight: 500;
  border: none;
  background: transparent;
  border-bottom: 3px solid transparent;
  transition: all 0.2s;
}

.modern-tabs .nav-link.active {
  color: var(--clr-primary-end);
  border-bottom-color: var(--clr-primary-end);
  background: var(--clr-bg-light);
}

.tab-content {
  padding: 1.5rem;
}

.row.g-3 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

.form-label {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #43516c;
}

.form-control,
.form-select {
  width: 100%;
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--clr-border);
  border-radius: 0.5rem;
}

.text-end.px-4.pb-4 {
  padding-top: 1rem;
  padding-bottom: 2rem;
}

.btn-gradient {
  background: linear-gradient(90deg, #38d39f 0%, #2bbd95 100%);
  color: #fff !important;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  transition: background 0.2s, transform 0.1s;
}

.btn-gradient:hover {
  background: linear-gradient(90deg, #2bbd95 0%, #21a689 100%);
  transform: translateY(-2px);
}

.btn-outline-secondary {
  border: 1px solid var(--clr-border);
  color: #6c7a93;
  background: transparent;
  border-radius: 2rem;
  padding: 0.75rem 2rem;
}

.text-center.my-5 .spinner-border {
  width: 3rem;
  height: 3rem;
  border-width: 0.3rem;
}

@media (max-width: 768px) {
  .modern-tabs .nav-link {
    font-size: 0.95rem;
    padding: 0.5rem;
  }
}
</style>
