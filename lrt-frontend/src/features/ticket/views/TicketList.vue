<template>
  <div class="ticketlist-wrapper container py-4">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
      <h2 class="mb-0 fw-bold text-gradient d-flex align-items-center gap-2">
        <i class="bi bi-ticket-perforated-fill"></i> Tickets
      </h2>
      <button
          class="btn btn-gradient d-flex align-items-center gap-2 shadow-sm"
          style="min-width: 170px;"
          @click="newTicket = true"
      >
        <i class="bi bi-plus-circle"></i> Neues Ticket
      </button>
    </div>

    <!-- Tabs -->
    <ul class="nav nav-tabs mb-3">
      <li class="nav-item">
        <button
            class="nav-link"
            :class="{ active: activeTab === 'open' }"
            @click="activeTab = 'open'"
        >
          <i class="bi bi-unlock"></i> Offen
        </button>
      </li>
      <li class="nav-item">
        <button
            class="nav-link"
            :class="{ active: activeTab === 'closed' }"
            @click="activeTab = 'closed'"
        >
          <i class="bi bi-lock"></i> Geschlossen
        </button>
      </li>
    </ul>

    <!-- Filterleiste -->
    <div class="row g-2 align-items-center mb-3">
      <div class="col-auto">
        <input
            v-model="search"
            class="form-control"
            placeholder="Suchen…"
            @input="page = 1"
        />
      </div>
      <div class="col-auto">
        <select v-model="selectedPriority" class="form-select">
          <option value="">Alle Prioritäten</option>
          <option value="high">Hoch</option>
          <option value="medium">Mittel</option>
          <option value="low">Niedrig</option>
        </select>
      </div>
      <div class="col-auto">
        <select v-model="selectedAssignee" class="form-select">
          <option value="">Alle Assignees</option>
          <option v-for="user in users" :key="user._id" :value="user.username">
            {{ user.username }}
          </option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="store.loading" class="text-center py-5">
      <span class="spinner-border text-primary"></span>
    </div>

    <!-- Table / Empty State -->
    <div v-else>
      <div class="card shadow-sm rounded-4 border-0">
        <div class="card-body p-0">
          <table class="table table-hover align-middle mb-0 table-striped">
            <thead>
            <tr>
              <th>Titel</th>
              <th>Status</th>
              <th>Assignee</th>
              <th>Priorität</th>
              <th class="text-end pe-4">Aktionen</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="t in pagedTickets" :key="t._id">
              <td>{{ t.title }}</td>
              <td>
                <span :class="['badge', badgeClass(t.status)]">{{ t.status }}</span>
              </td>
              <td>{{ t.assignee?.username || '–' }}</td>
              <td>{{ t.priority }}</td>
              <td class="text-end pe-4">
                <div class="d-inline-flex gap-1">
                  <router-link
                      :to="`/tickets/${t._id}`"
                      class="btn btn-sm btn-outline-primary d-inline-flex align-items-center"
                      title="Details"
                  >
                    <i class="bi bi-eye-fill"></i>
                  </router-link>
                  <button
                      class="btn btn-sm"
                      :class="t.status === 'closed' ? 'btn-outline-success' : 'btn-outline-danger'"
                      @click="toggleStatus(t)"
                      title="Status umschalten"
                  >
                    <i :class="t.status === 'closed' ? 'bi bi-box-arrow-in-up-right' : 'bi bi-x-circle'"></i>
                  </button>
                  <button
                      class="btn btn-sm btn-outline-danger d-inline-flex align-items-center"
                      @click="deleteTicket(t)"
                      title="Löschen"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!pagedTickets.length">
              <td colspan="5">
                <EmptyState
                    icon="bi bi-emoji-frown"
                    :title="emptyTitle"
                    :description="emptyDescription"
                >
                  <button
                      v-if="activeTab === 'open'"
                      class="btn btn-gradient mt-3"
                      @click="newTicket = true"
                  >
                    <i class="bi bi-plus-circle"></i> Ticket anlegen
                  </button>
                </EmptyState>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <nav v-if="totalPages > 1" class="mt-4">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: page === 1 }">
            <button class="page-link" @click="page > 1 && --page" aria-label="Vorherige">«</button>
          </li>
          <li
              class="page-item"
              v-for="n in totalPages"
              :key="n"
              :class="{ active: page === n }"
          >
            <button class="page-link" @click="page = n">{{ n }}</button>
          </li>
          <li class="page-item" :class="{ disabled: page === totalPages }">
            <button class="page-link" @click="page < totalPages && ++page" aria-label="Nächste">»</button>
          </li>
        </ul>
      </nav>
    </div>

    <!-- Modal für neues Ticket -->
    <TicketFormModal
        v-if="newTicket"
        @close="newTicket = false"
        @saved="onSaved"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useToastStore } from '@/shared/stores/toast'
