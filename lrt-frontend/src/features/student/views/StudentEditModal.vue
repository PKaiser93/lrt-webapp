<template>
  <div class="modal fade show" style="display:block; background:rgba(0,0,0,0.4)" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
      <div class="modal-content shadow-lg">
        <form @submit.prevent="saveStudent">
          <!-- Header mit Gradient und Icon -->
          <div class="modal-header border-0 bg-gradient-header text-white py-3">
            <h5 class="modal-title">
              <i class="bi bi-pencil-square me-2"></i>
              {{ form._id ? 'Student bearbeiten' : 'Student anlegen' }}
            </h5>
            <button type="button" class="btn-close btn-close-white" @click="$emit('close')" aria-label="Schließen"></button>
          </div>

          <div class="modal-body p-4">
            <!-- Nachname & Vorname -->
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Nachname</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-person-fill"></i></span>
                  <input
                      v-model="form.name"
                      type="text"
                      class="form-control"
                      placeholder="Nachname"
                      required
                  />
                </div>
              </div>
              <div class="col-md-6">
                <label class="form-label">Vorname</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-person-lines-fill"></i></span>
                  <input
                      v-model="form.vorname"
                      type="text"
                      class="form-control"
                      placeholder="Vorname"
                      required
                  />
                </div>
              </div>
            </div>

            <!-- IdM-Account & FAU E‑Mail -->
            <div class="row g-3 mt-2">
              <div class="col-md-6">
                <label class="form-label">IdM-Account</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-shield-lock-fill"></i></span>
                  <input
                      v-model="form.idmAccount"
                      type="text"
                      class="form-control"
                      placeholder="IdM-Account"
                      required
                  />
                </div>
              </div>
              <div class="col-md-6">
                <label class="form-label">FAU E‑Mail</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-envelope-fill"></i></span>
                  <input
                      v-model="form.fauEmail"
                      type="email"
                      class="form-control"
                      placeholder="beispiel@fau.de"
                      required
                  />
                </div>
              </div>
            </div>

            <!-- Rechner -->
            <div class="mt-3">
              <label class="form-label">Rechner</label>
              <div class="input-group">
                <span class="input-group-text"><i class="bi bi-pc-display"></i></span>
                <select v-model="form.rechner" class="form-select">
                  <option value="">— Freitext oder Pool wählen —</option>
                  <option
                      v-for="c in computerList"
                      :key="c._id"
                      :value="c._id"
                  >
                    {{ c.dnsName || c.marke || c.typ || c._id }}
                  </option>
                </select>
              </div>
              <input
                  v-if="!form.rechner || !computerList.some(c => c._id === form.rechner)"
                  v-model="form.rechner"
                  type="text"
                  class="form-control mt-2"
                  placeholder="Rechner-Name oder Pool-Rechner"
              />
            </div>

            <!-- Betriebssystem -->
            <div class="mt-3">
              <label class="form-label">Betriebssystem</label>
              <div class="input-group">
                <span class="input-group-text"><i class="bi bi-window-dock"></i></span>
                <select v-model="form.betriebssystem" class="form-select">
                  <option value="">— auswählen —</option>
                  <option
                      v-for="os in osList"
                      :key="os._id"
                      :value="os._id"
                  >
                    {{ os.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- Footer mit Buttons -->
          <div class="modal-footer border-0 px-4 pb-4 d-flex justify-content-end gap-2">
            <button
                type="button"
                class="btn btn-outline-gradient"
                @click="$emit('close')"
                :disabled="saving"
            >
              <i class="bi bi-x-lg me-1"></i> Abbrechen
            </button>
            <button
                type="submit"
                class="btn btn-gradient"
                :disabled="saving"
            >
              <span v-if="saving" class="spinner-border spinner-border-sm me-1"></span>
              <i class="bi bi-check-lg me-1"></i>
              {{ saving ? 'Speichern...' : 'Speichern' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <div class="modal-backdrop fade show"></div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import http from '@/api/http'

const props = defineProps({
  student: Object
})
const emit = defineEmits(['close', 'saved'])

const form = ref({
  _id: '',
  name: '',
  vorname: '',
  idmAccount: '',
  fauEmail: '',
  rechner: '',
  betriebssystem: ''
})
const saving = ref(false)
const osList = ref([])
const computerList = ref([])

onMounted(async () => {
  osList.value = await http.get('/betriebssystem').then(r => r.data)
  computerList.value = await http
      .get('/computer/search?query=&limit=200')
      .then(r => r.data)
})

// Wenn props.student wechselt, in Form kopieren
watch(() => props.student, (newVal) => {
  if (newVal) {
    form.value = {
      _id: newVal._id || '',
      name: newVal.name || '',
      vorname: newVal.vorname || '',
      idmAccount: newVal.idmAccount || '',
      fauEmail: newVal.fauEmail || '',
      rechner: newVal.rechner || '',
      betriebssystem: typeof newVal.betriebssystem === 'object'
          ? newVal.betriebssystem._id
          : newVal.betriebssystem || ''
    }
  } else {
    form.value = { _id: '', name: '', vorname: '', idmAccount: '', fauEmail: '', rechner: '', betriebssystem: '' }
  }
}, { immediate: true })

async function saveStudent() {
  saving.value = true
  try {
    if (form.value._id) {
      await http.put(`/studenten/${form.value._id}`, form.value)
    } else {
      await http.post('/studenten', form.value)
    }
    emit('saved')
  } catch (e) {
    alert(e?.response?.data?.error || 'Fehler beim Speichern')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.modal-backdrop {
  z-index: 1040 !important;
}
.modal {
  z-index: 1050 !important;
}
.modal-content {
  border-radius: 1rem;
  overflow: hidden;
}
.bg-gradient-header {
  background: linear-gradient(120deg, #3a7bd5 0%, #00d2ff 90%);
}
.input-group-text {
  background: #f1f5fa;
  border-right: 0;
}
.form-control,
.form-select {
  border-left: 0;
}
.btn-gradient {
  background: linear-gradient(90deg, #3a7bd5, #00d2ff 70%);
  color: #fff;
  font-weight: 600;
  border: none;
  border-radius: 0.8rem;
  padding: 0.5rem 1.4rem;
  transition: background 0.3s, box-shadow 0.3s;
}
.btn-gradient:hover {
  background: linear-gradient(90deg, #00d2ff, #3a7bd5 70%);
}
.btn-outline-gradient {
  border: 2px solid #3a7bd5;
  color: #3a7bd5;
  background: #fff;
  font-weight: 500;
  border-radius: 0.8rem;
  padding: 0.45rem 1.2rem;
  transition: background 0.3s, color 0.3s, box-shadow 0.3s;
}
.btn-outline-gradient:hover {
  background: linear-gradient(90deg, #3a7bd5, #00d2ff 70%);
  color: #fff;
}
</style>
