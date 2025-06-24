<template>
  <div class="kategorie-wrapper container py-4">
    <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
      <h2 class="mb-0 text-gradient fw-bold d-flex align-items-center gap-2">
        <i class="bi bi-trash3"></i> Gelöschte Kategorien
      </h2>
      <button
          class="btn btn-danger d-flex align-items-center gap-2 shadow-sm rounded-pill"
          @click="deleteAll"
      >
        <i class="bi bi-trash-fill"></i> Alle endgültig löschen
      </button>
    </div>

    <div class="card shadow-sm rounded-4">
      <div class="card-body p-0">
        <table class="table mb-0">
          <thead>
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
                    class="badge d-inline-flex align-items-center gap-1"
                    :style="{
                    backgroundColor: k.farbe,
                    color: colorForBadge(k.farbe),
                    border: '1px solid var(--clr-border)'
                  }"
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
                    class="btn btn-outline-success btn-sm"
                    @click="restore(k._id)"
                    title="Wiederherstellen"
                >
                  <i class="bi bi-arrow-counterclockwise"></i>
                </button>
                <button
                    class="btn btn-outline-danger btn-sm"
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
            <td colspan="5" class="text-center text-secondary py-5">
              <i class="bi bi-emoji-frown fs-3 mb-2 d-block"></i>
              Keine gelöschten Kategorien vorhanden.
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
import http from '@/shared/api/http'
import { useToastStore } from '@/shared/stores/toast'

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
  background: var(--clr-bg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-light);
  margin-top: var(--space-lg);
  padding: var(--space-md);
}

.text-gradient {
  background: linear-gradient(90deg, var(--clr-primary-start), var(--clr-primary-end));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.card {
  border-radius: var(--radius-lg);
  overflow: hidden;
}

/* kompakte Tabelle mit euren globalen Abständen */
.table {
  width: 100%;
  border-collapse: collapse;
}
.table thead th {
  background: var(--clr-card-bg);
  border-bottom: 2px solid var(--clr-border);
  padding: var(--space-sm) var(--space-md);
  font-weight: 600;
  text-align: left;
}
.table tbody td {
  padding: var(--space-sm) var(--space-md);
  border-bottom: 1px solid var(--clr-border);
  vertical-align: middle;
}
.table tbody tr:last-child td {
  border-bottom: none;
}
.table tbody tr:hover {
  background: rgba(79,147,255,0.05);
}

/* Buttons kompakt */
.btn-outline-success,
.btn-outline-danger {
  padding: 0.35rem 0.6rem;
  font-size: var(--fs-sm);
  border-radius: var(--radius-sm);
}

/* Badges im globalen Stil */
.badge {
  border-radius: var(--radius-md);
  font-size: var(--fs-sm);
  padding: var(--space-xs) var(--space-sm);
}

@media (max-width: 700px) {
  .kategorie-wrapper {
    padding: var(--space-sm);
  }
  .table thead th,
  .table tbody td {
    padding: var(--space-xs) var(--space-sm);
    font-size: var(--fs-xs);
  }
}
</style>
