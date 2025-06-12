<template>
  <div class="container py-4">
    <h2 class="mb-4"><i class="bi bi-pc-display-horizontal me-2"></i>Neuen Computer anlegen</h2>

    <form @submit.prevent="submit" class="needs-validation" novalidate>
      <div class="accordion shadow-sm rounded overflow-hidden" id="computerForm">

        <!-- Accordion-Section -->
        <AccordionSection title="💻 Computerinformationen" id="hardware" :open="true">
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
        </AccordionSection>

        <AccordionSection title="💽 Betriebssystem" id="os">
          <div class="row g-3">
            <FormSelect label="Betriebssystem" v-model="computer.betriebssystem" :items="osList" />
            <Field label="Version" v-model="computer.version" />
            <Field label="Abstraktionsebene" v-model="computer.abstraktionsebene" />
          </div>
        </AccordionSection>

        <AccordionSection title="🌐 Netzwerkinformationen" id="network">
          <div class="row g-3">
            <Field label="DNS-Name" v-model="computer.dnsName" />
            <Field label="IP-Adresse" v-model="computer.ipAdresse" />
            <Field label="MAC-Adresse" v-model="computer.macAdresse" />
            <FormSelect label="DHCP" v-model="computer.dhcp" :items="[{ _id: 'ja', name: 'ja' }, { _id: 'nein', name: 'nein' }]" />
          </div>
        </AccordionSection>

        <AccordionSection title="👤 Benutzerinformationen" id="user">
          <div class="row g-3">
            <Field label="Benutzer" v-model="computer.benutzer" />
            <Field label="IdM-Kennung" v-model="computer.idmKennung" />
            <Field label="Betreuer" v-model="computer.betreuer" />
            <Field label="Art der Arbeit" v-model="computer.artDerArbeit" />
            <FormDate label="Startdatum" v-model="computer.startdatum" />
            <FormDate label="Abgabe" v-model="computer.abgabe" />
          </div>
        </AccordionSection>

        <AccordionSection title="🏢 Rauminformationen" id="room">
          <div class="row g-3">
            <Field label="Raumnummer" v-model="computer.raumnummer" />
            <FormSelect label="Kategorie" v-model="computer.kategorie" :items="kategorieList" />
            <Field label="Laufende Nummer" type="number" v-model="computer.laufendeNummer" />
            <Field label="StudPCs" type="number" v-model="computer.studPCs" />
          </div>
        </AccordionSection>

        <AccordionSection title="💸 Beschaffung" id="procurement">
          <div class="row g-3">
            <Field label="Inventarnummer" type="number" v-model="computer.inventarnummer" />
            <Field label="FAU-Inventarnummer" v-model="computer.fauInventarnummer" />
            <Field label="Beschaffungsjahr" type="number" v-model="computer.beschaffungsjahr" />
            <Field label="Wann ersetzen" v-model="computer.wannErsetzen" />
            <Field label="Studienzuschuss (Jahr)" type="number" v-model="computer.studienzuschuss" />
          </div>
        </AccordionSection>

        <AccordionSection title="🗂️ Sonstige Informationen" id="misc">
          <div class="row g-3">
            <Field label="Info" v-model="computer.info" />
            <Field label="ToDo" v-model="computer.todo" />
            <Field label="Ablauf" v-model="computer.ablauf" />
          </div>
        </AccordionSection>

      </div>

      <div class="text-end mt-4">
        <button class="btn btn-success shadow-sm">
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
import AccordionSection from '../components/AccordionSection.vue'

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

onMounted(async () => {
  try {
    const osRes = await http.get('/betriebssystem')
    const katRes = await http.get('/kategorie')

    osList.value = osRes.data

    // 🛠️ Mapping für FormSelect-kompatibles Format
    kategorieList.value = katRes.data.map(k => ({
      _id: k._id,
      name: k.bezeichnung // 👈 genau hier
    }))
  } catch (err) {
    showToast('Fehler beim Laden von Optionen', 'danger')
  }
})

const submit = async () => {
  try {
    await http.post('/computer', computer.value)
    showToast('✅ Computer erfolgreich gespeichert')
    router.push('/computer')
  } catch (err) {
    showToast('❌ Fehler beim Speichern', 'danger')
  }
}
</script>
