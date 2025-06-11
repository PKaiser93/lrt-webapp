<template>
  <div class="container py-4">
    <h2>💽 Neues Betriebssystem anlegen</h2>
    <form @submit.prevent="submit">
      <div class="mb-3">
        <label class="form-label">Name</label>
        <input v-model="os.name" class="form-control" />
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

const os = ref({ name: '' })
const router = useRouter()

const submit = async () => {
  try {
    await http.post('/betriebssystem', os.value)
    showToast('OS erfolgreich angelegt')
    router.push('/betriebssystem')
  } catch (err) {
    showToast('Fehler beim Anlegen', 'danger')
  }
}
</script>
