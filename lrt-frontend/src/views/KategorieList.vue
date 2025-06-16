<template>
  <div class="kategorie-wrapper container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4 gap-2 flex-wrap">
      <h2 class="mb-0 text-gradient fw-bold">
        <i class="bi bi-tags me-2"></i>Kategorien
      </h2>
      <router-link to="/kategorie/trash" class="btn btn-outline-secondary shadow-sm rounded-pill">
        <i class="bi bi-trash3 me-1"></i> Papierkorb anzeigen
      </router-link>
    </div>

    <div class="card shadow-sm rounded-4 border-0">
      <div class="card-body p-0">
        <table class="table table-hover align-middle mb-0 table-striped">
          <thead class="table-light">
          <tr>
            <th style="min-width:130px;">Bezeichnung</th>
            <th>Beschreibung</th>
            <th>Farbe</th>
            <th class="text-end pe-4">Aktionen</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="k in kategorien" :key="k._id">
            <td class="fw-semibold">{{ k.bezeichnung }}</td>
            <td class="text-muted small">{{ k.beschreibung }}</td>
            <td>
                <span class="badge shadow-sm"
                      :style="{ backgroundColor: k.farbe, color: colorForBadge(k.farbe) }"
                >
                  <i class="bi bi-droplet-half me-1"></i>{{ k.farbe }}
                </span>
            </td>
            <td class="text-end pe-4">
              <div class="btn-group">
                <router-link :to="'/kategorie/' + k._id"
                             class="btn btn-sm btn-outline-primary"
                             title="Bearbeiten"
                >
                  <i class="bi bi-pencil-square"></i>
                </router-link>
                <button @click="softDelete(k._id)"
                        class="btn btn-sm btn-outline-danger"
                        title="Löschen"
                >
                  <i class="bi bi-trash3"></i>
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

// Dynamisch kontrastierende Farbe für Badge
function colorForBadge(hex) {
  if (!hex) return "#333"
  // Simple Luminanz-Check für hell/dunkel
  let c = hex.replace("#", "")
  if (c.length === 3) c = c.split('').map(x=>x+x).join('')
  const rgb = parseInt(c, 16)
  const r = (rgb >> 16) & 0xff, g = (rgb >> 8) & 0xff, b = rgb & 0xff
  const luminance = 0.2126*r + 0.7152*g + 0.0722*b
  return luminance > 140 ? "#111" : "#fff"
}

onMounted(load)
</script>

<style scoped>
.kategorie-wrapper {
  background: #f8fafc;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(44, 62, 80, 0.07);
  margin-top: 30px;
}
.text-gradient {
  background: linear-gradient(90deg, #ff9360 10%, #388bfd 80%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
}
.card {
  border-radius: 1.3rem;
}
.badge {
  border-radius: 0.8rem;
  font-size: 0.99em;
  padding: 0.6em 1.2em;
  font-weight: 500;
}
.table-hover > tbody > tr:hover {
  background: #f0f4fa !important;
}
.btn {
  border-radius: 0.8rem !important;
}
@media (max-width: 700px) {
  .kategorie-wrapper {
    padding: 12px 2px !important;
  }
}
</style>
