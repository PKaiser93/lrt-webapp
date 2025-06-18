<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  kategorieList: { type: Array, default: () => [] },
  osList: { type: Array, default: () => [] },
  search: String,
  useRegex: Boolean,
  selectedKategorie: String,
  selectedOS: String,
});
const emits = defineEmits([
  'update:search', 'update:useRegex', 'update:selectedKategorie', 'update:selectedOS', 'apply'
]);

const localSearch = ref(props.search ?? '');
const localRegex = ref(props.useRegex ?? false);
const localKategorie = ref(props.selectedKategorie ?? '');
const localOS = ref(props.selectedOS ?? '');

watch(() => props.search, v => localSearch.value = v);
watch(() => props.useRegex, v => localRegex.value = v);
watch(() => props.selectedKategorie, v => localKategorie.value = v);
watch(() => props.selectedOS, v => localOS.value = v);

watch(localSearch, v => emits('update:search', v));
watch(localRegex, v => emits('update:useRegex', v));
watch(localKategorie, v => emits('update:selectedKategorie', v));
watch(localOS, v => emits('update:selectedOS', v));

function applyFilters() {
  emits('apply');
}
function resetFilters() {
  localSearch.value = '';
  localRegex.value = false;
  localKategorie.value = '';
  localOS.value = '';
  applyFilters();
}
</script>

<template>
  <form
      class="filter-toolbar d-flex align-items-center flex-wrap gap-2 mb-3 py-2 px-3 shadow-sm bg-white rounded-4"
      @submit.prevent="applyFilters"
      autocomplete="off"
  >
    <!-- Suchfeld -->
    <div class="input-group searchbox">
      <span class="input-group-text bg-white border-end-0">
        <i class="bi bi-search"></i>
      </span>
      <input
          v-model="localSearch"
          class="form-control border-start-0"
          placeholder="Suche, z.B. DNS:lrt076"
      />
    </div>
    <!-- Kompakter Regex-Switch als Icon -->
    <button
        type="button"
        class="btn btn-icon-switch"
        :class="{'active': localRegex}"
        @click="localRegex = !localRegex"
        title="Regex-Suche aktivieren"
        aria-label="Regex"
    >
      <i class="bi bi-code-slash"></i>
    </button>
    <!-- Kategorie -->
    <div class="input-group" style="max-width: 180px;">
      <span class="input-group-text bg-white border-end-0">
        <i class="bi bi-folder2"></i>
      </span>
      <select v-model="localKategorie" class="form-select border-start-0">
        <option value="">Kategorie (alle)</option>
        <option v-for="k in kategorieList" :key="k?._id" :value="k?.bezeichnung">{{ k?.bezeichnung }}</option>
      </select>
    </div>
    <!-- OS -->
    <div class="input-group" style="max-width: 170px;">
      <span class="input-group-text bg-white border-end-0">
        <i class="bi bi-hdd-network"></i>
      </span>
      <select v-model="localOS" class="form-select border-start-0">
        <option value="">OS (alle)</option>
        <option v-for="os in osList" :key="os._id || os.name || os" :value="os.name || os">
          {{ os.name || os }}
        </option>
      </select>
    </div>
    <!-- Suche Button -->
    <button type="submit" class="btn btn-gradient d-flex align-items-center gap-1">
      <i class="bi bi-funnel"></i>
    </button>
    <!-- Clear Button -->
    <button type="button" class="btn btn-outline-gradient" @click="resetFilters" title="Filter zurücksetzen">
      <i class="bi bi-x-circle"></i>
    </button>
  </form>
</template>

<style scoped>
.filter-toolbar {
  border-radius: 1.3rem;
  box-shadow: 0 2px 16px #2563eb12;
  background: #fafdff;
  flex-wrap: wrap;
  gap: 0.75rem !important;
}

.input-group.searchbox {
  min-width: 210px;
  max-width: 320px;
  flex: 1 1 220px;
}
.input-group input,
.input-group select {
  border-radius: 0 0.75rem 0.75rem 0 !important;
}
.input-group-text {
  border-radius: 0.75rem 0 0 0.75rem !important;
  background: #fff;
  font-size: 1.08em;
}
.btn-icon-switch {
  width: 38px;
  height: 38px;
  padding: 0;
  border-radius: 50%;
  background: #fafdff;
  border: 2px solid #eee;
  color: #a2b1c6;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.16s;
  box-shadow: 0 1px 6px #3a7bd508;
  font-size: 1.19em;
}
.btn-icon-switch.active,
.btn-icon-switch:focus,
.btn-icon-switch:hover {
  border-color: #3a7bd5;
  background: #e3f6ff;
  color: #1879e6;
  box-shadow: 0 2px 8px #3a7bd525;
}

.btn-gradient {
  background: linear-gradient(90deg,#3a7bd5,#00d2ff 70%);
  color: #fff;
  border: none;
  font-weight: 600;
  border-radius: 14px;
  padding: 8px 18px;
  box-shadow: 0 2px 12px #00d2ff13;
  transition: background 0.2s, box-shadow 0.2s;
}
.btn-gradient:hover, .btn-gradient:focus {
  background: linear-gradient(90deg,#00d2ff,#3a7bd5 70%);
  color: #fff;
  box-shadow: 0 4px 18px #3a7bd525;
}

.btn-outline-gradient {
  border: 2px solid #3a7bd5;
  color: #3a7bd5;
  background: #fafdff;
  font-weight: 500;
  border-radius: 14px;
  padding: 8px 16px;
  transition: background 0.15s, color 0.15s, box-shadow 0.2s;
  box-shadow: 0 1px 6px #00d2ff11;
}
.btn-outline-gradient:hover, .btn-outline-gradient:focus {
  background: linear-gradient(90deg,#3a7bd5,#00d2ff 70%);
  color: #fff;
  box-shadow: 0 2px 10px #00d2ff22;
}
</style>
