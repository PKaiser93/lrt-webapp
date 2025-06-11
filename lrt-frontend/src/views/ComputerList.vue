<template>
  <div class="container py-4">
    <h2 class="mb-4">🖥️ Computerliste</h2>

    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      <div v-for="pc in computers" :key="pc._id" class="col">
        <div class="card h-100 shadow-sm border-0 rounded-3">
          <div class="card-body">
            <h5 class="card-title">
              <i class="bi bi-hdd-network me-2"></i>{{ pc.dnsName || 'Unbenannt' }}
            </h5>
            <h6 class="card-subtitle mb-2 text-muted">{{ pc.ipAdresse }}</h6>
            <ul class="list-unstyled small mt-3">
              <li><strong>Marke:</strong> {{ pc.marke }}</li>
              <li><strong>Typ:</strong> {{ pc.typ }}</li>
              <li><strong>CPU:</strong> {{ pc.cpu }}</li>
              <li><strong>RAM:</strong> {{ pc.ram }}</li>
              <li><strong>HDD/SSD:</strong> {{ pc.hddssd }}</li>
            </ul>
          </div>
          <div class="card-footer bg-transparent border-0 d-flex justify-content-between">
            <button class="btn btn-outline-primary btn-sm" @click="selected = pc">
              <i class="bi bi-eye"></i> Details
            </button>
            <button class="btn btn-outline-warning btn-sm" @click="edit = pc">
              <i class="bi bi-pencil-square"></i> Bearbeiten
            </button>
          </div>
        </div>
      </div>
    </div>

    <ComputerModal v-if="selected" :computer="selected" @close="selected = null" />
    <ComputerEditModal v-if="edit" :computer="edit" @close="edit = null; fetch()" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import http from '../api/http'
import ComputerModal from '../components/ComputerModal.vue'
import ComputerEditModal from '../components/ComputerEditModal.vue'

const computers = ref([])
const selected = ref(null)
const edit = ref(null)

const fetch = async () => {
  const res = await http.get('/computer')
  computers.value = res.data
}

onMounted(fetch)
</script>
