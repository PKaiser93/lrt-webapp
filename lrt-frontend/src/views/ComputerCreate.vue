<template>
  <div class="container py-4">
    <h2>🖥️ Neuen Computer anlegen</h2>
    <form @submit.prevent="submit">
      <div class="accordion" id="computerForm">

        <!-- 1. Computerinformationen -->
        <div class="accordion-item">
          <h2 class="accordion-header">
            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#hardware">
              💻 Computerinformationen
            </button>
          </h2>
          <div id="hardware" class="accordion-collapse collapse show">
            <div class="accordion-body row">
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
        </div>

        <!-- 2. Betriebssystem -->
        <div class="accordion-item">
          <h2 class="accordion-header">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#os">
              💽 Betriebssystem
            </button>
          </h2>
          <div id="os" class="accordion-collapse collapse">
            <div class="accordion-body row">
              <FormSelect label="Betriebssystem" v-model="computer.betriebssystem" :items="osList" />
              <Field label="Version" v-model="computer.version" />
              <Field label="Abstraktionsebene" v-model="computer.abstraktionsebene" />
            </div>
          </div>
        </div>

        <!-- 3. Netzwerk -->
        <div class="accordion-item">
          <h2 class="accordion-header">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#network">
              🌐 Netzwerkinformationen
            </button>
          </h2>
          <div id="network" class="accordion-collapse collapse">
            <div class="accordion-body row">
              <Field label="DNS-Name" v-model="computer.dnsName" />
              <Field label="IP-Adresse" v-model="computer.ipAdresse" />
              <Field label="MAC-Adresse" v-model="computer.macAdresse" />
              <FormSelect
                  label="DHCP"
                  v-model="computer.dhcp"
                  :items="[{ _id: 'ja', name: 'ja' }, { _id: 'nein', name: 'nein' }]"
              />
            </div>
          </div>
        </div>

        <!-- 4. Benutzer -->
        <div class="accordion-item">
          <h2 class="accordion-header">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#user">
              👤 Benutzerinformationen
            </button>
          </h2>
          <div id="user" class="accordion-collapse collapse">
            <div class="accordion-body row">
              <Field label="Benutzer" v-model="computer.benutzer" />
              <Field label="IdM-Kennung" v-model="computer.idmKennung" />
              <Field label="Betreuer" v-model="computer.betreuer" />
              <Field label="Art der Arbeit" v-model="computer.artDerArbeit" />
              <FormDate label="Startdatum" v-model="computer.startdatum" />
              <FormDate label="Abgabe" v-model="computer.abgabe" />
            </div>
          </div>
        </div>

        <!-- 5. Raum -->
        <div class="accordion-item">
          <h2 class="accordion-header">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#room">
              🏢 Rauminformationen
            </button>
          </h2>
          <div id="room" class="accordion-collapse collapse">
            <div class="accordion-body row">
              <Field label="Raumnummer" v-model="computer.raumnummer" />
              <FormSelect label="Kategorie" v-model="computer.kategorie" :items="kategorieList" />
              <Field label="Laufende Nummer" type="number" v-model="computer.laufendeNummer" />
              <Field label="StudPCs" type="number" v-model="computer.studPCs" />
            </div>
          </div>
        </div>

        <!-- 6. Beschaffung -->
        <div class="accordion-item">
          <h2 class="accordion-header">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#procurement">
              💸 Beschaffung
            </button>
          </h2>
          <div id="procurement" class="accordion-collapse collapse">
            <div class="accordion-body row">
              <Field label="Inventarnummer" type="number" v-model="computer.inventarnummer" />
              <Field label="FAU-Inventarnummer" v-model="computer.fauInventarnummer" />
              <Field label="Beschaffungsjahr" type="number" v-model="computer.beschaffungsjahr" />
              <Field label="Wann ersetzen" v-model="computer.wannErsetzen" />
              <Field label="Studienzuschuss (Jahr)" type="number" v-model="computer.studienzuschuss" />
            </div>
          </div>
        </div>

        <!-- 7. Sonstiges -->
        <div class="accordion-item">
          <h2 class="accordion-header">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#misc">
              🗂️ Sonstige Informationen
            </button>
          </h2>
          <div id="misc" class="accordion-collapse collapse">
            <div class="accordion-body row">
              <Field label="Info" v-model="computer.info" />
              <Field label="ToDo" v-model="computer.todo" />
              <Field label="Ablauf" v-model="computer.ablauf" />
            </div>
          </div>
        </div>

      </div>

      <div class="mt-4 text-end">
        <button class="btn btn-success">
          <i class="bi bi-save me-1"></i> Speichern
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import http from '../api/http'
import { useRouter } from 'vue-router'
import { showToast } from '../utils/toast'

import Field from '../components/FormField.vue'
import FormSelect from '../components/FormSelect.vue'
import FormDate from '../components/FormDate.vue'

const computer = ref({})
const osList = ref([])
const kategorieList = ref([])
const router = useRouter()

onMounted(async () => {
  try {
    osList.value = (await http.get('/betriebssystem')).data
    kategorieList.value = (await http.get('/kategorie')).data
  } catch (err) {
    showToast('Fehler beim Laden von Optionen', 'danger')
  }
})

const submit = async () => {
  try {
    await http.post('/computer', computer.value)
    showToast('Computer erfolgreich gespeichert')
    router.push('/computer')
  } catch (err) {
    showToast('Fehler beim Speichern', 'danger')
  }
}
</script>
