<template>
  <div class="os-wrapper container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
      <h2 class="mb-0 text-gradient fw-bold"><i class="bi bi-cpu me-2"></i>Betriebssysteme</h2>
      <div class="d-flex gap-2">
        <router-link to="/betriebssystem/neu" class="btn btn-primary shadow-sm">
          <i class="bi bi-plus-circle me-1"></i> Hinzufügen
        </router-link>
        <router-link to="/betriebssystem/trash" class="btn btn-outline-secondary shadow-sm">
          <i class="bi bi-trash3 me-1"></i> Papierkorb
        </router-link>
      </div>
    </div>

    <!-- Ladeindikator & Fehleranzeige -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"><span class="visually-hidden">Lade...</span></div>
    </div>
    <div v-else>
      <div v-if="error" class="alert alert-danger mb-3">{{ error }}</div>

      <div v-if="betriebssysteme.length" class="row g-4">
        <div class="col-12 col-md-6 col-lg-4" v-for="os in betriebssysteme" :key="os._id">
          <div class="card os-card shadow-lg border-0 h-100">
            <div class="card-body d-flex align-items-center justify-content-between">
              <div class="os-info">
                <div class="h5 mb-0 fw-semibold d-flex align-items-center">
                  <i class="bi bi-cpu me-2 text-primary fs-4"></i>{{ os.name }}
                </div>
                <div class="text-muted small mt-1" v-if="os.version">
                  <i class="bi bi-hash"></i> {{ os.version }}
                </div>
              </div>
              <div class="btn-group">
                <router-link
                    :to="'/betriebssystem/' + os._id"
                    class="btn btn-sm btn-outline-primary"
                    title="Bearbeiten"
                >
                  <i class="bi bi-pencil-square"></i>
                </router-link>
                <button
                    class="btn btn-sm btn-outline-danger"
                    @click="softDelete(os._id)"
                    :disabled="deletingId === os._id"
                    title="Löschen"
                >
                  <span v-if="deletingId === os._id" class="spinner-border spinner-border-sm"></span>
                  <span v-else><i class="bi bi-trash3"></i></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="alert alert-secondary mt-3 shadow-sm rounded-3 text-center py-4">
        <i class="bi bi-info-circle me-2"></i>Keine Betriebssysteme vorhanden.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import http from '../api/http'
import { showToast } from '../utils/toast'

const betriebssysteme = ref([])
const loading = ref(false)
const error = ref('')
const deletingId = ref(null)

const load = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await http.get('/betriebssystem')
    betriebssysteme.value = res.data
  } catch (err) {
    showToast('❌ Fehler beim Laden der Betriebssysteme', 'danger')
    error.value = err?.response?.data?.error || err?.message || 'Unbekannter Fehler'
  } finally {
    loading.value = false
  }
}

const softDelete = async (id) => {
  if (!confirm('Wirklich löschen?')) return
  deletingId.value = id
  try {
    await http.delete(`/betriebssystem/${id}`)
    showToast('🗑️ In Papierkorb verschoben')
    await load()
  } catch (err) {
    showToast('❌ Fehler beim Löschen', 'danger')
  } finally {
    deletingId.value = null
  }
}

onMounted(load)
</script>

<style scoped>
.os-wrapper {
  background: #f8fafc;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(44, 62, 80, 0.08);
  padding-top: 48px;
  padding-bottom: 48px;
  margin-top: 30px;
}
.text-gradient {
  background: linear-gradient(90deg, #388bfd 10%, #38d6ae 90%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
}
.os-card {
  border-radius: 1.25rem;
  transition: box-shadow 0.16s;
  box-shadow: 0 2px 14px rgba(120,130,140,.09);
  background: white;
}
.os-card:hover {
  box-shadow: 0 8px 32px rgba(44, 62, 80, 0.15);
  border: 1.5px solid #bae6fd;
}
.btn-group .btn {
  border-radius: 0.75rem !important;
}
.os-info .fs-4 { font-size: 1.6rem !important; }
@media (max-width: 700px) {
  .os-wrapper { padding: 20px 4px; }
  .os-card { border-radius: 1rem; }
}
</style>
