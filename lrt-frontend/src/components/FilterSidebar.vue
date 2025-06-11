<template>
  <div class="mb-4">
    <div class="input-group mb-2">
      <input v-model="filters.dns" class="form-control" placeholder="DNS-Name" />
    </div>
    <div class="input-group mb-2">
      <input v-model="filters.ram" class="form-control" placeholder="RAM-Größe" />
    </div>
    <select class="form-select mb-3" v-model="filters.kategorie">
      <option value="">Alle Kategorien</option>
      <option v-for="kat in kategorien" :key="kat._id" :value="kat._id">
        {{ kat.name }}
      </option>
    </select>
    <button class="btn btn-primary w-100" @click="$emit('apply', filters)">Filtern</button>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import http from '../api/http'

const filters = ref({ dns: '', ram: '', kategorie: '' })
const kategorien = ref([])

onMounted(async () => {
  const res = await http.get('/kategorie')
  kategorien.value = res.data
})
</script>
