<template>
  <div class="kategorie-wrapper container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4 gap-2 flex-wrap">
      <h2 class="mb-0 text-gradient fw-bold">
        <i class="bi bi-trash3 me-2"></i> Gelöschte Kategorien
      </h2>
      <button
          class="btn btn-danger d-flex align-items-center gap-2 shadow-sm rounded-pill"
          @click="deleteAll"
      >
        <i class="bi bi-trash-fill"></i> Alle endgültig löschen
      </button>
    </div>

    <div class="card shadow-sm rounded-4 border-0">
      <div class="card-body p-0">
        <table class="table table-hover align-middle mb-0 table-striped">
          <thead class="table-light">
          <tr>
            <th style="min-width:130px;">Bezeichnung</th>
            <th>Beschreibung</th>
            <th>Farbe</th>
            <th>Status</th>
            <th class="text-end pe-4">Aktionen</th>
          </tr>
          </thead>
          <tbody v-if="kategorien.length">
          <tr v-for="k in kategorien" :key="k._id">
            <td class="fw-semibold">{{ k.bezeichnung }}</td>
            <td class="text-muted small">
              <span v-if="k.beschreibung">{{ k.beschreibung }}</span>
              <span v-else class="fst-italic text-secondary">–</span>
            </td>
            <td>
                <span
                    class="badge shadow-sm px-2 d-inline-flex align-items-center gap-1"
                    :style="{ backgroundColor: k.farbe, color: colorForBadge(k.farbe) }"
                >
                  <i class="bi bi-droplet-half"></i>
                  {{ k.farbe }}
                </span>
            </td>
            <td>
                <span
                    v-if="k.deleted"
                    class="badge bg-danger-subtle text-danger d-inline-flex align-items-center gap-1"
                >
                  <i class="bi bi-trash3"></i> Gelöscht
                </span>
              <span
                  v-else
                  class="badge bg-success-subtle text-success d-inline-flex align-items-center gap-1"
              >
                  <i class="bi bi-check-circle"></i> Aktiv
                </span>
            </td>
            <td class="text-end pe-4">
              <div class="d-inline-flex gap-1">
                <button
                    class="btn btn-sm btn-outline-success d-flex align-items-center"
                    @click="restore(k._id)"
                    title="Wiederherstellen"
                >
                  <i class="bi bi-arrow-counterclockwise"></i>
                </button>
                <button
                    class="btn btn-sm btn-outline-danger d-flex align-items-center"
                    @click="deleteSingle(k._id)"
                    title="Endgültig löschen"
                >
                  <i class="bi bi-x-circle"></i>
                </button>
              </div>
            </td>
          </tr>
          </tbody>
          <tbody v-else>
          <tr>
            <td colspan="5" class="text-center text-muted py-5">
              <i class="bi bi-emoji-frown me-2"></i>Keine gelöschten Kategorien vorhanden.
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useToastStore } from '@/stores/toast'
import http from '@/api/http'

const toast = useToastStore()
const kategorien = ref([])

const load = async () => {
  try {
    const res = await http.get('/kategorie/trash/list')
    kategorien.value = res.data
  } catch {
    toast.show('Fehler beim Laden des Papierkorbs', 'danger')
  }
}

const restore = async (id) => {
  try {
    await http.patch(`/kategorie/${id}/restore`)
    toast.show('Kategorie wiederhergestellt', 'success')
    await load()
  } catch {
    toast.show('Fehler beim Wiederherstellen', 'danger')
  }
}

const deleteAll = async () => {
  if (!confirm('Wirklich alle gelöschten Kategorien endgültig löschen?')) return
  try {
    const res = await http.delete('/kategorie/trash')
    toast.show(res.data.message, 'success')
    await load()
  } catch {
    toast.show('Fehler beim endgültigen Löschen', 'danger')
  }
}

const deleteSingle = async (id) => {
  if (!confirm('Wirklich diese Kategorie endgültig löschen?')) return
  try {
    await http.delete(`/kategorie/${id}`)
    toast.show('Kategorie dauerhaft gelöscht', 'success')
    await load()
  } catch {
    toast.show('Fehler beim endgültigen Löschen', 'danger')
  }
}

// Dynamisch kontrastierende Farbe für Badge
function colorForBadge(hex) {
  if (!hex) return '#333'
  let c = hex.replace('#', '')
  if (c.length === 3) c = c.split('').map(x => x + x).join('')
  const rgb = parseInt(c, 16)
  const r = (rgb >> 16) & 0xff,
      g = (rgb >> 8) & 0xff,
      b = rgb & 0xff
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b
  return luminance > 140 ? '#111' : '#fff'
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
.d-inline-flex.gap-1 > *:not(:last-child) {
  margin-right: .35rem;
}
@media (max-width: 700px) {
  .kategorie-wrapper {
    padding: 12px 2px !important;
  }
}
</style>
