<template>
  <div class="ticketlist-wrapper container py-4">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
      <h2 class="mb-0 fw-bold text-gradient d-flex align-items-center gap-2">
        <i class="bi bi-ticket-perforated-fill"></i> Tickets
      </h2>
      <button
          class="btn btn-gradient d-flex align-items-center gap-2 shadow-sm"
          style="min-width: 170px"
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
        <input v-model="search" class="form-control" placeholder="Suchen…" @input="page = 1">
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
            <thead class="table-light">
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
                  <span :class="badgeClass(t.status)" class="me-1">
                    {{ t.status }}
                  </span>
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
                    <i
                        :class="t.status === 'closed'
          ? 'bi bi-box-arrow-in-up-right'
          : 'bi bi-x-circle'"
                    ></i>
                  </button>
                  <button
                      class="btn btn-sm btn-outline-danger d-inline-flex align-items-center"
                      title="Löschen"
                      @click="deleteTicket(t)"
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
                  <button v-if="activeTab === 'open'" class="btn btn-gradient mt-3" @click="newTicket = true">
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
            <button class="page-link" @click="page > 1 && (page--)" aria-label="Vorherige">«</button>
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
            <button class="page-link" @click="page < totalPages && (page++)" aria-label="Nächste">»</button>
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
import { useToastStore } from '@/stores/toast'
import { useTicketStore } from '@/features/ticket/store/ticketStore'
import TicketFormModal from '../components/TicketFormModal.vue'
import EmptyState from '@/components/EmptyState.vue'
import http from '@/api/http'

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

// Assignees laden (beim ersten Mount)
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

// Gefilterte Tickets nach Tab, Suchfeld, Filter
const filteredTickets = computed(() =>
    store.list
        .filter(t => t.status === activeTab.value)
        .filter(t => !search.value || (t.title?.toLowerCase().includes(search.value.toLowerCase()) || t.assignee?.username?.toLowerCase().includes(search.value.toLowerCase())))
        .filter(t => !selectedPriority.value || t.priority === selectedPriority.value)
        .filter(t => !selectedAssignee.value || t.assignee?.username === selectedAssignee.value)
)

const pagedTickets = computed(() =>
    filteredTickets.value.slice((page.value - 1) * perPage, page.value * perPage)
)
const totalPages = computed(() =>
    Math.max(1, Math.ceil(filteredTickets.value.length / perPage))
)
watch([filteredTickets, activeTab], () => { page.value = 1 })

// Empty State Inhalte dynamisch je Tab/Filter
const emptyTitle = computed(() =>
    search.value || selectedPriority.value || selectedAssignee.value
        ? 'Keine Treffer'
        : (activeTab.value === 'open' ? 'Noch keine offenen Tickets' : 'Keine geschlossenen Tickets')
)
const emptyDescription = computed(() =>
    search.value || selectedPriority.value || selectedAssignee.value
        ? 'Mit den aktuellen Filtern wurden keine Tickets gefunden.'
        : (activeTab.value === 'open'
            ? 'Lege jetzt dein erstes Ticket an!'
            : 'Im Moment gibt es keine geschlossenen Tickets.')
)

// Toggle Open/Close in List
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

// Badge‑Klasse je Status
function badgeClass(status) {
  switch (status) {
    case 'open':         return 'badge bg-success'
    case 'in-progress':  return 'badge bg-warning text-dark'
    case 'on-hold':      return 'badge bg-secondary'
    case 'resolved':     return 'badge bg-info'
    case 'closed':       return 'badge bg-dark'
    default:             return 'badge bg-light text-dark'
  }
}
</script>

<style scoped>
.ticketlist-wrapper {
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
.nav-tabs .nav-link.active {
  font-weight: 600;
  color: #388bfd !important;
  background: #e7f1ff;
  border-color: #b6d6ff #b6d6ff #fff;
  border-bottom: 2px solid #388bfd !important;
}
</style>
