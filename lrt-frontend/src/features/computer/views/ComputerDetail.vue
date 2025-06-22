<template>
  <div class="computer-detail-wrapper container py-4">
    <div class="card shadow-sm rounded-4 border-0 p-4">
      <!-- Lade-Spinner -->
      <div v-if="isLoading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Lade...</span>
        </div>
      </div>
      <!-- Fehleranzeige -->
      <div v-else-if="error" class="alert alert-danger">
        <i class="bi bi-exclamation-triangle me-2"></i>{{ error }}
      </div>
      <!-- Computer-Daten -->
      <div v-else-if="computer">
        <!-- Kopfzeile mit Typ, QR und Status -->
        <div class="d-flex align-items-center gap-3 mb-4 flex-wrap">
          <i class="bi bi-pc-display fs-2 text-primary"></i>
          <h2 class="mb-0 text-gradient fw-bold">
            {{ computer.marke || 'Unbekannt' }}
            <span v-if="computer.typ" class="badge bg-light text-secondary ms-2 fs-6">{{ computer.typ }}</span>
          </h2>
          <div v-if="computer.seriennummer" class="mb-2">
            <svg ref="barcodeSvg"></svg>
          </div>
          <!-- Status-Badge farbig -->
          <span
              v-if="computer.status"
              class="badge status-badge ms-2"
              :class="statusClass(computer.status)"
          >
            <i :class="statusIcon(computer.status)" class="me-1"></i>
            {{ statusLabel(computer.status) }}
          </span>
        </div>

        <!-- Dokumente-Bereich (schönes UI) -->
        <div class="mb-4">
          <h5 class="section-title"><i class="bi bi-folder2-open me-2"></i>Dokumente</h5>
          <div v-if="documents.length">
            <ul class="list-group shadow-sm">
              <li
                  v-for="doc in documents"
                  :key="doc"
                  class="list-group-item d-flex align-items-center justify-content-between"
              >
                <div class="d-flex align-items-center gap-2">
                  <i :class="iconForFile(doc)" class="fs-5"></i>
                  <span class="filename">{{ truncate(typeof doc === 'string' ? doc : doc.filename, 36) }}</span>
                </div>
                <div class="d-flex gap-2">
                  <a
                      :href="downloadUrl(doc)"
                      download
                      class="btn btn-sm btn-outline-primary"
                      title="Herunterladen"
                  >
                    <i class="bi bi-download"></i>
                  </a>
                  <button
                      class="btn btn-sm btn-outline-danger"
                      @click="deleteDoc(doc)"
                      title="Löschen"
                  >
                    <i class="bi bi-trash3"></i>
                  </button>
                </div>
              </li>
            </ul>
          </div>
          <div v-else class="text-muted mb-2">Keine Dokumente vorhanden.</div>
          <!-- Upload-Formular -->
          <form @submit.prevent="uploadDocs" class="d-flex align-items-center gap-2 mt-2">
            <input
                type="file"
                ref="fileInput"
                multiple
                class="form-control form-control-sm"
                style="max-width: 330px"
                @change="onFileChange"
                accept=".pdf,.jpg,.jpeg,.png,.docx,.xlsx"
            />
            <button class="btn btn-sm btn-success" type="submit" :disabled="!files.length">
              <i class="bi bi-upload me-1"></i> Hochladen
            </button>
          </form>
        </div>

        <!-- Blöcke: Allgemein, Hardware, Netzwerk, System/Kategorie, Nutzer/Betreuung, Termine/Aufgaben -->
        <div class="row g-4">
          <!-- Allgemein -->
          <div class="col-md-6">
            <div class="section-card">
              <h5 class="section-title"><i class="bi bi-info-circle me-2"></i>Allgemein</h5>
              <ul class="list-group list-group-flush">
                <li v-for="key in ['marke','typ','laufendeNummer','inventarnummer','fauInventarnummer','beschaffungsjahr','wannErsetzen','seriennummer']" :key="key" class="list-group-item">
                  <strong>{{ fieldLabels[key] }}:</strong>
                  <span class="ms-2">{{ displayValue(computer[key]) }}</span>
                </li>
              </ul>
            </div>
          </div>
          <!-- Hardware -->
          <div class="col-md-6">
            <div class="section-card">
              <h5 class="section-title"><i class="bi bi-cpu me-2"></i>Hardware</h5>
              <ul class="list-group list-group-flush">
                <li v-for="key in ['cpu','ram','hddssd','grafikkarte','chipsatz','tpm','bios']" :key="key" class="list-group-item">
                  <strong>{{ fieldLabels[key] }}:</strong>
                  <span class="ms-2">{{ displayValue(computer[key]) }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="row g-4 mt-2">
          <!-- Netzwerk & Remote -->
          <div class="col-md-6">
            <div class="section-card">
              <h5 class="section-title"><i class="bi bi-wifi me-2"></i>Netzwerk & Remote</h5>
              <ul class="list-group list-group-flush">
                <li v-for="key in ['dnsName','ipAdresse','macAdresse','dhcp','remote']" :key="key" class="list-group-item">
                  <strong>{{ fieldLabels[key] }}:</strong>
                  <span class="ms-2">{{ displayValue(computer[key]) }}</span>
                </li>
              </ul>
            </div>
          </div>
          <!-- System & Kategorie -->
          <div class="col-md-6">
            <div class="section-card">
              <h5 class="section-title"><i class="bi bi-windows me-2"></i>System & Kategorie</h5>
              <ul class="list-group list-group-flush">
                <li>
                  <strong>Betriebssystem:</strong>
                  <span class="ms-2"><i class="bi bi-windows"></i> {{ computer.betriebssystem?.name || '–' }}</span>
                </li>
                <li>
                  <strong>Kategorie:</strong>
                  <span class="ms-2"><i class="bi bi-tags"></i> {{ computer.kategorie?.bezeichnung || '–' }}</span>
                </li>
                <li v-for="key in ['version','abstraktionsebene','artDerArbeit']" :key="key" class="list-group-item">
                  <strong>{{ fieldLabels[key] }}:</strong>
                  <span class="ms-2">{{ displayValue(computer[key]) }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="row g-4 mt-2">
          <!-- Nutzer & Betreuung -->
          <div class="col-md-6">
            <div class="section-card">
              <h5 class="section-title"><i class="bi bi-person me-2"></i>Nutzer & Betreuung</h5>
              <ul class="list-group list-group-flush">
                <li v-for="key in ['benutzer','idmKennung','betreuer','raumnummer','studPCs','studienzuschuss']" :key="key" class="list-group-item">
                  <strong>{{ fieldLabels[key] }}:</strong>
                  <span class="ms-2">{{ displayValue(computer[key]) }}</span>
                </li>
              </ul>
            </div>
          </div>
          <!-- Termine, Aufgaben, Infos -->
          <div class="col-md-6">
            <div class="section-card">
              <h5 class="section-title"><i class="bi bi-calendar3 me-2"></i>Aufgaben & Notizen</h5>
              <ul class="list-group list-group-flush">
                <li v-for="key in ['startdatum','abgabe','todo','ablauf','info']" :key="key" class="list-group-item">
                  <strong>{{ fieldLabels[key] }}:</strong>
                  <span class="ms-2">{{ displayValue(computer[key]) }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Action-Buttons -->
        <div class="d-flex gap-3 mt-4">
          <router-link
              :to="`/computer/${computer._id}/edit`"
              class="btn btn-gradient d-flex align-items-center gap-2"
          >
            <i class="bi bi-pencil-square"></i> Bearbeiten
          </router-link>
          <router-link
              to="/computer"
              class="btn btn-outline-gradient d-flex align-items-center gap-2"
          >
            <i class="bi bi-arrow-left"></i> Zurück zur Liste
          </router-link>
        </div>
      </div>
      <!-- Fallback falls Computer nicht gefunden -->
      <div v-else class="alert alert-secondary">
        <i class="bi bi-question-circle me-2"></i>Computer nicht gefunden.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import JsBarcode from 'jsbarcode'
import { useRoute } from 'vue-router'
import http from '@/api/http'
import { useToastStore } from '@/stores/toast'

const route = useRoute()
const toast = useToastStore()
const computer = ref(null)
const isLoading = ref(true)
const barcodeSvg = ref(null)
const error = ref('')

// Status UI-Mapping (Badge/Icon/Label)
const statusLabel = s =>
    ({ in_betrieb: 'In Betrieb', bald_ersetzen: 'Bald ersetzen', ausser_betrieb: 'Außer Betrieb' }[s] || s)
const statusClass = s =>
    ({ in_betrieb: 'bg-success text-white', bald_ersetzen: 'bg-warning text-dark', ausser_betrieb: 'bg-danger text-white' }[s] || 'bg-secondary')
const statusIcon = s =>
    ({ in_betrieb: 'bi bi-check-circle', bald_ersetzen: 'bi bi-exclamation-circle', ausser_betrieb: 'bi bi-x-octagon' }[s] || 'bi bi-circle')

// Dokument-Upload, -List, -Delete
const documents = ref([])
const files = ref([])
const fileInput = ref(null)
const id = route.params.id

const loadDocs = async () => {
  try {
    const res = await http.get(`/computer/${id}/documents`)
    documents.value = res.data
  } catch {
    documents.value = []
  }
}
const onFileChange = e => {
  files.value = Array.from(e.target.files)
}
const uploadDocs = async () => {
  if (!files.value.length) return
  const formData = new FormData()
  files.value.forEach(f => formData.append('documents', f))
  try {
    await http.post(`/computer/${id}/upload`, formData)
    toast.show('Dateien hochgeladen!', 'success')
    files.value = []
    fileInput.value.value = ''
    await loadDocs()
  } catch {
    toast.show('Fehler beim Upload', 'danger')
  }
}

const deleteDoc = async (doc) => {
  const filename = typeof doc === 'string' ? doc : doc.filename
  if (!confirm(`Datei "${filename}" wirklich löschen?`)) return
  try {
    await http.delete(`/computer/${id}/documents/${encodeURIComponent(filename)}`)
    toast.show('Datei gelöscht!', 'success')
    await loadDocs()
  } catch {
    toast.show('Fehler beim Löschen', 'danger')
  }
}


// Download-Link (je nach API ggf. Prefix anpassen!)
const downloadUrl = doc => `/computer/${id}/documents/${encodeURIComponent(typeof doc === 'string' ? doc : doc.filename)}`


// Dateinamen kürzen für bessere Lesbarkeit
function truncate(str, len = 32) {
  if (str.length <= len) return str
  return str.slice(0, len - 7) + '...' + str.slice(-7)
}
// Icon je nach Dateityp
function iconForFile(doc) {
  // doc kann entweder String oder Objekt sein!
  const filename = typeof doc === 'string' ? doc : doc.filename
  if (!filename || typeof filename !== 'string') return 'bi bi-file-earmark'
  const ext = filename.split('.').pop().toLowerCase()
  if (['pdf'].includes(ext)) return 'bi bi-file-earmark-pdf text-danger'
  if (['jpg', 'jpeg', 'png'].includes(ext)) return 'bi bi-file-image text-info'
  if (['doc', 'docx'].includes(ext)) return 'bi bi-file-earmark-word text-primary'
  if (['xls', 'xlsx'].includes(ext)) return 'bi bi-file-earmark-excel text-success'
  return 'bi bi-file-earmark'
}


// Labels für alle Felder (1:1 Copy aus deinem Modell)
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
// Hilfsfunktion: Null/leer als Strich
function displayValue(val) {
  if (val === null || val === undefined || val === '') return '–'
  return val
}

// Initialdaten laden
onMounted(async () => {
  isLoading.value = true
  error.value     = ''
  try {
    const res = await http.get(`/computer/${id}`)
    computer.value = res.data
    await loadDocs()
  } catch (e) {
    error.value = e.response?.data?.error || 'Fehler beim Laden'
    toast.show(error.value, 4000)
  } finally {
    isLoading.value = false
  }
  await nextTick()
  if (computer.value?.seriennummer && barcodeSvg.value) {
    JsBarcode(barcodeSvg.value, computer.value.seriennummer, {
      format: "CODE128",
      width: 2,
      height: 48,
      displayValue: true
    })
  }
})
</script>

<style scoped>
.computer-detail-wrapper {
  max-width: 1050px;
  margin: 0 auto;
}
.card {
  background: #fafdff;
}
.text-gradient {
  background: linear-gradient(90deg,#388bfd 10%,#38d6ae 90%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.section-card {
  background: #f8fafc;
  border-radius: 1.1rem;
  box-shadow: 0 2px 12px #3a7bd510;
  padding: 1.1rem 1.1rem 0.5rem 1.1rem;
  margin-bottom: 8px;
  min-height: 220px;
}
.section-title {
  font-weight: 600;
  color: #388bfd;
  margin-bottom: 0.6rem;
  font-size: 1.13rem;
  letter-spacing: 0.03em;
}
.list-group-item {
  background: transparent;
  border: none;
  padding: 0.48rem 0.1rem;
  font-size: 1.01rem;
}
.badge {
  font-size: 0.95em;
  font-weight: 500;
  padding: 0.37em 0.8em;
  border-radius: 0.8em;
  background: #f0f4fa;
}
.btn-gradient {
  background: linear-gradient(90deg,#50d285,#22a6b3 90%);
  color: #fff;
  border: none;
  border-radius: 1.2em;
  padding: 7px 22px;
  font-weight: 600;
  box-shadow: 0 2px 10px #00d2ff12;
  transition: background 0.18s;
}
.btn-gradient:hover {
  background: linear-gradient(90deg,#22a6b3,#50d285 90%);
  color: #fff;
}
.btn-outline-gradient {
  border: 2px solid #50d285;
  color: #50d285;
  background: transparent;
  border-radius: 1.2em;
  padding: 7px 22px;
  font-weight: 600;
}
.btn-outline-gradient:hover {
  background: linear-gradient(90deg,#22a6b3,#50d285 90%);
  color: #fff;
  border: 2px solid #22a6b3;
}
/* Status-Badge eigene Farben */
.status-badge.bg-success { background: #50d285 !important; color: #fff !important; }
.status-badge.bg-warning { background: #ffc107 !important; color: #111 !important; }
.status-badge.bg-danger  { background: #ff6b6b !important; color: #fff !important; }
/* Dateinamen-Formatierung */
.filename { font-size: 1.03em; word-break: break-all; }
</style>
