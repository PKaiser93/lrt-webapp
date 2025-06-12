<template>
  <div class="container py-4">
    <h2>✏️ Betriebssystem bearbeiten</h2>
    <form @submit.prevent="submit">
      <div class="mb-3">
        <label class="form-label">Name</label>
        <input type="text" v-model="os.name" class="form-control" />
      </div>
      <button class="btn btn-success">💾 Speichern</button>
    </form>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import http from '../api/http'
import { showToast } from '../utils/toast'

const route = useRoute()
const router = useRouter()
const os = ref({})

onMounted(async () => {
  const res = await http.get('/betriebssystem')
  const item = res.data.find(e => e._id === route.params.id)
  if (!item) return router.push('/betriebssystem')
  os.value = { ...item }
})

const submit = async () => {
  await http.patch(`/betriebssystem/${route.params.id}`, os.value)
  showToast('✔️ Gespeichert')
  router.push('/betriebssystem')
}
</script>
