<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">🗑️ Gelöschte Betriebssysteme</h2>
      <button class="btn btn-danger shadow-sm" @click="deleteAll">
        <i class="bi bi-trash-fill me-1"></i> Alle endgültig löschen
      </button>
    </div>

    <div v-if="osList.length">
      <table class="table table-striped table-hover shadow-sm rounded">
        <thead class="table-light">
        <tr>
          <th class="align-middle">💽 Name</th>
          <th class="align-middle text-end">Aktionen</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="os in osList" :key="os._id">
          <td>{{ os.name }}</td>
          <td class="text-end">
            <button class="btn btn-sm btn-outline-success me-2" @click="restore(os._id)">
              <i class="bi bi-arrow-counterclockwise"></i> Wiederherstellen
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="text-center text-muted mt-4">
      <i class="bi bi-inbox fs-3"></i>
      <p class="mt-2">Keine gelöschten Betriebssysteme gefunden.</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import http from '../api/http'
import { showToast } from '../utils/toast'

const osList = ref([])

const load = async () => {
  try {
    const res = await http.get('/betriebssystem/trash')
    osList.value = res.data
  } catch (err) {
    showToast('Fehler beim Laden der gelöschten Betriebssysteme', 'danger')
  }
}

const restore = async (id) => {
  try {
    await http.patch(`/betriebssystem/${id}/restore`)
    showToast('✔️ Betriebssystem wiederhergestellt')
    await load()
  } catch (err) {
    showToast('❌ Fehler beim Wiederherstellen', 'danger')
  }
}

const deleteAll = async () => {
  if (!confirm('Wirklich ALLE gelöschten Betriebssysteme unwiderruflich löschen?')) return
  try {
    const res = await http.delete('/betriebssystem/trash')
    showToast(res.data.message || '🧹 Alle Betriebssysteme gelöscht')
    await load()
  } catch (err) {
    showToast('❌ Fehler beim endgültigen Löschen', 'danger')
  }
}

onMounted(load)
</script>
