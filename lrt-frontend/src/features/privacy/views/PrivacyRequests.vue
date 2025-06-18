<template>
  <div class="privacy-wrapper container py-4">
    <h2 class="mb-4 text-gradient fw-bold d-flex align-items-center gap-2">
      <i class="bi bi-shield-lock-fill"></i> Data‑Privacy Toolkit
    </h2>

    <div class="card shadow-sm rounded-4 border-0">
      <div class="card-body p-0">
        <div v-if="loading" class="py-5 text-center">
          <span class="spinner-border text-primary"></span>
        </div>
        <div v-else>
          <table class="table table-hover align-middle mb-0 table-striped">
            <thead class="table-light">
            <tr>
              <th>User</th>
              <th>Typ</th>
              <th>Status</th>
              <th>Erstellt</th>
              <th>Aktionen</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="r in requests" :key="r._id">
              <td>{{ r.user.username }}<br><small>{{ r.user.email }}</small></td>
              <td>{{ r.type }}</td>
              <td>
                  <span :class="{
                    'text-secondary': r.status==='pending',
                    'text-info':     r.status==='in_progress',
                    'text-success':  r.status==='complete',
                    'text-danger':   r.status==='rejected'
                  }">{{ r.status }}</span>
              </td>
              <td>{{ formatDate(r.createdAt) }}</td>
              <td>
                <div class="d-inline-flex gap-2">
                  <button
                      class="btn btn-sm btn-outline-info"
                      v-if="r.status==='pending'"
                      @click="changeStatus(r,'in_progress')"
                  >Start</button>
                  <button
                      class="btn btn-sm btn-outline-success"
                      v-if="r.status!=='complete'"
                      @click="changeStatus(r,'complete')"
                  >Done</button>
                  <button
                      class="btn btn-sm btn-outline-danger"
                      v-if="r.status!=='rejected'"
                      @click="changeStatus(r,'rejected')"
                  >Reject</button>
                  <a
                      v-if="r.fileUrl"
                      :href="r.fileUrl"
                      class="btn btn-sm btn-outline-primary"
                      target="_blank"
                  >Download</a>
                </div>
              </td>
            </tr>
            <tr v-if="!requests.length">
              <td colspan="5" class="text-center text-muted py-4">
                <i class="bi bi-emoji-frown"></i> Keine Requests.
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import http from '@/api/http';
import { useToastStore } from '@/stores/toast';

const toast = useToastStore();
const requests = ref([]);
const loading = ref(false);

function formatDate(d) {
  return new Date(d).toLocaleString();
}

async function fetch() {
  loading.value = true;
  try {
    const res = await http.get('/admin/privacy/requests');
    requests.value = res.data;
  } catch (e) {
    toast.show('Fehler beim Laden', 'danger');
  } finally {
    loading.value = false;
  }
}

async function changeStatus(r, to) {
  try {
    await http.patch(`/admin/privacy/requests/${r._id}`, { status: to });
    toast.show(`Status auf "${to}" gesetzt`, 'success');
    await fetch();
  } catch {
    toast.show('Fehler beim Aktualisieren', 'danger');
  }
}

onMounted(fetch);
</script>

<style scoped>
.privacy-wrapper .card {
  border-radius: 1.3rem;
}
.text-gradient {
  background: linear-gradient(90deg,#ff9360,#388bfd);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.table thead th {
  font-weight: 600;
  background: #f1f5fa;
}
.table-hover > tbody > tr:hover {
  background: #e3f6ff !important;
}
.btn-outline-info  { color: #0dcaf0; border-color: #0dcaf0; }
.btn-outline-success { color: #198754; border-color: #198754; }
.btn-outline-danger  { color: #dc3545; border-color: #dc3545; }
.btn-outline-primary { color: #0d6efd; border-color: #0d6efd; }
</style>
