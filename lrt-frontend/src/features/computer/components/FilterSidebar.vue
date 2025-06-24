<template>
  <form
      class="filter-toolbar d-flex align-items-center flex-nowrap gap-2"
      @submit.prevent="applyFilters"
      autocomplete="off"
  >
    <!-- Suchfeld -->
    <div class="input-group flex-grow-1">
      <span class="input-group-text"><i class="bi bi-search"></i></span>
      <input
          v-model="localSearch"
          class="form-control form-control-sm"
          placeholder="Suche…"
      />
    </div>

    <!-- Regex-Toggle -->
    <button
        type="button"
        :class="['btn', 'btn-sm', 'btn-icon', { active: localRegex }]"
        @click="localRegex = !localRegex"
        title="Regex-Suche"
    >
      <i class="bi bi-code-slash"></i>
    </button>

    <!-- Kategorie (breiter) -->
    <div class="input-group select-kategorie">
      <span class="input-group-text"><i class="bi bi-folder2"></i></span>
      <select v-model="localKategorie" class="form-select form-select-sm">
        <option value="">Kategorie (alle)</option>
        <option
            v-for="k in kategorieList"
            :key="k._id"
            :value="k.bezeichnung"
        >{{ k.bezeichnung }}</option>
      </select>
    </div>

    <!-- OS (breiter) -->
    <div class="input-group select-os">
      <span class="input-group-text"><i class="bi bi-hdd-network"></i></span>
      <select v-model="localOS" class="form-select form-select-sm">
        <option value="">OS (alle)</option>
        <option
            v-for="os in osList"
            :key="os._id || os.name"
            :value="os.name || os"
        >{{ os.name || os }}</option>
      </select>
    </div>

    <!-- Filtern & Zurücksetzen -->
    <button type="submit" class="btn btn-primary btn-sm d-flex align-items-center gap-1">
      <i class="bi bi-funnel"></i> Filtern
    </button>
    <button type="button" class="btn btn-outline btn-sm" @click="resetFilters">
      <i class="bi bi-x-circle"></i>
    </button>
  </form>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  kategorieList: { type: Array, default: () => [] },
  osList:         { type: Array, default: () => [] },
  search:         String,
  useRegex:       Boolean,
  selectedKategorie: String,
  selectedOS:        String,
});
const emit = defineEmits([
  'update:search',
  'update:useRegex',
  'update:selectedKategorie',
  'update:selectedOS',
  'apply'
]);

// lokale Refs für das v-model
const localSearch     = ref(props.search ?? '');
const localRegex      = ref(props.useRegex ?? false);
const localKategorie  = ref(props.selectedKategorie ?? '');
const localOS         = ref(props.selectedOS ?? '');

// Props → lokale Refs
watch(() => props.search, v => localSearch.value = v);
watch(() => props.useRegex, v => localRegex.value = v);
watch(() => props.selectedKategorie, v => localKategorie.value = v);
watch(() => props.selectedOS, v => localOS.value = v);

// lokale Refs → Emits
watch(localSearch, v => emit('update:search', v));
watch(localRegex, v => emit('update:useRegex', v));
watch(localKategorie, v => emit('update:selectedKategorie', v));
watch(localOS, v => emit('update:selectedOS', v));

function applyFilters() {
  emit('apply');
}

function resetFilters() {
  localSearch.value     = '';
  localRegex.value      = false;
  localKategorie.value  = '';
  localOS.value         = '';
  applyFilters();
}
</script>

<style scoped>
.filter-toolbar {
  background: var(--clr-card-bg);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-light);
  overflow-x: auto;
}

.flex-grow-1 {
  flex: 1 1 auto;
  min-width: 150px;
}

/* Regex‐Toggle Button */
.btn-icon {
  width: 2.2rem;
  height: 2.2rem;
  padding: 0;
  font-size: 1rem;
  border: 1px solid var(--clr-border);
  background: var(--clr-bg);
  color: var(--clr-secondary);
  transition: all 0.2s;
}
.btn-icon.active,
.btn-icon:hover,
.btn-icon:focus {
  border-color: var(--clr-primary-start);
  background: var(--clr-bg);
  color: var(--clr-primary-start);
}

/* Kategorie breiter */
.select-kategorie {
  flex: 0 0 180px;
}

/* OS breiter */
.select-os {
  flex: 0 0 180px;
}

.form-control-sm,
.form-select-sm {
  padding: var(--space-xs) var(--space-sm);
  font-size: var(--fs-sm);
}
</style>
