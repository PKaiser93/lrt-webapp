<template>
  <div class="computer-detail-wrapper container py-4">
    <div class="card p-4">
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
        <!-- Kopfzeile mit Typ, Barcode und Status -->
        <div class="d-flex flex-wrap align-items-center gap-3 mb-4">
          <i class="bi bi-pc-display fs-2 text-primary"></i>
          <h2 class="fw-bold text-gradient mb-0">
            {{ displayValue(computer.marke) }}
            <span
                v-if="computer.typ"
                class="badge bg-light text-gradient-badge ms-2 fs-6"
            >
              {{ displayValue(computer.typ) }}
            </span>
          </h2>

          <!-- Barcode + Download -->
          <div v-if="computer.seriennummer" class="d-flex align-items-center mb-2">
            <svg ref="barcodeSvg"></svg>
            <button
                class="btn btn-sm btn-outline-secondary ms-2"
                @click="downloadBarcode"
                title="Barcode herunterladen"
            >
              <i class="bi bi-download"></i>
            </button>
            <button
                class="btn btn-sm btn-outline-secondary ms-1"
                @click="downloadBarcodeSvg"
                title="SVG herunterladen"
            >
              <i class="bi bi-filetype-svg"></i>
            </button>
          </div>

          <!-- Status-Badge -->
          <span
              v-if="computer.status"
              class="badge status-badge ms-2"
              :class="statusClass(computer.status)"
          >
            <i :class="statusIcon(computer.status)" class="me-1"></i>
            {{ statusLabel(computer.status) }}
          </span>
        </div>

        <!-- Dokumente-Bereich -->
        <div class="mb-4">
          <h5 class="section-title d-flex align-items-center gap-2">
            <i class="bi bi-folder2-open"></i> Dokumente
          </h5>
          <div v-if="documents.length">
            <ul class="list-group">
              <li
                  v-for="doc in documents"
                  :key="doc"
                  class="list-group-item d-flex align-items-center justify-content-between"
              >
                <div class="d-flex align-items-center gap-2">
                  <i :class="iconForFile(doc)" class="fs-5"></i>
                  <span class="filename">
                    {{ truncate(typeof doc === 'string' ? doc : doc.filename, 36) }}
                  </span>
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
        </div>

        <!-- Detail-Blöcke -->
        <div class="row g-4">
          <!-- Allgemein -->
          <div class="col-md-6">
            <div class="section-card">
              <h5 class="section-title d-flex align-items-center gap-2">
                <i class="bi bi-info-circle"></i> Allgemein
              </h5>
              <ul class="list-group-flush list-group">
                <li
                    v-for="key in ['marke','typ','laufendeNummer','inventarnummer','fauInventarnummer','beschaffungsjahr','wannErsetzen','seriennummer']"
                    :key="key"
                    class="list-group-item"
                >
                  <strong>{{ fieldLabels[key] }}:</strong>
                  <span class="ms-2">{{ displayValue(computer[key]) }}</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Hardware -->
          <div class="col-md-6">
            <div class="section-card">
              <h5 class="section-title d-flex align-items-center gap-2">
                <i class="bi bi-cpu"></i> Hardware
              </h5>
              <ul class="list-group-flush list-group">
                <li
                    v-for="key in ['cpu','ram','hddssd','grafikkarte','chipsatz','tpm','bios']"
                    :key="key"
                    class="list-group-item"
                >
                  <strong>{{ fieldLabels[key] }}:</strong>
                  <span class="ms-2">{{ displayValue(computer[key]) }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Netzwerk & Remote -->
        <div class="row g-4 mt-2">
          <div class="col-md-6">
            <div class="section-card">
              <h5 class="section-title d-flex align-items-center gap-2">
                <i class="bi bi-wifi"></i> Netzwerk & Remote
              </h5>
              <ul class="list-group-flush list-group">
                <li
                    v-for="key in ['dnsName','ipAdresse','macAdresse','dhcp','remote']"
                    :key="key"
                    class="list-group-item"
                >
                  <strong>{{ fieldLabels[key] }}:</strong>
                  <span class="ms-2">{{ displayValue(computer[key]) }}</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- System & Kategorie -->
          <div class="col-md-6">
            <div class="section-card">
              <h5 class="section-title d-flex align-items-center gap-2">
                <i class="bi bi-windows"></i> System & Kategorie
              </h5>
              <ul class="list-group-flush list-group">
                <li class="list-group-item">
                  <strong>Betriebssystem:</strong>
                  <span class="ms-2">
                    <i :class="osIcon(computer.betriebssystem?.name)"></i>
                    {{ displayValue(stripQuotes(computer.betriebssystem?.name)) }}
                  </span>
                </li>
                <li class="list-group-item">
                  <strong>Kategorie:</strong>
                  <span class="ms-2">
                    <i class="bi bi-tags"></i>
                    {{ displayValue(stripQuotes(computer.kategorie?.bezeichnung)) }}
                  </span>
                </li>
                <li
                    v-for="key in ['version','kernel','abstraktionsebene','artDerArbeit']"
                    :key="key"
                    class="list-group-item"
                >
                  <strong>{{ fieldLabels[key] }}:</strong>
                  <span class="ms-2">{{ displayValue(computer[key]) }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Nutzer & Betreuung -->
        <div class="row g-4 mt-2">
          <div class="col-md-6">
            <div class="section-card">
              <h5 class="section-title d-flex align-items-center gap-2">
                <i class="bi bi-person"></i> Nutzer & Betreuung
              </h5>
              <ul class="list-group-flush list-group">
                <li
                    v-for="key in ['benutzer','idmKennung','betreuer','raumnummer','studPCs','studienzuschuss']"
                    :key="key"
                    class="list-group-item"
                >
                  <strong>{{ fieldLabels[key] }}:</strong>
                  <span class="ms-2">{{ displayValue(computer[key]) }}</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Aufgaben & Notizen -->
          <div class="col-md-6">
            <div class="section-card">
              <h5 class="section-title d-flex align-items-center gap-2">
                <i class="bi bi-calendar3"></i> Aufgaben & Notizen
              </h5>
              <ul class="list-group-flush list-group">
                <li
                    v-for="key in ['startdatum','abgabe','todo','ablauf','info']"
                    :key="key"
                    class="list-group-item"
                >
                  <strong>{{ fieldLabels[key] }}:</strong>
                  <span class="ms-2">{{ displayValue(computer[key]) }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Upload-Card -->
        <div class="row mt-4">
          <div class="col-12">
            <div class="section-card upload-card">
              <h5 class="section-title d-flex align-items-center gap-2">
                <i class="bi bi-cloud-upload"></i> Neue Dokumente hochladen
              </h5>
              <form @submit.prevent="uploadDocs" class="d-flex flex-wrap gap-2">
                <input
                    type="file"
                    ref="fileInput"
                    multiple
                    class="form-control form-control-sm"
                    @change="onFileChange"
                    accept=".pdf,.jpg,.jpeg,.png,.docx,.xlsx"
                />
                <button
                    class="btn btn-sm btn-success"
                    type="submit"
                    :disabled="!files.length"
                >
                  <i class="bi bi-upload me-1"></i> Hochladen
                </button>
              </form>
            </div>
          </div>
        </div>

        <!-- Action-Buttons -->
        <div class="d-flex gap-2 mt-4 flex-wrap">
          <router-link
              :to="`/computer/${computer._id}/edit`"
              class="btn btn-gradient"
          >
            <i class="bi bi-pencil-square me-1"></i> Bearbeiten
          </router-link>
          <router-link
              to="/computer"
              class="btn btn-outline-gradient"
          >
            <i class="bi bi-arrow-left me-1"></i> Zurück zur Liste
          </router-link>
        </div>
      </div>

      <!-- Fallback: nicht gefunden -->
      <div v-else class="alert alert-secondary mt-4">
        <i class="bi bi-question-circle me-2"></i> Computer nicht gefunden.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import JsBarcode from 'jsbarcode'
import { useRoute } from 'vue-router'
import http from '@/shared/api/http'
import { useToastStore } from '@/shared/stores/toast'

const route = useRoute()
const toast = useToastStore()
const computer = ref(null)
const isLoading = ref(true)
const barcodeSvg = ref(null)
const error = ref('')

const documents = ref([])
const files = ref([])
const fileInput = ref(null)
const id = route.params.id

// Barcode-Download PNG
const downloadBarcode = () => {
  const svgEl = barcodeSvg.value
  if (!svgEl) return
  const serializer = new XMLSerializer()
  const svgString = serializer.serializeToString(svgEl)
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const img = new Image()
  img.onload = () => {
    const scale = 4
    const canvas = document.createElement('canvas')
    canvas.width = img.width * scale
    canvas.height = img.height * scale
    const ctx = canvas.getContext('2d')
    ctx.scale(scale, scale)
    ctx.drawImage(img, 0, 0)
    URL.revokeObjectURL(url)
    const pngUrl = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = pngUrl
    a.download = `${computer.value.seriennummer}@${scale}x.png`
    a.click()
  }
  img.src = url
}

// Barcode-Download SVG
const downloadBarcodeSvg = () => {
  const svgEl = barcodeSvg.value
  if (!svgEl) return
  const serializer = new XMLSerializer()
  const svgString = serializer.serializeToString(svgEl)
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${computer.value.seriennummer}.svg`
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

// Status-Mappings
const statusLabel = s =>
    ({
      in_betrieb:     'In Betrieb',
      bald_ersetzen:  'Bald ersetzen',
      ausser_betrieb: 'Außer Betrieb',
      auf_lager:      'Auf Lager',
      unbekannt:      'Unbekannt'
    }[s] || s)

const statusClass = s =>
    ({
      in_betrieb:     'bg-success text-white',
      bald_ersetzen:  'bg-warning text-dark',
      ausser_betrieb: 'bg-danger text-white',
      auf_lager:      'bg-info text-dark',
      unbekannt:      'bg-secondary text-white'
    }[s] || 'bg-secondary')

const statusIcon = s =>
    ({
      in_betrieb:     'bi bi-check-circle',
      bald_ersetzen:  'bi bi-exclamation-circle',
      ausser_betrieb: 'bi bi-x-octagon',
      auf_lager:      'bi bi-box2',
      unbekannt:      'bi bi-question-circle'
    }[s] || 'bi bi-circle')

// Dokumente laden
const loadDocs = async () => {
  try {
    const res = await http.get(`/computer/${id}/documents`)
    documents.value = res.data
  } catch {
    documents.value = []
  }
}

// Upload & Delete
const onFileChange = e => files.value = Array.from(e.target.files)

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

const deleteDoc = async doc => {
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

const downloadUrl = doc =>
    `/computer/${id}/documents/${encodeURIComponent(typeof doc === 'string' ? doc : doc.filename)}`

function truncate(str, len = 32) {
  if (str.length <= len) return str
  return str.slice(0, len - 7) + '...' + str.slice(-7)
}

function iconForFile(doc) {
  const filename = typeof doc === 'string' ? doc : doc.filename
  const ext = (filename || '').split('.').pop().toLowerCase()
  if (['pdf'].includes(ext))   return 'bi bi-file-earmark-pdf text-danger'
  if (['jpg','jpeg','png'].includes(ext)) return 'bi bi-file-image text-info'
  if (['doc','docx'].includes(ext)) return 'bi bi-file-earmark-word text-primary'
  if (['xls','xlsx'].includes(ext)) return 'bi bi-file-earmark-excel text-success'
  return 'bi bi-file-earmark'
}

function osIcon(osName = '') {
  const name = osName.toLowerCase()
  if (name.includes('windows')) return 'bi bi-windows'
  if (name.includes('ubuntu'))  return 'bi bi-ubuntu'
  if (name.includes('macos')|| name.includes('ios') || name.includes('ipad')) return 'bi bi-apple'
  if (name.includes('linux'))  return 'bi bi-laptop'
  return 'bi bi-pc-display'
}

const fieldLabels = {
  seriennummer:        'Seriennummer',
  marke:               'Marke', typ: 'Typ',
  cpu:                 'CPU', ram: 'RAM',
  hddssd:              'HDD/SSD', grafikkarte: 'Grafikkarte',
  chipsatz:            'Chipsatz', tpm: 'TPM', bios: 'BIOS',
  remote:              'Remote', betriebssystem: 'Betriebssystem',
  version:             'Version', abstraktionsebene: 'Abstraktionsebene',
  dnsName:             'DNS-Name', ipAdresse: 'IP-Adresse',
  macAdresse:          'MAC-Adresse', dhcp: 'DHCP',
  benutzer:            'Benutzer', idmKennung: 'IdM-Kennung',
  betreuer:            'Betreuer', artDerArbeit: 'Art der Arbeit',
  startdatum:          'Startdatum', abgabe: 'Abgabe',
  raumnummer:          'Raumnummer', kategorie: 'Kategorie',
  laufendeNummer:      'Laufende Nummer', studPCs: 'StudPCs',
  inventarnummer:      'Inventarnummer', fauInventarnummer: 'FAU-Inventarnummer',
  beschaffungsjahr:    'Beschaffungsjahr', wannErsetzen: 'Wann ersetzen',
  studienzuschuss:     'Studienzuschuss', info: 'Info',
  todo:                'ToDo', ablauf: 'Ablauf', kernel: 'Kernel',
  status:               'Status'
}

function displayValue(val) {
  return (val === null || val === undefined || val === '') ? '–' : val
}

function stripQuotes(str) {
  return (!str || typeof str !== 'string') ? str : str.replace(/^['"](.+)['"]$/, '$1')
}

onMounted(async () => {
  isLoading.value = true
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
      width: 2.5,
      height: 60,
      displayValue: true,
      fontOptions: "bold",
      fontSize: 14,
      textAlign: "center",
      textPosition: "bottom",
      textMargin: 8,
      margin: 12,
      lineColor: "#333",
      background: "#fff"
    })
  }
})
</script>

<style scoped>
.computer-detail-wrapper {
  max-width: 960px;
  margin: 0 auto;
  padding: var(--space-lg) 0;
}

.card {
  background: var(--clr-card-bg);
  box-shadow: var(--shadow-light);
  border: none;
  border-radius: var(--radius-lg);
}

.text-gradient {
  background: linear-gradient(
      135deg,
      var(--clr-primary-start),
      var(--clr-primary-end)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.section-card {
  background: var(--clr-bg);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-light);
  padding: var(--space-md);
  margin-bottom: var(--space-md);
}

.section-title {
  font-weight: 600;
  font-size: var(--fs-lg);
  color: var(--clr-primary-start);
  margin-bottom: var(--space-sm);
}

.list-group-item {
  background: transparent;
  border: none;
  padding: var(--space-xs) 0;
}

.badge {
  font-size: var(--fs-xs);
  font-weight: 500;
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-sm);
}

.btn-gradient {
  background: linear-gradient(
      90deg,
      var(--clr-primary-start),
      var(--clr-primary-end)
  );
  color: #fff;
  border: none;
  border-radius: var(--radius-md);
  padding: var(--space-sm) var(--space-lg);
  font-weight: 600;
  transition: filter 0.2s, transform 0.1s;
}

.text-gradient-badge {
  background: linear-gradient(90deg, #388bfd 10%, #38d6ae 90%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.btn-gradient:hover {
  filter: brightness(1.05);
  transform: translateY(-1px);
}

.btn-outline-gradient {
  background: transparent;
  border: 1px solid var(--clr-primary-start);
  color: var(--clr-primary-start);
  border-radius: var(--radius-md);
  padding: var(--space-sm) var(--space-lg);
  transition: background 0.2s, color 0.2s;
}

.btn-outline-gradient:hover {
  background: var(--clr-card-bg);
  color: var(--clr-text);
}

.upload-card {
  background: var(--clr-bg);
}

.filename {
  font-size: var(--fs-md);
  word-break: break-all;
}

@media (max-width: 768px) {
  .section-card {
    padding: var(--space-sm);
  }
  .btn-gradient,
  .btn-outline-gradient {
    width: 100%;
    justify-content: center;
  }
}
</style>
