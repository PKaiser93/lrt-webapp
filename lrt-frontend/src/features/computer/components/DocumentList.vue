<template>
  <div class="document-list mb-3" v-if="documents.length">
    <h5 class="mb-2"><i class="bi bi-paperclip me-2"></i>Dokumente</h5>
    <ul class="list-group shadow-sm">
      <li class="list-group-item d-flex align-items-center justify-content-between" v-for="doc in documents" :key="doc.filename">
        <div class="d-flex align-items-center gap-3">
          <i :class="iconForFile(doc.filename)" class="fs-5"></i>
          <span class="filename">{{ truncate(doc.filename, 34) }}</span>
        </div>
        <div class="btn-group">
          <a :href="doc.url" target="_blank" class="btn btn-sm btn-outline-primary" title="Herunterladen">
            <i class="bi bi-download"></i>
          </a>
          <button class="btn btn-sm btn-outline-danger" @click="deleteDocument(doc)" title="Löschen">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import http from '@/api/http'
import { useToastStore } from '@/stores/toast'

const props = defineProps({ computerId: String })
const documents = ref([]) // [{filename, url}]

const toast = useToastStore()

// Fetch document list
async function fetchDocuments() {
  const res = await http.get(`/computer/${props.computerId}/documents`)
  // Falls dein Backend NUR die Dateinamen schickt, dann URL selbst bauen:
  documents.value = res.data.map(filename => ({
    filename,
    url: `/uploads/${props.computerId}/${filename}`
  }))
}
onMounted(fetchDocuments)

// Kürzen für Anzeige
function truncate(str, len) {
  if (str.length <= len) return str
  return str.slice(0, len - 7) + '...' + str.slice(-7)
}

// Icon je nach Typ
function iconForFile(filename) {
  const ext = filename.split('.').pop().toLowerCase()
  if (['pdf'].includes(ext))   return 'bi bi-file-earmark-pdf text-danger'
  if (['jpg', 'jpeg', 'png'].includes(ext)) return 'bi bi-file-image text-info'
  if (['doc', 'docx'].includes(ext)) return 'bi bi-file-earmark-word text-primary'
  if (['xls', 'xlsx'].includes(ext)) return 'bi bi-file-earmark-excel text-success'
  return 'bi bi-file-earmark'
}

// Löschen mit Abfrage
async function deleteDocument(doc) {
  if (!confirm('Datei wirklich löschen?')) return
  try {
    await http.delete(`/computer/${props.computerId}/documents/${doc.filename}`)
    documents.value = documents.value.filter(d => d.filename !== doc.filename)
    toast.show('Datei gelöscht', 'success')
  } catch (e) {
    toast.show('Fehler beim Löschen', 'danger')
  }
}
</script>

<style scoped>
.document-list {
  background: #fafdff;
  border-radius: 1.1rem;
  box-shadow: 0 2px 12px #3a7bd510;
  padding: 1.2rem 1rem 0.6rem 1rem;
}
.filename {
  font-size: 1.03em;
  word-break: break-all;
}
.list-group-item {
  background: transparent;
  border: none;
}
</style>
