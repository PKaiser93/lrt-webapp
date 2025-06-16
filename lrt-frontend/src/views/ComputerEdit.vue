<template>
  <div class="container py-4">
    <h2 class="mb-4">🖥️ Computer bearbeiten</h2>

    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-primary"></div>
    </div>
    <div v-else>
      <div v-if="error" class="alert alert-danger">{{ error }}</div>

      <form @submit.prevent="saveComputer">

        <!-- ACCORDION -->
        <div class="accordion" id="computerAccordion">

          <!-- GERÄTE-INFO -->
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingInfo">
              <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseInfo" aria-expanded="true" aria-controls="collapseInfo">
                Geräte-Info
              </button>
            </h2>
            <div id="collapseInfo" class="accordion-collapse collapse show" aria-labelledby="headingInfo" data-bs-parent="#computerAccordion">
              <div class="accordion-body row g-3">
                <div class="col-md-4">
                  <label class="form-label">Marke</label>
                  <input v-model="form.marke" class="form-control" />
                </div>
                <div class="col-md-4">
                  <label class="form-label">Typ</label>
                  <input v-model="form.typ" class="form-control" />
                </div>
                <div class="col-md-4">
                  <label class="form-label">Seriennummer</label>
                  <input v-model="form.seriennummer" class="form-control" />
                </div>
                <div class="col-md-4">
                  <label class="form-label">DNS Name</label>
                  <input v-model="form.dnsName" class="form-control" />
                </div>
                <div class="col-md-4">
                  <label class="form-label">RAM (GB)</label>
                  <input v-model.number="form.ram" type="number" min="0" class="form-control" />
                </div>
                <div class="col-md-4">
                  <label class="form-label">CPU</label>
                  <input v-model="form.cpu" class="form-control" />
                </div>
                <div class="col-md-4">
                  <label class="form-label">Grafikkarte</label>
                  <input v-model="form.grafikkarte" class="form-control" />
                </div>
                <div class="col-md-4">
                  <label class="form-label">Chipsatz</label>
                  <input v-model="form.chipsatz" class="form-control" />
                </div>
              </div>
            </div>
          </div>

          <!-- BETRIEBSSYSTEM -->
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingOS">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOS" aria-expanded="false" aria-controls="collapseOS">
                Betriebssystem
              </button>
            </h2>
            <div id="collapseOS" class="accordion-collapse collapse" aria-labelledby="headingOS" data-bs-parent="#computerAccordion">
              <div class="accordion-body row g-3">
                <div class="col-md-6">
                  <label class="form-label">Betriebssystem</label>
                  <select v-model="form.betriebssystem" class="form-select">
                    <option value="">—</option>
                    <option v-for="os in osList" :key="os._id" :value="os._id">{{ os.name }}</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Version</label>
                  <input v-model="form.version" class="form-control" />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Abstraktionsebene</label>
                  <input v-model="form.abstraktionsebene" class="form-control" />
                </div>
              </div>
            </div>
          </div>

          <!-- NETZWERK -->
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingNet">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseNet" aria-expanded="false" aria-controls="collapseNet">
                Netzwerk
              </button>
            </h2>
            <div id="collapseNet" class="accordion-collapse collapse" aria-labelledby="headingNet" data-bs-parent="#computerAccordion">
              <div class="accordion-body row g-3">
                <div class="col-md-4">
                  <label class="form-label">IP-Adresse</label>
                  <input v-model="form.ipAdresse" class="form-control" />
                </div>
                <div class="col-md-4">
                  <label class="form-label">MAC-Adresse</label>
                  <input v-model="form.macAdresse" class="form-control" />
                </div>
                <div class="col-md-4">
                  <label class="form-label">DHCP</label>
                  <select v-model="form.dhcp" class="form-select">
                    <option :value="true">Ja</option>
                    <option :value="false">Nein</option>
                  </select>
                </div>
                <div class="col-md-4">
                  <label class="form-label">Remote</label>
                  <input v-model="form.remote" class="form-control" />
                </div>
                <div class="col-md-4">
                  <label class="form-label">Raumnummer</label>
                  <input v-model="form.raumnummer" class="form-control" />
                </div>
              </div>
            </div>
          </div>

          <!-- BENUTZER -->
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingUser">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseUser" aria-expanded="false" aria-controls="collapseUser">
                Benutzer / Betreuer
              </button>
            </h2>
            <div id="collapseUser" class="accordion-collapse collapse" aria-labelledby="headingUser" data-bs-parent="#computerAccordion">
              <div class="accordion-body row g-3">
                <div class="col-md-4">
                  <label class="form-label">Benutzer</label>
                  <input v-model="form.benutzer" class="form-control" />
                </div>
                <div class="col-md-4">
                  <label class="form-label">Betreuer</label>
                  <input v-model="form.betreuer" class="form-control" />
                </div>
                <div class="col-md-4">
                  <label class="form-label">Art der Arbeit</label>
                  <input v-model="form.artDerArbeit" class="form-control" />
                </div>
              </div>
            </div>
          </div>

          <!-- BESCHAFFUNG -->
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingProc">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseProc" aria-expanded="false" aria-controls="collapseProc">
                Beschaffung
              </button>
            </h2>
            <div id="collapseProc" class="accordion-collapse collapse" aria-labelledby="headingProc" data-bs-parent="#computerAccordion">
              <div class="accordion-body row g-3">
                <div class="col-md-4">
                  <label class="form-label">Beschaffungsjahr</label>
                  <input v-model.number="form.beschaffungsjahr" type="number" class="form-control" />
                </div>
                <div class="col-md-4">
                  <label class="form-label">Inventarnummer</label>
                  <input v-model="form.inventarnummer" class="form-control" />
                </div>
                <div class="col-md-4">
                  <label class="form-label">Laufende Nummer</label>
                  <input v-model.number="form.laufendeNummer" type="number" class="form-control" />
                </div>
                <div class="col-md-4">
                  <label class="form-label">StudPCs</label>
                  <input v-model.number="form.studPCs" type="number" class="form-control" />
                </div>
                <div class="col-md-4">
                  <label class="form-label">Studienzuschuss</label>
                  <input v-model.number="form.studienzuschuss" type="number" class="form-control" />
                </div>
                <div class="col-md-4">
                  <label class="form-label">FAU Inventarnummer</label>
                  <input v-model="form.fauInventarnummer" class="form-control" />
                </div>
              </div>
            </div>
          </div>

          <!-- KATEGORIE -->
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingKat">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseKat" aria-expanded="false" aria-controls="collapseKat">
                Kategorie
              </button>
            </h2>
            <div id="collapseKat" class="accordion-collapse collapse" aria-labelledby="headingKat" data-bs-parent="#computerAccordion">
              <div class="accordion-body row g-3">
                <div class="col-md-6">
                  <label class="form-label">Kategorie</label>
                  <select v-model="form.kategorie" class="form-select">
                    <option value="">—</option>
                    <option v-for="k in kategorieList" :key="k._id" :value="k._id">{{ k.bezeichnung }}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- SONSTIGES -->
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingOther">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOther" aria-expanded="false" aria-controls="collapseOther">
                Sonstiges
              </button>
            </h2>
            <div id="collapseOther" class="accordion-collapse collapse" aria-labelledby="headingOther" data-bs-parent="#computerAccordion">
              <div class="accordion-body row g-3">
                <div class="col-md-6">
                  <label class="form-label">BIOS</label>
                  <input v-model="form.bios" class="form-control" />
                </div>
                <div class="col-md-6">
                  <label class="form-label">TPM</label>
                  <input v-model="form.tpm" class="form-control" />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Info</label>
                  <input v-model="form.info" class="form-control" />
                </div>
                <div class="col-md-6">
                  <label class="form-label">ToDo</label>
                  <input v-model="form.todo" class="form-control" />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Ablauf</label>
                  <input v-model="form.ablauf" class="form-control" />
                </div>
              </div>
            </div>
          </div>

        </div>

        <div class="mt-4 d-flex gap-2">
          <button class="btn btn-success" type="submit" :disabled="saving">
            <span v-if="saving">Speichern…</span>
            <span v-else>Speichern</span>
          </button>
          <router-link class="btn btn-secondary" :to="'/computerlist'">Abbrechen</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import http from '../api/http'
