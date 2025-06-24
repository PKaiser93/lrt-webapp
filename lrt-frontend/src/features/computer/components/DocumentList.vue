<template>
  <div class="document-list mb-3" v-if="documents.length">
    <h5 class="mb-2 d-flex align-items-center gap-2">
      <i class="bi bi-paperclip"></i> Dokumente
    </h5>
    <ul class="list-group shadow-sm">
      <li
          v-for="doc in documents"
          :key="doc.filename"
          class="list-group-item d-flex align-items-center justify-content-between"
      >
        <div class="d-flex align-items-center gap-2">
          <i :class="iconForFile(doc.filename)" class="fs-5"></i>
          <span class="filename">{{ truncate(doc.filename, 34) }}</span>
        </div>
        <div class="btn-group">
          <a
              :href="doc.url"
              target="_blank"
              class="btn btn-outline-primary btn-sm"
              title="Herunterladen"
          >
            <i class="bi bi-download"></i>
          </a>
          <button
              class="btn btn-outline-danger btn-sm"
              @click="deleteDocument(doc)"
              title="Löschen"
          >
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import http from '@/shared/api/http'
import { useToastStore } from '@/shared/stores/toast'

const props = defineProps({ computerId: String })
const documents = ref([])

const toast = useToastStore()

// Dokumentliste laden
async function fetchDocuments() {
  const res = await http.get(`/computer/${props.computerId}/documents`)
  documents.value = res.data.map(filename => ({
    filename,
    url: `/uploads/${props.computerId}/${filename}`
  }))
}

onMounted(fetchDocuments)

// Text kürzen
function truncate(str, len) {
  if (str.length <= len) return str
  return str.slice(0, len - 7) + '…' + str.slice(-7)
}

// Icon-Auswahl
function iconForFile(filename) {
  const ext = filename.split('.').pop().toLowerCase()
  if (ext === 'pdf') return 'bi bi-file-earmark-pdf text-danger'
  if (['jpg','jpeg','png'].includes(ext)) return 'bi bi-file-image text-info'
  if (['doc','docx'].includes(ext)) return 'bi bi-file-earmark-word text-primary'
  if (['xls','xlsx'].includes(ext)) return 'bi bi-file-earmark-excel text-success'
  return 'bi bi-file-earmark text-secondary'
}

// Löschen
async function deleteDocument(doc) {
  if (!confirm(`Datei "${doc.filename}" wirklich löschen?`)) return
  try {
    await http.delete(`/computer/${props.computerId}/documents/${encodeURIComponent(doc.filename)}`)
    documents.value = documents.value.filter(d => d.filename !== doc.filename)
    toast.show('Datei gelöscht', 'success')
  } catch {
    toast.show('Fehler beim Löschen', 'danger')
  }
}
</script>

<style scoped>
.document-list {
  background: var(--clr-card-bg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-light);
  padding: var(--space-md);
}

.list-group {
  border: none;
}

.list-group-item {
  background: transparent;
  border: 1px solid var(--clr-border);
  border-radius: var(--radius-sm);
  margin-bottom: var(--space-xs);
  padding: var(--space-sm) var(--space-md);
}

.list-group-item:last-child {
  margin-bottom: 0;
}

.filename {
  font-size: var(--fs-md);
  word-break: break-all;
  color: var(--clr-text);
}

.btn-group .btn {
  padding: var(--space-xs) var(--space-sm);
  font-size: var(--fs-sm);
}
</style>
