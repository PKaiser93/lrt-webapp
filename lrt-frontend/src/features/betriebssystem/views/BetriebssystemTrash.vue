<script setup>
import { onMounted } from 'vue'
import { useBetriebssystemStore } from '@/features/betriebssystem/store/betriebssystemStore'

const store = useBetriebssystemStore()
onMounted(() => store.fetchTrash())

function restoreItem(id) {
  store.restore(id)
}
</script>

<template>
  <div class="os-list-container">
    <header class="os-list-header mb-3">
      <h2 class="fs-lg fw-bold gradient-text d-flex align-items-center gap-2">
        <i class="bi bi-trash3"></i>
        Gelöschte Betriebssysteme
      </h2>
      <p class="text-secondary fs-md">Hier kannst du gelöschte Betriebssysteme wiederherstellen</p>
    </header>

    <div class="table-responsive card p-0 overflow-hidden">
      <table class="table mb-0 os-table">
        <thead class="bg-light">
        <tr>
          <th class="text-center" style="width: 4rem"><i class="bi bi-hash"></i></th>
          <th><i class="bi bi-ubuntu me-1"></i>Name</th>
          <th class="text-end" style="width: 8rem">Aktion</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(bs, i) in store.trash" :key="bs._id">
          <td class="text-center">{{ i + 1 }}</td>
          <td>
            <i class="bi bi-hdd-network me-1 text-primary"></i>
            {{ bs.name }}
          </td>
          <td class="text-end">
            <button
                class="btn btn-primary btn-sm"
                @click="restoreItem(bs._id)"
                title="Wiederherstellen"
            >
              <i class="bi bi-arrow-clockwise"></i>
            </button>
          </td>
        </tr>
        <tr v-if="!store.trash.length">
          <td colspan="3" class="py-5 text-center text-secondary">
            <i class="bi bi-emoji-laughing fs-2 mb-2 d-block text-primary"></i>
            Nichts im Papierkorb!
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.os-list-container {
  max-width: 700px;
  margin: var(--space-lg) auto;
  padding: var(--space-lg);
}

.os-list-header {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.gradient-text {
  background: linear-gradient(
      135deg,
      var(--clr-primary-start),
      var(--clr-primary-end)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.table-responsive {
  background: var(--clr-card-bg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-light);
}

.os-table th,
.os-table td {
  vertical-align: middle;
  padding: var(--space-sm) var(--space-md);
}

.os-table thead th {
  border-bottom: 2px solid var(--clr-border);
  font-weight: 600;
}

.os-table tbody tr:hover {
  background: var(--clr-bg);
}

.btn-primary {
  /* aus main.css */
}

/* Responsive Anpassung */
@media (max-width: 576px) {
  .os-list-container {
    padding: var(--space-md);
  }
  .os-table th,
  .os-table td {
    font-size: var(--fs-sm);
  }
}
</style>
