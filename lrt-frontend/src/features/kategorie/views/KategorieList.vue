<template>
  <div class="kategorie-wrapper container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4 gap-2 flex-wrap">
      <h2 class="mb-0 text-gradient fw-bold d-flex align-items-center gap-2">
        <i class="bi bi-tags me-2"></i>Kategorien
      </h2>
      <div class="d-flex gap-2 flex-wrap">
        <button class="btn btn-gradient d-flex align-items-center gap-2 shadow-sm" @click="openForm()">
          <i class="bi bi-plus-circle"></i>
        </button>
        <router-link to="/kategorie/trash" class="btn btn-outline-gradient d-flex align-items-center gap-2 shadow-sm">
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
          <tbody v-if="kategorien.length">
          <tr v-for="k in kategorien" :key="k._id">
            <td class="fw-semibold">
              <i class="bi bi-tag-fill me-2 text-primary"></i>
              {{ k.bezeichnung }}
            </td>
            <td class="text-muted small">
              <span v-if="k.beschreibung">{{ k.beschreibung }}</span>
              <span v-else class="fst-italic text-secondary">–</span>
            </td>
            <td>
                <span
                    class="badge shadow-sm px-2 d-inline-flex align-items-center gap-1"
                    :style="{ backgroundColor: k.farbe, color: colorForBadge(k.farbe), border: '1px solid #eef1f7' }"
                >
                  <i class="bi bi-droplet-half"></i>
                  {{ k.farbe }}
                </span>
            </td>
            <td class="text-end pe-4">
              <div class="d-inline-flex gap-1">
                <button
                    @click="openForm(k)"
                    class="btn btn-sm btn-outline-primary d-flex align-items-center"
                    title="Bearbeiten"
                >
                  <i class="bi bi-pencil"></i>
                </button>
                <button
                    @click="softDelete(k._id)"
                    class="btn btn-sm btn-outline-danger d-flex align-items-center"
                    title="Löschen"
                >
                  <i class="bi bi-trash3"></i>
                </button>
              </div>
            </td>
          </tr>
          </tbody>
          <tbody v-else>
          <tr>
            <td colspan="4" class="text-center text-muted py-5">
              <i class="bi bi-emoji-frown me-2"></i>Keine Kategorien vorhanden
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
import http from '@/api/http'
import { useToastStore } from '@/stores/toast'
import KategorieFormModal from '@/features/kategorie/components/KategorieForm.vue'

const toast = useToastStore();

const showForm = ref(false);
const editItem = ref(null);

function openForm(item = null) {
  editItem.value = item;
  showForm.value = true;
}
function closeForm() {
  showForm.value = false;
  editItem.value = null;
}
async function saveKategorie(data) {
  try {
    if (data._id) {
      await http.patch(`/kategorie/${data._id}`, data);
      toast.show('Kategorie aktualisiert', 'success');
    } else {
      await http.post('/kategorie', data);
      toast.show('Kategorie angelegt', 'success');
    }
    closeForm();
    await load();
  } catch {
    toast.show('Fehler beim Speichern', 'danger');
  }
}

const kategorien = ref([])

const load = async () => {
  try {
    kategorien.value = (await http.get('/kategorie')).data
  } catch {
    toast.show('Fehler beim Laden der Kategorien', 'danger')
  }
}

const softDelete = async (id) => {
  if (!confirm('Wirklich löschen?')) return
  try {
    await http.patch(`/kategorie/${id}/soft-delete`)
    toast.show('Kategorie verschoben in den Papierkorb', 'success')
    await load()
  } catch {
    toast.show('Fehler beim Löschen', 'danger')
  }
}

// Dynamisch kontrastierende Farbe für Badge
function colorForBadge(hex) {
  if (!hex) return "#333"
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
  background: linear-gradient(90deg, #388bfd 10%, #38d6ae 90%);
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
  box-shadow: 0 2px 8px #ff936018;
  letter-spacing: .01em;
}
.table-hover > tbody > tr:hover {
  background: #f0f4fa !important;
}
.btn {
  border-radius: 0.8rem !important;
}
.btn-gradient {
  background: linear-gradient(90deg,#3a7bd5,#00d2ff 70%);
  color: #fff;
  font-weight: 600;
  border: none;
  border-radius: 1.2em;
  padding: 8px 22px;
  box-shadow: 0 2px 10px #00d2ff12;
  transition: background 0.2s;
}
.btn-gradient:hover, .btn-gradient:focus {
  background: linear-gradient(90deg,#00d2ff,#3a7bd5 70%);
  color: #fff;
}
.btn-outline-gradient {
  border: 2px solid #3a7bd5;
  color: #3a7bd5;
  background: #fafdff;
  font-weight: 500;
  border-radius: 1.2em;
  transition: background 0.15s, color 0.15s;
}
.btn-outline-gradient:hover, .btn-outline-gradient:focus {
  background: linear-gradient(90deg,#3a7bd5,#00d2ff 70%);
  color: #fff;
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