import { useTicketStore } from '@/features/ticket/store/ticketStore'
import TicketFormModal from '@/features/ticket/components/TicketFormModal.vue'
import EmptyState from '@/shared/components/EmptyState.vue'
import http from '@/shared/api/http'

const store = useTicketStore()
const toast = useToastStore()
const newTicket = ref(false)
const activeTab = ref('open')
const search = ref('')
const selectedPriority = ref('')
const selectedAssignee = ref('')
const users = ref([])
const page = ref(1)
const perPage = 12

onMounted(async () => {
  try {
    const res = await http.get('/admin/users')
    users.value = res.data
  } catch {
    toast.show('Benutzerliste konnte nicht geladen werden', 'danger')
  }
  loadTickets()
})

async function loadTickets() {
  store.loading = true
  try {
    await store.loadAll()
  } catch {
    toast.show('Fehler beim Laden der Tickets', 'danger')
  } finally {
    store.loading = false
  }
}

async function deleteTicket(t) {
  if (!confirm(`Ticket "${t.title}" wirklich löschen?`)) return
  try {
    await store.remove(t._id)
    toast.show('Ticket gelöscht', 'success')
    loadTickets()
  } catch {
    toast.show('Fehler beim Löschen', 'danger')
  }
}

function onSaved() {
  newTicket.value = false
  loadTickets()
}

const filteredTickets = computed(() =>
    store.list
        .filter(t => t.status === activeTab.value)
        .filter(t => !search.value || t.title.toLowerCase().includes(search.value.toLowerCase()))
        .filter(t => !selectedPriority.value || t.priority === selectedPriority.value)
        .filter(t => !selectedAssignee.value || t.assignee?.username === selectedAssignee.value)
)

const pagedTickets = computed(() =>
    filteredTickets.value.slice((page.value - 1) * perPage, page.value * perPage)
)
const totalPages = computed(() => Math.ceil(filteredTickets.value.length / perPage))
watch([filteredTickets, activeTab], () => { page.value = 1 })

const emptyTitle = computed(() =>
    search.value || selectedPriority.value
        ? 'Keine Treffer'
        : activeTab.value === 'open'
            ? 'Noch keine offenen Tickets'
            : 'Keine geschlossenen Tickets'
)
const emptyDescription = computed(() =>
    search.value || selectedPriority.value
        ? 'Mit den aktuellen Filtern wurden keine Tickets gefunden.'
        : activeTab.value === 'open'
            ? 'Lege jetzt dein erstes Ticket an!'
            : 'Im Moment gibt es keine geschlossenen Tickets.'
)

async function toggleStatus(t) {
  try {
    if (t.status === 'closed') {
      await store.reopen(t._id)
    } else {
      await store.close(t._id)
    }
    toast.show('Status aktualisiert', 'success')
    loadTickets()
  } catch {
    toast.show('Fehler beim Umschalten', 'danger')
  }
}

function badgeClass(status) {
  switch (status) {
    case 'open':        return 'bg-success text-white'
    case 'in-progress': return 'bg-warning text-dark'
    case 'on-hold':     return 'bg-secondary text-white'
    case 'resolved':    return 'bg-info text-white'
    case 'closed':      return 'bg-dark text-white'
    default:            return 'bg-light text-dark'
  }
}
</script>

<style scoped>
.ticketlist-wrapper {
  background: var(--clr-card-bg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-light);
  margin-top: var(--space-lg);
}

/* Tabs */
.nav-tabs {
  border-bottom: 1px solid var(--clr-border);
}
.nav-tabs .nav-link {
  font-weight: 500;
  color: var(--clr-secondary);
}
.nav-tabs .nav-link.active {
  color: var(--clr-primary-end);
  background: var(--clr-bg-light);
  border-color: var(--clr-border) var(--clr-border) var(--clr-bg-light);
}

/* Tabelle */
.card {
  border-radius: var(--radius-lg);
}
.table-hover tbody tr:hover {
  background: rgba(56, 139, 253, 0.05);
}
.table thead th {
  background: var(--clr-bg-light);
  border-bottom: 2px solid var(--clr-border);
  font-weight: 600;
}
.table tbody td {
  border-bottom: 1px solid var(--clr-border);
}

/* Buttons */
.btn-gradient {
  /* global btn-gradient */
}
.btn-outline-primary,
.btn-outline-danger {
  /* global btn-outline */
}

/* Badges in rows */
.badge {
  border-radius: var(--radius-sm);
  font-size: var(--fs-sm);
  padding: var(--space-xs) var(--space-sm);
}

/* Pagination */
.pagination .page-link {
  border-radius: var(--radius-sm);
}

/* Responsive filter inputs */
.form-control,
.form-select {
  border-radius: var(--radius-sm);
}
</style>
