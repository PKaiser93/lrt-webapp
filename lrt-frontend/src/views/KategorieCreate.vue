<template>
  <div class="container py-4">
    <h2>🆕 Neue Kategorie anlegen</h2>
    <form @submit.prevent="submit">
      <Field label="Bezeichnung" v-model="kategorie.bezeichnung" />
      <Field label="Beschreibung" v-model="kategorie.beschreibung" />
      <Field label="Farbe" v-model="kategorie.farbe" type="color" />
      <button class="btn btn-success mt-3">
        <i class="bi bi-save me-1"></i> Speichern
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import http from '../api/http'
import { useRouter } from 'vue-router'
import Field from '../components/FormField.vue'
import { showToast } from '../utils/toast'

const kategorie = ref({
  bezeichnung: '',
  beschreibung: '',
  farbe: '#ff0000'
})

const router = useRouter()

const submit = async () => {
  try {
    await http.post('/kategorie', kategorie.value)
    showToast('Kategorie erfolgreich angelegt')
    router.push('/kategorie')
  } catch (err) {
    showToast('Fehler beim Anlegen', 'danger')
  }
}
</script>
