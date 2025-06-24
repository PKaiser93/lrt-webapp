<template>
  <div class="container py-4">
    <h2 class="mb-4 text-gradient d-flex align-items-center gap-2">
      <i class="bi bi-journal-text"></i> Dokumentation
    </h2>
    <div class="row">
      <!-- Sidebar -->
      <aside class="col-md-3 mb-3">
        <ul class="list-group">
          <li
              v-for="doc in docs"
              :key="doc.id"
              @click="select(doc)"
              :class="['list-group-item', { active: selected?.id === doc.id }]"
              class="cursor-pointer"
          >
            {{ doc.title }}
          </li>
        </ul>
      </aside>
      <!-- Content -->
      <section class="col-md-9">
        <div v-if="selected" class="doc-content p-4 bg-white rounded-3 shadow-sm">
          <div v-html="renderedHtml"></div>
        </div>
        <div v-else class="text-muted">Bitte ein Dokument auswählen.</div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({ html: true })
const selected = ref(null)
const raw = ref('')

// Globale Markdown‑Loader
const markdownModules = import.meta.glob(
    '/src/features/docs/markdowns/*.md',
    { query: '?raw', import: 'default' }
)

// Liste der Dokumente aus den Dateinamen erzeugen
const docs = Object.entries(markdownModules).map(([path, loader]) => {
  const id = path.split('/').pop().replace(/\.md$/, '')
  const title = id
      .split('-')
      .map(seg => seg.charAt(0).toUpperCase() + seg.slice(1))
      .join(' ')
  return { id, title, loader }
})

// Ein Dokument auswählen und laden
async function select(doc) {
  selected.value = doc
  try {
    raw.value = await doc.loader()
  } catch {
    raw.value = '⚠️ Fehler beim Laden der Datei.'
  }
}

const renderedHtml = computed(() => md.render(raw.value))

onMounted(() => {
  if (docs.length) select(docs[0])
})
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

/* Überschrift mit globalen Farbvariablen */
.text-gradient {
  background: linear-gradient(
      135deg,
      var(--clr-primary-start),
      var(--clr-primary-end)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Sidebar-Items */
.list-group-item {
  transition: background 0.2s, color 0.2s;
}

.list-group-item:hover {
  background: var(--clr-bg);
}

.list-group-item.active {
  background: var(--clr-primary-start);
  color: #fff;
  border-color: var(--clr-primary-start);
}

/* Content-Wrapper */
.doc-content {
  background: var(--clr-card-bg);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-light);
  color: var(--clr-text);
  line-height: 1.6;
}

/* Markdown-typografie */
.doc-content h1,
.doc-content h2,
.doc-content h3 {
  margin-top: var(--space-lg);
  margin-bottom: var(--space-sm);
  color: var(--clr-primary-end);
}

.doc-content p {
  margin-bottom: var(--space-md);
}

.doc-content pre {
  background: #f4f6f8;
  padding: var(--space-sm);
  border-radius: var(--radius-sm);
  overflow-x: auto;
}

.doc-content code {
  background: #eef1f4;
  padding: 2px 4px;
  border-radius: var(--radius-sm);
}

.doc-content a {
  color: var(--clr-primary-start);
  text-decoration: underline;
}

.doc-content ul,
.doc-content ol {
  margin-left: var(--space-lg);
  margin-bottom: var(--space-md);
}

.doc-content blockquote {
  border-left: 4px solid var(--clr-primary-start);
  padding-left: var(--space-md);
  color: #555;
  margin: var(--space-md) 0;
}
</style>
