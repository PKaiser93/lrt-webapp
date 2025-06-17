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
  <!-- Desktop: Filter horizontal, Buttons nebeneinander -->
  <form
      class="filter-toolbar d-none d-md-flex align-items-end flex-wrap gap-2 mb-3"
      @submit.prevent="applyFilters"
      autocomplete="off"
  >
    <input
        v-model="localSearch"
        class="form-control"
        style="max-width: 220px"
        placeholder="🔍 Suche, z.B. DNS:lrt076 RAM<16"
        @keyup.enter="applyFilters"
    />
    <div class="form-check form-switch mb-0 ms-1">
      <input class="form-check-input" type="checkbox" id="regexSwitch" v-model="localRegex" />
      <label class="form-check-label ms-1" for="regexSwitch">Regex</label>
    </div>
    <select v-model="localKategorie" class="form-select" style="max-width: 180px">
      <option value="">📁 Kategorie (alle)</option>
      <option v-for="k in kategorieList" :key="k?._id" :value="k?.bezeichnung">{{ k?.bezeichnung }}</option>
    </select>
    <select v-model="localOS" class="form-select" style="max-width: 180px">
      <option value="">💽 OS (alle)</option>
      <option v-for="os in osList" :key="os?._id" :value="os?.name">{{ os?.name }}</option>
    </select>
    <div class="d-flex gap-2">
      <button type="submit" class="btn btn-primary">Filter anwenden</button>
      <button type="button" class="btn btn-outline-secondary" @click="resetFilters">Reset</button>
    </div>
  </form>

  <!-- Mobile: Offcanvas Sidebar -->
  <div class="d-flex d-md-none mb-3">
    <button
        class="btn btn-outline-primary"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasFilter"
        aria-controls="offcanvasFilter"
    >
      <i class="bi bi-funnel"></i> Filter
    </button>
  </div>
  <div
      class="offcanvas offcanvas-start"
      tabindex="-1"
      id="offcanvasFilter"
      aria-labelledby="offcanvasFilterLabel"
  >
    <div class="offcanvas-header">
      <h5 class="offcanvas-title" id="offcanvasFilterLabel">Filter</h5>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body">
      <form @submit.prevent="applyFilters" autocomplete="off">
        <input
            v-model="localSearch"
            class="form-control mb-3"
            placeholder="🔍 Suche, z.B. DNS:lrt076 RAM<16"
        />
        <div class="form-check form-switch mb-3">
          <input class="form-check-input" type="checkbox" id="regexSwitchMobile" v-model="localRegex" />
          <label class="form-check-label" for="regexSwitchMobile">Regex/Teilwortsuche</label>
        </div>
        <select v-model="localKategorie" class="form-select mb-3">
          <option value="">📁 Kategorie (alle)</option>
          <option v-for="k in kategorieList" :key="k?._id" :value="k?.bezeichnung">{{ k?.bezeichnung }}</option>
        </select>
        <select v-model="localOS" class="form-select mb-3">
          <option value="">💽 OS (alle)</option>
          <option v-for="os in osList" :key="os?._id" :value="os?.name">{{ os?.name }}</option>
        </select>
        <div class="d-flex gap-2">
          <button type="submit" class="btn btn-primary flex-fill">Anwenden</button>
          <button type="button" class="btn btn-outline-secondary flex-fill" @click="resetFilters">Reset</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.filter-toolbar input,
.filter-toolbar select {
  min-width: 120px;
}
</style>
