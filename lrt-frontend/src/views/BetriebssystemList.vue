<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">💽 Betriebssysteme</h2>
      <div>
        <router-link to="/betriebssystem/neu" class="btn btn-primary me-2 shadow-sm">
          <i class="bi bi-plus-circle me-1"></i> Hinzufügen
        </router-link>
        <router-link to="/betriebssystem/trash" class="btn btn-outline-secondary shadow-sm">
          <i class="bi bi-trash3 me-1"></i> Papierkorb
        </router-link>
      </div>
    </div>

    <div v-if="betriebssysteme.length" class="row g-3">
      <div class="col-md-4" v-for="os in betriebssysteme" :key="os._id">
        <div class="card shadow-sm rounded-4">
          <div class="card-body d-flex justify-content-between align-items-center">
            <h5 class="mb-0">
              <i class="bi bi-cpu me-2"></i>{{ os.name }}
            </h5>
            <div class="btn-group">
              <router-link
                  :to="'/betriebssystem/' + os._id"
                  class="btn btn-sm btn-outline-primary"
              >
                ✏️ Bearbeiten
              </router-link>
              <button class="btn btn-sm btn-outline-danger" @click="softDelete(os._id)">
                🗑️ Löschen
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="alert alert-secondary mt-3">
      Keine Betriebssysteme vorhanden.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import http from '../api/http'
import { showToast } from '../utils/toast'

const betriebssysteme = ref([])

const load = async () => {
  try {
    const res = await http.get('/betriebssystem')
    betriebssysteme.value = res.data
  } catch {
    showToast('❌ Fehler beim Laden der Betriebssysteme', 'danger')
  }
}

const softDelete = async (id) => {
  if (!confirm('Wirklich löschen?')) return
  try {
    await http.delete(`/betriebssystem/${id}`)
    showToast('🗑️ In Papierkorb verschoben')
    load()
  } catch {
    showToast('❌ Fehler beim Löschen', 'danger')
  }
}

onMounted(load)
</script>
