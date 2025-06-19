<template>
  <div class="ticketlist-wrapper container py-4">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
      <h2 class="mb-0 fw-bold text-gradient d-flex align-items-center gap-2">
        <i class="bi bi-ticket-perforated-fill"></i> Tickets
      </h2>
      <button
          class="btn btn-success shadow-sm rounded-pill d-flex align-items-center gap-1"
          style="min-width: 170px"
          @click="newTicket = true"
      >
        <i class="bi bi-plus-circle"></i> Neues Ticket
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="store.loading" class="text-center py-5">
      <span class="spinner-border text-primary"></span>
    </div>

    <!-- Table -->
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
            <tr v-for="t in store.list" :key="t._id">
              <td>{{ t.title }}</td>
              <td>
                  <span :class="badgeClass(t.status)" class="me-1">
                    {{ t.status }}
                  </span>
              </td>
              <td>{{ t.assignee?.username || '–' }}</td>
              <td>{{ t.priority }}</td>
              <td class="text-end pe-4">
                <!-- Detail View -->
                <router-link
                    :to="`/tickets/${t._id}`"
                    class="btn btn-sm btn-outline-primary d-inline-flex align-items-center me-1"
                    title="Details"
                >
                  <i class="bi bi-eye-fill"></i>
                </router-link>
                <!-- Toggle Status -->
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
              </td>
            </tr>
            <tr v-if="!store.list.length">
              <td colspan="5" class="text-center text-muted py-5">
                <i class="bi bi-emoji-frown me-2"></i>Keine Tickets vorhanden
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
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
import { ref, onMounted } from 'vue'
import { useToastStore } from '@/stores/toast'
import { useTicketStore } from '@/features/ticket/store/ticketStore'
import http from '@/api/http'
import TicketFormModal from './TicketFormModal.vue'

const store = useTicketStore()
const toast = useToastStore()
const newTicket = ref(false)

async function loadTickets() {
  store.loading = true
  try {
    await store.loadAll()
  } catch {
    toast.show('Fehler beim Laden der Tickets', 4000)
  } finally {
    store.loading = false
  }
}

function onSaved() {
  newTicket.value = false
  loadTickets()
}

// Toggle Open/Close in List
async function toggleStatus(t) {
  try {
    if (t.status === 'closed') {
      await http.patch(`/tickets/${t._id}/reopen`)
    } else {
      await http.patch(`/tickets/${t._id}/close`)
    }
    toast.show('Status aktualisiert', 2000)
    loadTickets()
  } catch {
    toast.show('Fehler beim Umschalten', 2000)
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

onMounted(loadTickets)
</script>

<style scoped>
.ticketlist-wrapper {
  background: #f8fafc;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(44, 62, 80, 0.07);
  margin-top: 30px;
}
.text-gradient {
  background: linear-gradient(90deg, #ff9360 10%, #388bfd 80%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
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
</style>
