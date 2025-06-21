<template>
  <div class="trash-wrapper container py-4">
    <h2 class="mb-4 text-gradient fw-bold">
      <i class="bi bi-trash3 me-2"></i>Papierkorb
    </h2>

    <!-- Tabs mit Count-Badges -->
    <ul class="nav nav-tabs mb-3" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link d-flex align-items-center gap-2" :class="{active: tab==='computer'}" @click="tab='computer'" role="tab">
          <i class="bi bi-pc-display"></i> Computer
          <span class="badge bg-primary-soft">{{ trash.computer.length }}</span>
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link d-flex align-items-center gap-2" :class="{active: tab==='kategorie'}" @click="tab='kategorie'" role="tab">
          <i class="bi bi-tags"></i> Kategorien
          <span class="badge bg-warning-soft">{{ trash.kategorie.length }}</span>
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link d-flex align-items-center gap-2" :class="{active: tab==='os'}" @click="tab='os'" role="tab">
          <i class="bi bi-windows"></i> Betriebssysteme
          <span class="badge bg-info-soft">{{ trash.os.length }}</span>
        </button>
      </li>
    </ul>

    <!-- Papierkorb leeren Button -->
    <div class="d-flex justify-content-end mb-3" v-if="trash[tab].length">
      <button class="btn btn-outline-danger d-flex align-items-center gap-2 px-3" @click="deleteAll(tab)">
        <i class="bi bi-trash3"></i> Papierkorb leeren
      </button>
    </div>

    <!-- Table or EmptyState -->
    <TrashTable
        v-if="trash[tab].length"
        :items="trash[tab]"
        :loading="loading[tab]"
        :type="tab"
        :fields="fieldsForTab"
        @restore="restore"
        @delete="deleteSingle"
    />

    <!-- Empty State falls leer -->
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
import http from '@/api/http'
import { useToastStore } from '@/stores/toast'
import TrashTable from '@/features/papierkorb/components/TrashTable.vue'
import EmptyState from '@/components/EmptyState.vue'

const toast = useToastStore()
const tab = ref('computer')
const trash = ref({ computer: [], kategorie: [], os: [] })
const loading = ref({ computer: false, kategorie: false, os: false })

const fields = {
  computer: [
    {key:'dnsName', label:'DNS'},
    {key:'marke', label:'Marke'},
    {key:'ram', label:'RAM'}
  ],
  kategorie: [
    {key:'bezeichnung', label:'Bezeichnung'},
    {key:'farbe', label:'Farbe', badge:true}
  ],
  os: [
    {key:'name', label:'Name'}
  ]
}
const fieldsForTab = computed(() => fields[tab.value])

const icons = {
  computer: 'bi bi-pc-display',
  kategorie: 'bi bi-tags',
  os: 'bi bi-windows'
}
const iconForTab = computed(() => icons[tab.value])

const emptyDesc = computed(() =>
    ({
      computer: 'Kein gelöschter Computer gefunden.',
      kategorie: 'Keine gelöschte Kategorie im Papierkorb.',
      os: 'Keine gelöschten Betriebssysteme.'
    })[tab.value]
)

function loadAll() { loadComputer(); loadKategorie(); loadOS(); }
async function loadComputer() {
  loading.value.computer = true
  try {
    trash.value.computer = (await http.get('/computer/trash/list')).data.filter(x => x.deleted)
  } finally { loading.value.computer = false }
}
async function loadKategorie() {
  loading.value.kategorie = true
  try {
    trash.value.kategorie = (await http.get('/kategorie/trash/list')).data.filter(x => x.deleted)
  } finally { loading.value.kategorie = false }
}
async function loadOS() {
  loading.value.os = true
  try {
    trash.value.os = (await http.get('/betriebssystem/trash/list')).data.filter(x => x.deleted)
  } finally { loading.value.os = false }
}

async function restore(type, id) {
  let endpoint = ''
  if (type === 'computer') endpoint = `/computer/${id}/restore`
  if (type === 'kategorie') endpoint = `/kategorie/${id}/restore`
  if (type === 'os') endpoint = `/betriebssystem/${id}/restore`
  try {
    await http.patch(endpoint)
    toast.show(
        (type === 'computer' ? 'Computer' : type === 'kategorie' ? 'Kategorie' : 'Betriebssystem')
        + ' wiederhergestellt!', 'success'
    )
    loadAll()
  } catch {
    toast.show('Fehler beim Wiederherstellen', 'danger')
  }
}

async function deleteSingle(type, id) {
  if (!confirm('Wirklich endgültig löschen?')) return;
  let endpoint = ''
  if (type === 'computer') endpoint = `/computer/${id}`
  if (type === 'kategorie') endpoint = `/kategorie/${id}`
  if (type === 'os') endpoint = `/betriebssystem/${id}`
  try {
    await http.delete(endpoint)
    toast.show('Endgültig gelöscht!', 'success')
    loadAll()
  } catch {
    toast.show('Fehler beim Löschen', 'danger')
  }
}

async function deleteAll(type) {
  if (!confirm('Wirklich den gesamten Papierkorb endgültig löschen?')) return
  let endpoint = ''
  if (type === 'computer') endpoint = `/computer/hard-delete-all`
  if (type === 'kategorie') endpoint = `/kategorie/hard-delete-all`
  if (type === 'os') endpoint = `/betriebssystem/hard-delete-all`
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
  background: #fafdff;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(44, 62, 80, 0.07);
  margin-top: 30px;
}
.text-gradient {
  background: linear-gradient(90deg,#ff9360 10%,#388bfd 80%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
}
.badge {
  font-size: 1em;
  font-weight: 500;
  border-radius: 0.77em;
  padding: 0.32em 1em;
  box-shadow: 0 2px 9px #b6cfff13;
}
.bg-primary-soft { background: #e7f4ff; color: #2c7be5; }
.bg-warning-soft { background: #fff9e6; color: #ffc542; }
.bg-info-soft { background: #eaf6fb; color: #45b6fe; }
</style>
