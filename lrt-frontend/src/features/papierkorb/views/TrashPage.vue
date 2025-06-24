<template>
  <div class="trash-wrapper container py-4">
    <h2 class="mb-4 text-gradient fw-bold d-flex align-items-center gap-2">
      <i class="bi bi-trash3"></i> Papierkorb
    </h2>

    <!-- Tabs mit Count-Badges -->
    <ul class="nav modern-tabs mb-3" role="tablist">
      <li class="nav-item" role="presentation" v-for="t in tabs" :key="t.key">
        <button
            class="nav-link d-flex align-items-center gap-2"
            :class="{ active: tab === t.key }"
            @click="tab = t.key"
            type="button"
        >
          <i :class="t.icon"></i> {{ t.label }}
          <span :class="['badge', t.badgeClass]">{{ trash[t.key].length }}</span>
        </button>
      </li>
    </ul>

    <!-- Papierkorb leeren Button -->
    <div class="d-flex justify-content-end mb-3" v-if="trash[tab].length">
      <button
          class="btn btn-outline-danger d-flex align-items-center gap-2"
          @click="deleteAll(tab)"
      >
        <i class="bi bi-trash3"></i>
        Papierkorb leeren
      </button>
    </div>

    <!-- Tabelle oder EmptyState -->
    <TrashTable
        v-if="trash[tab].length"
        :items="trash[tab]"
        :loading="loading[tab]"
        :type="tab"
        :fields="fieldsForTab"
        @restore="restore"
        @delete="deleteSingle"
    />

    <EmptyState
        v-else
        :icon="iconForTab"
        title="Nichts im Papierkorb"
        :description="emptyDesc"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import http from '@/shared/api/http'
import { useToastStore } from '@/shared/stores/toast'
import TrashTable from '@/features/papierkorb/components/TrashTable.vue'
import EmptyState from '@/shared/components/EmptyState.vue'

const toast = useToastStore()
const tab = ref('computer')
const trash = ref({ computer: [], kategorie: [], os: [] })
const loading = ref({ computer: false, kategorie: false, os: false })

// Tab‑Definitionen für Label, Icon und Badge‑Farbe
const tabs = [
  { key: 'computer', label: 'Computer', icon: 'bi bi-pc-display', badgeClass: 'bg-primary-soft' },
  { key: 'kategorie', label: 'Kategorien', icon: 'bi bi-tags', badgeClass: 'bg-warning-soft' },
  { key: 'os', label: 'Betriebssysteme', icon: 'bi bi-windows', badgeClass: 'bg-info-soft' },
]

// Felder pro Typ (wird an TrashTable übergeben)
const fields = {
  computer: [
    { key: 'dnsName', label: 'DNS' },
    { key: 'marke', label: 'Marke' },
    { key: 'ram', label: 'RAM' }
  ],
  kategorie: [
    { key: 'bezeichnung', label: 'Bezeichnung' },
    { key: 'farbe', label: 'Farbe', badge: true }
  ],
  os: [
    { key: 'name', label: 'Name' }
  ]
}
const fieldsForTab = computed(() => fields[tab.value])

const icons = {
  computer: 'bi bi-pc-display',
  kategorie: 'bi bi-tags',
  os: 'bi bi-windows'
}
const iconForTab = computed(() => icons[tab.value])

const emptyDesc = computed(() => ({
  computer: 'Kein gelöschter Computer gefunden.',
  kategorie: 'Keine gelöschte Kategorie im Papierkorb.',
  os: 'Keine gelöschten Betriebssysteme.'
}[tab.value]))

// Daten laden
async function loadComputer() {
  loading.value.computer = true
  try {
    const res = await http.get('/computer/trash/list')
    trash.value.computer = res.data.filter(x => x.deleted)
  } finally {
    loading.value.computer = false
  }
}
async function loadKategorie() {
  loading.value.kategorie = true
  try {
    const res = await http.get('/kategorie/trash/list')
    trash.value.kategorie = res.data.filter(x => x.deleted)
  } finally {
    loading.value.kategorie = false
  }
}
async function loadOS() {
  loading.value.os = true
  try {
    const res = await http.get('/betriebssystem/trash/list')
    trash.value.os = res.data.filter(x => x.deleted)
  } finally {
    loading.value.os = false
  }
}
function loadAll() {
  loadComputer()
  loadKategorie()
  loadOS()
}

// Wiederherstellen
async function restore(type, id) {
  const endpoint = {
    computer: `/computer/${id}/restore`,
    kategorie: `/kategorie/${id}/restore`,
    os: `/betriebssystem/${id}/restore`
  }[type]
  try {
    await http.patch(endpoint)
    toast.show(`${ type === 'computer' ? 'Computer'
        : type === 'kategorie' ? 'Kategorie'
            : 'Betriebssystem' } wiederhergestellt!`, 'success')
    loadAll()
  } catch {
    toast.show('Fehler beim Wiederherstellen', 'danger')
  }
}

// Einzelnes Endgültig löschen
async function deleteSingle(type, id) {
  if (!confirm('Wirklich endgültig löschen?')) return
  const endpoint = {
    computer: `/computer/${id}`,
    kategorie: `/kategorie/${id}`,
    os: `/betriebssystem/${id}`
  }[type]
  try {
    await http.delete(endpoint)
    toast.show('Endgültig gelöscht!', 'success')
    loadAll()
  } catch {
    toast.show('Fehler beim Löschen', 'danger')
  }
}

// Gesamten Trash leeren
async function deleteAll(type) {
  if (!confirm('Wirklich den gesamten Papierkorb endgültig löschen?')) return
  const endpoint = {
    computer: '/computer/hard-delete-all',
    kategorie: '/kategorie/hard-delete-all',
    os: '/betriebssystem/hard-delete-all'
  }[type]
  try {
    await http.delete(endpoint)
    toast.show('Papierkorb geleert!', 'success')
    loadAll()
  } catch {
    toast.show('Fehler beim Leeren', 'danger')
  }
}

onMounted(loadAll)
</script>

<style scoped>
.trash-wrapper {
  background: var(--clr-card-bg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-light);
  margin-top: var(--space-lg);
  padding: var(--space-md);
}

/* Gradient‑Titel */
.text-gradient {
  background: linear-gradient(90deg, var(--clr-primary-start) 10%, var(--clr-primary-end) 80%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Die modern-tabs Klasse aus eurem globalen CSS */
.modern-tabs .nav-link {
  font-weight: 500;
  color: var(--clr-secondary);
  background: var(--clr-card-bg);
  border: none;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}
.modern-tabs .nav-link.active {
  color: var(--clr-primary-end);
  border-bottom-color: var(--clr-primary-end);
}

/* Count‑Badges */
.badge {
  font-size: var(--fs-sm);
  font-weight: 500;
  border-radius: var(--radius-md);
  padding: var(--space-xs) var(--space-sm);
}
.bg-primary-soft { background: #e7f4ff; color: #2c7be5; }
.bg-warning-soft { background: #fff9e6; color: #ffc542; }
.bg-info-soft    { background: #eaf6fb; color: #45b6fe; }

/* Outline‑Danger Button */
.btn-outline-danger {
  background: transparent;
  border: 1px solid #dc3545;
  color: #dc3545;
  border-radius: var(--radius-sm);
  padding: var(--space-xs) var(--space-sm);
  transition: background 0.2s, color 0.2s;
}
.btn-outline-danger:hover {
  background: #dc3545;
  color: #fff;
}

/* Container-Abstände */
.nav {
  margin-bottom: var(--space-md);
}
</style>