import { showToast } from '../utils/toast'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const saving = ref(false)
const error = ref('')

const kategorieList = ref([])
const osList = ref([])

const form = ref({
  marke: '', typ: '', seriennummer: '', dnsName: '', ram: null, cpu: '', grafikkarte: '', chipsatz: '',
  betriebssystem: '', version: '', abstraktionsebene: '',
  ipAdresse: '', macAdresse: '', dhcp: false, remote: '', raumnummer: '',
  benutzer: '', betreuer: '', artDerArbeit: '',
  beschaffungsjahr: null, inventarnummer: '', laufendeNummer: null, studPCs: null, studienzuschuss: null, fauInventarnummer: '',
  kategorie: '',
  bios: '', tpm: '', info: '', todo: '', ablauf: ''
})

async function loadData() {
  loading.value = true
  error.value = ''
  try {
    // Hole Computer-Details + Kategorien + OS parallel
    const [compRes, katRes, osRes] = await Promise.all([
      http.get(`/computer/${route.params.id}`),
      http.get('/kategorie'),
      http.get('/betriebssystem')
    ])
    Object.assign(form.value, compRes.data)
    kategorieList.value = katRes.data
    osList.value = osRes.data
    // Fix: wenn betriebssystem/kategorie Objekt, extrahiere _id
    if (typeof form.value.betriebssystem === 'object' && form.value.betriebssystem)
      form.value.betriebssystem = form.value.betriebssystem._id
    if (typeof form.value.kategorie === 'object' && form.value.kategorie)
      form.value.kategorie = form.value.kategorie._id
  } catch (err) {
    error.value = err?.response?.data?.error || 'Fehler beim Laden.'
  } finally {
    loading.value = false
  }
}
onMounted(loadData)

async function saveComputer() {
  saving.value = true
  error.value = ''
  try {
    // Vor dem Absenden, ggf. nicht-editierbare Felder entfernen
    const compData = { ...form.value }
    const res = await http.put(`/computer/${route.params.id}`, compData)
    showToast('Änderungen gespeichert', 'success')
    router.push('/computerlist')
  } catch (err) {
    error.value = err?.response?.data?.error || 'Speichern fehlgeschlagen.'
    showToast(error.value, 'danger')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.accordion-button:not(.collapsed) {
  color: #2c3e50;
  background: #e9ecef;
}
.accordion-button {
  font-weight: 600;
  font-size: 1.06rem;
}
</style>
