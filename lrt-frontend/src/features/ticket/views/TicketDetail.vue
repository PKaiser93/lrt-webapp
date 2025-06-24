<template>
  <div class="ticketdetail-wrapper container py-4">
    <!-- Ladezustand -->
    <div v-if="store.loading" class="text-center py-5">
      <span class="spinner-border text-primary"></span>
    </div>

    <!-- Ticket vorhanden -->
    <div v-else-if="store.current">
      <!-- Haupt‑Card -->
      <div class="card shadow-sm rounded-4 mb-4 border-0">
        <div class="card-body">
          <!-- Titel & Ersteller -->
          <div class="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-2">
            <div>
              <h2 class="fw-bold text-gradient mb-1 d-flex align-items-center gap-2">
                <i class="bi bi-ticket-perforated-fill"></i>
                {{ store.current.title }}
              </h2>
              <p class="text-muted mb-0">
                <i class="bi bi-person-fill me-1"></i>
                Erstellt von <strong>{{ store.current.creator }}</strong>
                • {{ formatDate(store.current.createdAt) }}
              </p>
            </div>
            <!-- Rechts: Status‑Button + Assignee‑Select -->
            <div class="d-flex align-items-center gap-2">
              <button
                  class="btn btn-sm"
                  :class="store.current.status === 'closed' ? 'btn-outline-success' : 'btn-outline-danger'"
                  @click="toggleStatus"
              >
                <i :class="store.current.status === 'closed'
                  ? 'bi bi-box-arrow-in-up-right'
                  : 'bi bi-x-circle'"></i>
                {{ store.current.status === 'closed' ? 'Öffnen' : 'Schließen' }}
              </button>
              <div class="input-group input-group-sm">
                <select v-model="selectedAssignee" class="form-select">
                  <option value="">– keiner –</option>
                  <option v-for="u in users" :key="u._id" :value="u._id">
                    {{ u.username }}
                  </option>
                </select>
                <button class="btn btn-sm btn-outline-primary" @click="assignTo">
                  <i class="bi bi-person-check"></i>
                </button>
              </div>
            </div>
          </div>
          <!-- Beschreibung -->
          <div class="card bg-white shadow-sm rounded-4 mb-3 border-1">
            <div class="card-body">
              <p class="mb-0">{{ store.current.description }}</p>
            </div>
          </div>
          <!-- Badges -->
          <div class="d-flex flex-wrap align-items-center gap-3">
            <span class="badge" :class="statusClass">
              <i class="bi bi-info-circle-fill me-1"></i>
              {{ store.current.status }}
            </span>
            <span class="badge" :class="priorityClass">
              <i class="bi bi-flag-fill me-1"></i>
              {{ store.current.priority }}
            </span>
            <span class="d-flex align-items-center gap-1">
              <i class="bi bi-person-check-fill"></i>
              Zugewiesen an: <strong>{{ currentAssigneeName || '– niemand –' }}</strong>
            </span>
          </div>
        </div>
      </div>

      <!-- Kommentar‑Liste -->
      <div class="card shadow-sm rounded-4 mb-4 border-0">
        <div class="card-body">
          <h5 class="fw-semibold mb-3 d-flex align-items-center gap-2">
            <i class="bi bi-chat-left-text-fill"></i>
            Kommentare ({{ store.current.comments.length }})
          </h5>
          <ul class="list-unstyled mb-0">
            <li v-for="c in store.current.comments" :key="c._id" class="mb-3 pb-3 border-bottom">
              <div class="small text-muted d-flex align-items-center gap-2 mb-1">
                <i class="bi bi-person-circle"></i>
                <strong>{{ c.author }}</strong>
                <span>· {{ formatDate(c.created) }}</span>
              </div>
              <div>{{ c.message }}</div>
            </li>
            <li v-if="!store.current.comments.length" class="text-center text-muted py-4">
              <i class="bi bi-emoji-frown"></i> Keine Kommentare
            </li>
          </ul>
        </div>
      </div>

      <!-- Neuen Kommentar -->
      <div class="card shadow-sm rounded-4 border-0">
        <div class="card-body">
          <h5 class="fw-semibold mb-3 d-flex align-items-center gap-2">
            <i class="bi bi-chat-dots-fill"></i> Neuen Kommentar
          </h5>
          <form @submit.prevent="addComment">
            <div class="mb-3">
              <textarea
                  v-model="message"
                  class="form-control"
                  rows="3"
                  placeholder="Dein Kommentar..."
                  required
              ></textarea>
            </div>
            <div class="text-end">
              <button class="btn btn-gradient d-flex align-items-center gap-2">
                <i class="bi bi-send-fill"></i> Abschicken
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Nicht gefunden -->
    <div v-else class="alert alert-info text-center py-4">
      <i class="bi bi-emoji-frown me-2"></i>Ticket nicht gefunden.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTicketStore } from '@/features/ticket/store/ticketStore'
