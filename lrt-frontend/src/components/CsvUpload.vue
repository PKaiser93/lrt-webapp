<template>
  <form @submit.prevent="upload">
    <input type="file" @change="handleFile" />
    <button type="submit">CSV hochladen</button>
  </form>
</template>

<script setup>
import http from '../api/http'
import { ref } from 'vue'

const file = ref(null)

const handleFile = (e) => {
  file.value = e.target.files[0]
}

const upload = async () => {
  const formData = new FormData()
  formData.append('file', file.value)
  await http.post('/csv', formData)
  alert('CSV importiert!')
}
</script>
