<template>
  <div class="container py-4">
    <h2 class="mb-4 text-gradient d-flex align-items-center gap-2">
      <i class="bi bi-journal-text"></i> Dokumentation
    </h2>
    <div class="row">
      <!-- Sidebar -->
      <div class="col-md-3 mb-3">
        <ul class="list-group">
          <li
              v-for="doc in docs"
              :key="doc.id"
              @click="select(doc)"
              :class="['list-group-item', { active: selected?.id === doc.id }]"
              style="cursor:pointer"
          >
            {{ doc.title }}
          </li>
        </ul>
      </div>
      <!-- Content -->
      <div class="col-md-9">
        <div v-if="selected">
          <div v-html="renderedHtml"></div>
        </div>
        <div v-else class="text-muted">Bitte ein Dokument auswählen.</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import MarkdownIt from 'markdown-it'
const md = new MarkdownIt({ html: true })

// Build‑time glob mit neuer Syntax
const markdownModules = import.meta.glob('@/docs/*.md', {
  query: '?raw',
  import: 'default'
})

// Liste der verfügbaren Dokumente
const docs = [
  { id: 'intro', title: 'Einführung',    path: '/src/docs/introduction.md' },
  { id: 'usage', title: 'Anwendung',     path: '/src/docs/how-to-use.md' },
  { id: 'computer', title: 'Computer',     path: '/src/docs/computer.md' },
  { id: 'betriebssystem', title: 'Betriebssystem',     path: '/src/docs/betriebssystem.md' }
]

const selected = ref(null)
const raw      = ref('')

// Lädt das Markdown für das ausgewählte Dokument
async function select(doc) {
  selected.value = doc
  const loader = markdownModules[doc.path]
  if (!loader) {
    raw.value = '⚠️ Dokument nicht gefunden.'
    return
  }
  try {
    raw.value = await loader()
  } catch {
    raw.value = '⚠️ Fehler beim Laden der Datei.'
  }
}

const renderedHtml = computed(() => md.render(raw.value))

onMounted(() => {
  select(docs[0])
})
</script>

<style scoped>
.text-gradient {
  background: linear-gradient(90deg,#388bfd 10%,#38d6ae 90%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
