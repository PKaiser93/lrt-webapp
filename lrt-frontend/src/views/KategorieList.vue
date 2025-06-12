<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">📂 Kategorien</h2>
      <router-link to="/kategorie/trash" class="btn btn-outline-secondary shadow-sm">
        🗑️ Papierkorb anzeigen
      </router-link>
    </div>

    <div class="card shadow-sm rounded-4">
      <div class="card-body p-0">
        <table class="table table-hover align-middle mb-0 table-striped">
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
                <router-link :to="'/kategorie/' + k._id" class="btn btn-sm btn-outline-primary">
                  ✏️ Bearbeiten
                </router-link>
                <button @click="softDelete(k._id)" class="btn btn-sm btn-outline-danger">
                  🗑️ Löschen
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import http from '../api/http'
import { showToast } from '../utils/toast'

const kategorien = ref([])

const load = async () => {
  try {
    kategorien.value = (await http.get('/kategorie')).data
  } catch {
    showToast('Fehler beim Laden der Kategorien', 'danger')
  }
}

const softDelete = async (id) => {
  if (!confirm('Wirklich löschen?')) return
  try {
    await http.delete(`/kategorie/${id}`)
    showToast('Kategorie verschoben in den Papierkorb')
    await load()
  } catch {
    showToast('Fehler beim Löschen', 'danger')
  }
}

onMounted(load)
</script>
