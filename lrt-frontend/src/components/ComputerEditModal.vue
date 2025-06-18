<template>
  <div class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0, 0, 0, 0.5);">
    <div class="modal-dialog modal-xl modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">🛠️ Computer bearbeiten</h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submit">
            <div class="accordion" id="editAccordion">

              <!-- Beispiel: Computerinformationen -->
              <div class="accordion-item">
                <h2 class="accordion-header">
                  <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#editHardware">
                    💻 Computerinformationen
                  </button>
                </h2>
                <div id="editHardware" class="accordion-collapse collapse show">
                  <div class="accordion-body row">
                    <Field label="Marke" v-model="form.marke" />
                    <Field label="Typ" v-model="form.typ" />
                    <Field label="Seriennummer" v-model="form.seriennummer" />
                    <Field label="CPU" v-model="form.cpu" />
                    <Field label="RAM" v-model="form.ram" />
                    <Field label="HDD/SSD" v-model="form.hddssd" />
                    <Field label="Grafikkarte" v-model="form.grafikkarte" />
                    <Field label="Chipsatz" v-model="form.chipsatz" />
                    <Field label="TPM" v-model="form.tpm" />
                    <Field label="BIOS" v-model="form.bios" />
                    <Field label="Remote" v-model="form.remote" />
                  </div>
                </div>
              </div>

              <!-- Betriebssystem -->
              <div class="accordion-item">
                <h2 class="accordion-header">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#editOS">
                    💽 Betriebssystem
                  </button>
                </h2>
                <div id="editOS" class="accordion-collapse collapse">
                  <div class="accordion-body row">
                    <FormSelect label="Betriebssystem" v-model="form.betriebssystem" :items="osList" />
                    <Field label="Version" v-model="form.version" />
                    <Field label="Abstraktionsebene" v-model="form.abstraktionsebene" />
                  </div>
                </div>
              </div>

              <!-- Netzwerk -->
              <div class="accordion-item">
                <h2 class="accordion-header">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#editNetwork">
                    🌐 Netzwerkinformationen
                  </button>
                </h2>
                <div id="editNetwork" class="accordion-collapse collapse">
                  <div class="accordion-body row">
                    <Field label="DNS-Name" v-model="form.dnsName" />
                    <Field label="IP-Adresse" v-model="form.ipAdresse" />
                    <Field label="MAC-Adresse" v-model="form.macAdresse" />
                    <FormSelect
                        label="DHCP"
                        v-model="form.dhcp"
                        :items="[{ _id: 'ja', name: 'ja' }, { _id: 'nein', name: 'nein' }]"
                    />
                  </div>
                </div>
              </div>

              <!-- Benutzer -->
              <div class="accordion-item">
                <h2 class="accordion-header">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#editUser">
                    👤 Benutzerinformationen
                  </button>
                </h2>
                <div id="editUser" class="accordion-collapse collapse">
                  <div class="accordion-body row">
                    <Field label="Benutzer" v-model="form.benutzer" />
                    <Field label="IdM-Kennung" v-model="form.idmKennung" />
                    <Field label="Betreuer" v-model="form.betreuer" />
                    <Field label="Art der Arbeit" v-model="form.artDerArbeit" />
                    <FormDate label="Startdatum" v-model="form.startdatum" />
                    <FormDate label="Abgabe" v-model="form.abgabe" />
                  </div>
                </div>
              </div>

              <!-- Raum -->
              <div class="accordion-item">
                <h2 class="accordion-header">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#editRoom">
                    🏢 Rauminformationen
                  </button>
                </h2>
                <div id="editRoom" class="accordion-collapse collapse">
                  <div class="accordion-body row">
                    <Field label="Raumnummer" v-model="form.raumnummer" />
                    <FormSelect label="Kategorie" v-model="form.kategorie" :items="kategorieList" />
                    <Field label="Laufende Nummer" type="number" v-model="form.laufendeNummer" />
                    <Field label="StudPCs" type="number" v-model="form.studPCs" />
                  </div>
                </div>
              </div>

              <!-- Beschaffung -->
              <div class="accordion-item">
                <h2 class="accordion-header">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#editProc">
                    💸 Beschaffung
                  </button>
                </h2>
                <div id="editProc" class="accordion-collapse collapse">
                  <div class="accordion-body row">
                    <Field label="Inventarnummer" type="number" v-model="form.inventarnummer" />
                    <Field label="FAU-Inventarnummer" v-model="form.fauInventarnummer" />
                    <Field label="Beschaffungsjahr" type="number" v-model="form.beschaffungsjahr" />
                    <Field label="Wann ersetzen" v-model="form.wannErsetzen" />
                    <Field label="Studienzuschuss (Jahr)" type="number" v-model="form.studienzuschuss" />
                  </div>
                </div>
              </div>

              <!-- Sonstiges -->
              <div class="accordion-item">
                <h2 class="accordion-header">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#editMisc">
                    🗂️ Sonstige Informationen
                  </button>
                </h2>
                <div id="editMisc" class="accordion-collapse collapse">
                  <div class="accordion-body row">
                    <Field label="Info" v-model="form.info" />
                    <Field label="ToDo" v-model="form.todo" />
                    <Field label="Ablauf" v-model="form.ablauf" />
                  </div>
                </div>
              </div>

            </div>

            <div class="mt-4 text-end">
              <button class="btn btn-success">
                <i class="bi bi-save me-1"></i> Änderungen speichern
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import http from '@/api/http'
import { useToastStore } from '@/stores/toast'

import Field from './FormField.vue'
import FormSelect from './FormSelect.vue'
import FormDate from './FormDate.vue'

const props = defineProps({ computer: Object })
const emit = defineEmits(['close'])

const osList = ref([])
const kategorieList = ref([])

// Deep Copy, damit props nicht direkt verändert werden
const form = reactive(JSON.parse(JSON.stringify(props.computer)))

onMounted(async () => {
  osList.value = (await http.get('/betriebssystem')).data
  kategorieList.value = (await http.get('/kategorie')).data
})

const submit = async () => {
  try {
    await http.patch(`/computer/${form._id}`, form)
    showToast('Computer gespeichert')
    emit('close')
  } catch (err) {
    showToast('Fehler beim Speichern', 'danger')
  }
}
</script>
