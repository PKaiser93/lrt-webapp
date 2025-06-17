<template>
  <div class="modal fade show" style="display:block; background:rgba(0,0,0,0.3)">
    <div class="modal-dialog">
      <div class="modal-content">
        <form @submit.prevent="saveStudent">
          <div class="modal-header">
            <h5 class="modal-title">{{ student?._id ? 'Bearbeiten' : 'Anlegen' }}</h5>
            <button type="button" class="btn-close" @click="$emit('close')"></button>
          </div>
          <div class="modal-body">
            <div class="mb-2">
              <label class="form-label">Nachname</label>
              <input v-model="form.name" class="form-control" required />
            </div>
            <div class="mb-2">
              <label class="form-label">Vorname</label>
              <input v-model="form.vorname" class="form-control" required />
            </div>
            <div class="mb-2">
              <label class="form-label">IdM-Account</label>
              <input v-model="form.idmAccount" class="form-control" required />
            </div>
            <div class="mb-2">
              <label class="form-label">FAU E-Mail</label>
              <input v-model="form.fauEmail" class="form-control" required type="email" />
            </div>
            <div class="mb-2">
              <label class="form-label">Rechner (Name, oder Pool-Rechner wählen)</label>
              <select v-model="form.rechner" class="form-select">
                <option value="">— Frei eingeben —</option>
                <option v-for="c in computerList" :value="c._id" :key="c._id">
                  {{ c.dnsName || c.marke || c.typ || c._id }}
                </option>
              </select>
              <input v-if="!form.rechner || !computerList.some(c=>c._id===form.rechner)" v-model="form.rechner" class="form-control mt-2" placeholder="Rechner-Name oder Pool-Rechner" />
            </div>
            <div class="mb-2">
              <label class="form-label">Betriebssystem</label>
              <select v-model="form.betriebssystem" class="form-select">
                <option value="">—</option>
                <option v-for="os in osList" :value="os._id" :key="os._id">{{ os.name }}</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-success" :disabled="saving">{{ saving ? 'Speichern...' : 'Speichern' }}</button>
            <button type="button" class="btn btn-secondary" @click="$emit('close')" :disabled="saving">Abbrechen</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <div class="modal-backdrop fade show"></div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import http from '../../../api/http'

const props = defineProps({ student: Object })
const emit = defineEmits(['close', 'saved'])

const form = ref({
  name: '', vorname: '', idmAccount: '', fauEmail: '', rechner: '', betriebssystem: ''
})
const saving = ref(false)
const osList = ref([])
const computerList = ref([])

onMounted(async () => {
  osList.value = await http.get('/betriebssystem').then(r => r.data)
  computerList.value = await http.get('/computer/search?query=&limit=200').then(r => r.data)
})

watch(() => props.student, (newVal) => {
  if (newVal) form.value = { ...newVal }
  else form.value = { name: '', vorname: '', idmAccount: '', fauEmail: '', rechner: '', betriebssystem: '' }
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
    alert(e?.response?.data?.error || 'Fehler')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.modal-backdrop { z-index: 1040 !important; }
.modal { z-index: 1050 !important; }
</style>
