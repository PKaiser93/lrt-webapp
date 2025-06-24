<template>
  <div class="os-list-container">
    <div class="os-list-header">
      <div>
        <h2 class="mb-0 text-gradient d-flex align-items-center gap-2">
          <i class="bi bi-microsoft"></i>
          Betriebssysteme
        </h2>
        <div class="subtitle">Alle aktiven Betriebssysteme in der Datenbank</div>
      </div>
      <div class="d-flex gap-2 flex-wrap">
        <button class="btn btn-primary d-flex align-items-center gap-2" @click="openForm()">
          <i class="bi bi-plus-circle"></i>
        </button>
        <router-link
            to="/betriebssystem/trash"
            class="btn btn-outline d-flex align-items-center gap-2"
        >
          <i class="bi bi-trash3"></i>
        </router-link>
      </div>
    </div>

    <BetriebssystemForm
        v-if="showForm"
        :item="editItem"
        @close="closeForm"
        @saved="saveBetriebssystem"
    />

    <div class="os-list-actions d-flex flex-wrap align-items-center mb-3 gap-3">
      <div class="input-group search-group">
        <span class="input-group-text"><i class="bi bi-search"></i></span>
        <input
            v-model="search"
            class="form-control"
            placeholder="Suchen …"
        />
      </div>
    </div>

    <div v-if="store.isLoading" class="text-center py-5">
      <span class="spinner-border text-primary"></span>
    </div>
    <div v-else>
      <div v-if="!filteredItems.length" class="alert alert-info text-center py-5">
        <i class="bi bi-info-circle me-2"></i>
        Keine Betriebssysteme gefunden.
      </div>
      <div v-else class="table-responsive rounded-4 shadow-sm">
        <table class="table table-hover align-middle mb-0 os-table">
          <thead>
          <tr>
            <th><i class="bi bi-ubuntu me-2"></i>Name</th>
            <th class="text-end">Aktionen</th>
          </tr>
          </thead>
          <tbody>
          <BetriebssystemTableRow
              v-for="(item, i) in filteredItems"
              :key="item._id"
              :item="item"
              :index="i+1"
              @edit="openForm"
              @delete="deleteItem"
          />
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useBetriebssystemStore } from '@/features/betriebssystem/store/betriebssystemStore';
import BetriebssystemTableRow from '@/features/betriebssystem/components/BetriebssystemTableRow.vue';
import BetriebssystemForm from '@/features/betriebssystem/components/BetriebssystemForm.vue';
import { useToastStore } from '@/shared/stores/toast';

const store = useBetriebssystemStore();
const toastStore = useToastStore();

const showForm = ref(false);
const editItem = ref(null);
const search = ref('');

function openForm(item = null) {
  editItem.value = item;
  showForm.value = true;
}
function closeForm() {
  showForm.value = false;
  editItem.value = null;
}
async function deleteItem(id) {
  if (!confirm('Wirklich löschen?')) return;
  try {
    await store.delete(id);
    toastStore.show('Betriebssystem gelöscht', 'success');
    await store.fetchAll();
  } catch {
    toastStore.show(store.error || 'Fehler beim Löschen', 'danger');
  }
}
async function saveBetriebssystem(data) {
  try {
    if (data._id) {
      await store.update(data._id, data);
      toastStore.show('Betriebssystem gespeichert', 'success');
    } else {
      await store.create(data);
      toastStore.show('Betriebssystem neu angelegt', 'success');
    }
    closeForm();
    await store.fetchAll();
  } catch {
    toastStore.show(store.error || 'Fehler beim Speichern', 'danger');
  }
}

const filteredItems = computed(() =>
    store.items.filter(x =>
        !search.value ||
        x.name?.toLowerCase().includes(search.value.toLowerCase())
    )
);

onMounted(() => {
  store.fetchAll();
});
</script>

<style scoped>
.os-list-container {
  background: var(--clr-card-bg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-light), var(--shadow-strong);
  padding: var(--space-lg);
  margin: var(--space-xl) auto 0;
  max-width: 700px;
}

.os-list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
}

.text-gradient {
  background: linear-gradient(90deg, var(--clr-primary-start), var(--clr-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  color: var(--clr-secondary);
  font-size: var(--fs-md);
  margin-left: var(--space-xs);
}

.search-group {
  min-width: 250px;
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-light);
}

.os-table th,
.os-table td {
  vertical-align: middle !important;
  font-size: var(--fs-lg);
}

.os-table th {
  font-weight: 600;
  user-select: none;
  border-top: none;
  background: var(--clr-bg);
}

.os-table tbody tr:hover {
  background: var(--clr-bg-light) !important;
}

@media (max-width: 700px) {
  .os-list-container {
    padding: var(--space-md);
  }
  .os-table th,
  .os-table td {
    font-size: var(--fs-sm);
  }
}
</style>