import { useAuthStore } from '@/shared/stores/auth'
import http from '@/shared/api/http'
import { format } from 'date-fns'
import { useToastStore } from '@/shared/stores/toast'

const store = useTicketStore()
const auth = useAuthStore()
const toast = useToastStore()
const route = useRoute()

const users = ref([])
const selectedAssignee = ref('')
const message = ref('')

// Lädt Ticket & aktuellen Assignee
async function loadAll() {
  await store.load(route.params.id)
  const a = store.current.assignee
  selectedAssignee.value = a ? (typeof a === 'object' ? a._id : a) : ''
}

onMounted(async () => {
  try {
    const res = await http.get('/admin/users')
    users.value = res.data
  } catch {
    toast.show('Benutzerliste konnte nicht geladen werden', 'danger')
  }
  await loadAll()
})

// Kommentar absenden
async function addComment() {
  try {
    await store.comment(route.params.id, auth.user.username, message.value)
    message.value = ''
    toast.show('Kommentar gespeichert', 'success')
    await loadAll()
  } catch {
    toast.show('Kommentar konnte nicht gespeichert werden', 'danger')
  }
}

// Status umschalten
async function toggleStatus() {
  try {
    if (store.current.status === 'closed') {
      await store.reopen(route.params.id)
      toast.show('Ticket wieder geöffnet', 'success')
    } else {
      await store.close(route.params.id)
      toast.show('Ticket geschlossen', 'success')
    }
    await loadAll()
  } catch {
    toast.show('Fehler beim Umschalten des Status', 'danger')
  }
}

// Assignee ändern
async function assignTo() {
  try {
    await store.update(route.params.id, { assignee: selectedAssignee.value })
    toast.show('Zuweisung aktualisiert', 'success')
    await loadAll()
  } catch {
    toast.show('Zuweisung fehlgeschlagen', 'danger')
  }
}

// Anzeige‑Name des Assignees
const currentAssigneeName = computed(() => {
  const a = store.current.assignee
  if (!a) return ''
  if (typeof a === 'object') return a.username
  const u = users.value.find(u => u._id === a)
  return u?.username || ''
})

// Datum formatieren
function formatDate(ts) {
  return format(new Date(ts), 'dd.MM.yyyy HH:mm')
}

const statusClass = computed(() => {
  switch (store.current.status) {
    case 'closed':      return 'bg-secondary text-white'
    case 'in_progress': return 'bg-warning text-dark'
    default:            return 'bg-success text-white'
  }
})
const priorityClass = computed(() => {
  switch (store.current.priority) {
    case 'high':   return 'bg-danger text-white'
    case 'medium': return 'bg-warning text-dark'
    default:      return 'bg-secondary text-white'
  }
})
</script>

<style scoped>
.ticketdetail-wrapper {
  background: var(--clr-bg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-light);
  margin-top: var(--space-lg);
}

.text-gradient {
  background: linear-gradient(90deg, var(--clr-primary-start) 10%, var(--clr-primary-end) 90%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.card {
  border-radius: var(--radius-lg);
}

.card.bg-light {
  background: var(--clr-card-bg);
}

.btn-gradient {
  /* bereits global definiert */
}

.badge {
  border-radius: var(--radius-sm);
  font-size: var(--fs-sm);
  padding: var(--space-xs) var(--space-sm);
}

.bg-white {
  background: var(--clr-card-bg) !important;
}

.border-1 {
  border: 1px solid var(--clr-border) !important;
}
</style>
