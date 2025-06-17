<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">🗑️ Gelöschte Kategorien</h2>
      <button class="btn btn-danger shadow-sm" @click="deleteAll">
        <i class="bi bi-trash-fill me-1"></i> Alle endgültig löschen
      </button>
    </div>

    <div v-if="kategorien.length">
      <div class="card shadow-sm rounded-4">
        <div class="card-body p-0">
          <table class="table table-striped align-middle mb-0">
            <thead class="table-light">
            <tr>
              <th>Bezeichnung</th>
              <th>Beschreibung</th>
              <th>Farbe</th>
              <th class="text-end pe-4">Aktionen</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="k in kategorien" :key="k._id">
              <td>{{ k.bezeichnung }}</td>
              <td>{{ k.beschreibung }}</td>
              <td>
                  <span class="badge" :style="{ backgroundColor: k.farbe }">
                    {{ k.farbe }}
                  </span>
              </td>
              <td class="text-end pe-4">
                <div class="btn-group">
                  <button class="btn btn-sm btn-outline-success" @click="restore(k._id)">
                    ♻️ Wiederherstellen
                  </button>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-else class="alert alert-secondary mt-3">
      Keine gelöschten Kategorien vorhanden.
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import http from '../../../api/http'
import { showToast } from '../../../utils/toast'

const kategorien = ref([])

const load = async () => {
  try {
    const res = await http.get('/kategorie/trash')
    kategorien.value = res.data
  } catch {
    showToast('Fehler beim Laden des Papierkorbs', 'danger')
  }
}

const restore = async (id) => {
  try {
    await http.patch(`/kategorie/${id}/restore`)
    showToast('✔️ Kategorie wiederhergestellt')
    await load()
  } catch {
    showToast('❌ Fehler beim Wiederherstellen', 'danger')
  }
}

const deleteAll = async () => {
  if (!confirm('Wirklich alle gelöschten Kategorien endgültig löschen?')) return
  try {
    const res = await http.delete('/kategorie/trash')
    showToast(res.data.message)
    await load()
  } catch {
    showToast('❌ Fehler beim endgültigen Löschen', 'danger')
  }
}

onMounted(load)
</script>
