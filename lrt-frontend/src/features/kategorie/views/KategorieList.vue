<template>
  <div class="kategorie-wrapper container py-4">
    <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
      <h2 class="mb-0 text-gradient fw-bold d-flex align-items-center gap-2">
        <i class="bi bi-tags"></i>
        Kategorien
      </h2>
      <div class="d-flex flex-wrap gap-2">
        <button class="btn btn-gradient d-flex align-items-center gap-2 shadow-sm" @click="openForm()">
          <i class="bi bi-plus-circle"></i>
        </button>
        <router-link
            to="/kategorie/trash"
            class="btn btn-outline-gradient d-flex align-items-center gap-2 shadow-sm"
        >
          <i class="bi bi-trash3"></i>
        </router-link>
      </div>
    </div>

    <KategorieFormModal
        v-if="showForm"
        :editItem="editItem"
        @close="closeForm"
        @saved="saveKategorie"
    />

    <div class="card shadow-sm rounded-4">
      <div class="card-body p-0 kategorien-card-body">
        <table class="table mb-0">
          <thead>
          <tr>
            <th style="min-width:130px;">Bezeichnung</th>
            <th>Beschreibung</th>
            <th>Farbe</th>
            <th class="text-end pe-4">Aktionen</th>
          </tr>
          </thead>
          <tbody v-if="kategorien.length">
          <tr v-for="k in kategorien" :key="k._id">
            <td class="fw-semibold">
              <div class="d-flex align-items-center gap-2">
                <i class="bi bi-tag-fill text-primary"></i>
                {{ k.bezeichnung }}
              </div>
            </td>
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
            <td class="text-end pe-4">
              <button
                  @click="openForm(k)"
                  class="btn btn-outline-primary btn-sm me-1"
                  title="Bearbeiten"
              >
                <i class="bi bi-pencil"></i>
              </button>
              <button
                  @click="softDelete(k._id)"
                  class="btn btn-outline-danger btn-sm"
                  title="Löschen"
              >
                <i class="bi bi-trash3"></i>
              </button>
            </td>
          </tr>
          </tbody>
          <tbody v-else>
          <tr>
            <td colspan="4" class="text-center text-secondary py-5">
              <i class="bi bi-emoji-frown fs-3 mb-2 d-block"></i>
              Keine Kategorien vorhanden
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
import KategorieFormModal from '@/features/kategorie/components/KategorieForm.vue'

const toast = useToastStore()
const showForm = ref(false)
const editItem = ref(null)
const kategorien = ref([])

function openForm(item = null) {
  editItem.value = item
  showForm.value = true
}
function closeForm() {
  showForm.value = false
  editItem.value = null
}

async function saveKategorie(data) {
  try {
    if (data._id) {
      await http.patch(`/kategorie/${data._id}`, data)
      toast.show('Kategorie aktualisiert', 'success')
    } else {
      await http.post('/kategorie', data)
      toast.show('Kategorie angelegt', 'success')
    }
    closeForm()
    await load()
  } catch {
    toast.show('Fehler beim Speichern', 'danger')
  }
}

async function load() {
  try {
    kategorien.value = (await http.get('/kategorie')).data
  } catch {
    toast.show('Fehler beim Laden der Kategorien', 'danger')
  }
}

async function softDelete(id) {
  if (!confirm('Wirklich löschen?')) return
  try {
    await http.patch(`/kategorie/${id}/soft-delete`)
    toast.show('Kategorie in den Papierkorb verschoben', 'success')
    await load()
  } catch {
    toast.show('Fehler beim Löschen', 'danger')
  }
}

function colorForBadge(hex) {
  if (!hex) return '#333'
  let c = hex.replace('#','')
  if (c.length === 3) c = c.split('').map(x=>x+x).join('')
  const rgb = parseInt(c,16)
  const r = (rgb>>16)&0xff, g = (rgb>>8)&0xff, b = rgb&0xff
  const lum = 0.2126*r + 0.7152*g + 0.0722*b
  return lum>140 ? '#111' : '#fff'
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

/* spezielles Padding für den Card-Body */
.kategorien-card-body {
  padding: 0;
}

/* Tabelle: kompakt, klare Linien */
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

/* compact action buttons */
.btn-outline-primary,
.btn-outline-danger {
  padding: 0.35rem 0.6rem;
  font-size: var(--fs-sm);
  border-radius: var(--radius-sm);
}

/* badge styling */
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
