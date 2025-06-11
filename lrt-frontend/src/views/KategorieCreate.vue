<template>
  <div class="container py-4">
    <h2>🏷️ Neue Kategorie anlegen</h2>
    <form @submit.prevent="submit">
      <div class="mb-3">
        <label class="form-label">Name</label>
        <input v-model="kategorie.name" class="form-control" />
      </div>
      <div class="mb-3">
        <label class="form-label">Farbe (HEX)</label>
        <input v-model="kategorie.farbe" class="form-control" type="color" />
      </div>
      <button class="btn btn-success">💾 Speichern</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import http from '../api/http'
import { showToast } from '../utils/toast'
import { useRouter } from 'vue-router'

const kategorie = ref({ name: '', farbe: '#000000' })
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
