<script setup>
import {ref, onMounted, computed} from 'vue';
import { useBetriebssystemStore } from '@/features/betriebssystem/store/betriebssystemStore';
import BetriebssystemTableRow from '@/features/betriebssystem/components/BetriebssystemTableRow.vue';
import BetriebssystemForm from '@/features/betriebssystem/components/BetriebssystemForm.vue';

const store = useBetriebssystemStore();
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
function deleteItem(id) {
  if (confirm('Wirklich löschen?')) store.delete(id);
}

const filteredItems = computed(() =>
    store.items.filter(
        x =>
            !search.value ||
            x.name?.toLowerCase().includes(search.value.toLowerCase())
    )
);

onMounted(() => {
  store.fetchAll();
});
</script>

<template>
  <div class="os-list-container">
    <div class="os-list-header">
      <div>
        <h2 class="gradient-text mb-1 d-flex align-items-center">
          <i class="bi bi-microsoft me-2"></i>
          Betriebssysteme
        </h2>
        <div class="subtitle mb-2">Alle aktiven Betriebssysteme in der Datenbank</div>
      </div>
      <button class="btn btn-gradient" @click="openForm()">
        <i class="bi bi-plus-circle me-2"></i> Neues Betriebssystem
      </button>
    </div>

    <div class="os-list-actions d-flex flex-wrap align-items-center mb-3 gap-3">
      <div class="input-group search-group">
        <span class="input-group-text bg-white border-end-0">
          <i class="bi bi-search"></i>
        </span>
        <input
            v-model="search"
            class="form-control border-start-0"
            placeholder="Suchen …"
        />
      </div>
      <router-link
          to="/betriebssystem/trash"
          class="btn btn-outline-gradient ms-auto"
      >
        <i class="bi bi-trash3"></i> Papierkorb
      </router-link>
    </div>

    <div v-if="store.isLoading" class="text-center py-5">
      <span class="spinner-border text-primary"></span>
    </div>
    <div v-else>
      <div v-if="!filteredItems.length" class="alert alert-info text-center my-5">
        Keine Betriebssysteme gefunden.
      </div>
      <div v-else class="table-responsive rounded-4 shadow-sm">
        <table class="table table-hover align-middle mb-0 os-table">
          <thead>
          <tr>
            <th><i class="bi bi-ubuntu me-2"></i>Name</th>
            <th style="width:180px" class="text-end">Aktionen</th>
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

    <BetriebssystemForm
        v-if="showForm"
        :item="editItem"
        @close="closeForm"
        @saved="() => { closeForm(); store.fetchAll(); }"
    />
  </div>
</template>

<style scoped>
.os-list-container {
  background: #fafdff;
  border-radius: 24px;
  box-shadow: 0 8px 32px 0 rgba(32,78,118,.09);
  padding: 32px 20px 30px;
  margin-top: 36px;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.os-list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  flex-wrap: wrap;
  margin-bottom: 18px;
}
.gradient-text {
  background: linear-gradient(90deg,#3a7bd5,#00d2ff 60%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  font-weight: bold;
}
.subtitle {
  color: #3a7bd5bb;
  font-size: 1rem;
  margin-left: 3px;
}
.btn-gradient {
  background: linear-gradient(90deg,#3a7bd5,#00d2ff 70%);
  color: #fff;
  border: none;
  font-weight: 600;
  border-radius: 12px;
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
  border-radius: 12px;
  transition: background 0.15s, color 0.15s;
}
.btn-outline-gradient:hover, .btn-outline-gradient:focus {
  background: linear-gradient(90deg,#3a7bd5,#00d2ff 70%);
  color: #fff;
}
.search-group {
  min-width: 230px;
}
.os-table thead tr {
  background: linear-gradient(90deg,#eaf6fb,#e3f5ff 100%);
  border-top-left-radius: 18px;
  border-top-right-radius: 18px;
}
.os-table th, .os-table td {
  vertical-align: middle !important;
  font-size: 1.08em;
}
.os-table th {
  font-weight: 600;
  user-select: none;
  border-top: none;
}
.os-table tbody tr:hover {
  background: #e3f6ff !important;
  transition: background 0.1s;
}
.os-table td {
  background: none !important;
}
@media (max-width: 700px) {
  .os-list-container {
    padding: 13px 4px 15px;
  }
  .os-table th, .os-table td {
    font-size: 0.96em;
  }
}
</style>
