<template>
  <div class="trash-wrapper container py-4">
    <h2 class="mb-4 text-gradient fw-bold">
      <i class="bi bi-trash3 me-2"></i>Papierkorb
    </h2>

    <ul class="nav nav-tabs mb-3" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link" :class="{active: tab==='computer'}" @click="tab='computer'" role="tab">
          <i class="bi bi-pc-display me-1"></i> Computer
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" :class="{active: tab==='kategorie'}" @click="tab='kategorie'" role="tab">
          <i class="bi bi-tags me-1"></i> Kategorien
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" :class="{active: tab==='os'}" @click="tab='os'" role="tab">
          <i class="bi bi-windows me-1"></i> Betriebssysteme
        </button>
      </li>
    </ul>

    <div class="d-flex justify-content-end mb-3" v-if="trash[tab].length">
      <button class="btn btn-outline-danger d-flex align-items-center gap-2" @click="deleteAll(tab)">
        <i class="bi bi-trash3"></i> Papierkorb leeren
      </button>
    </div>

    <TrashTable
        v-if="tab === 'computer'"
        :items="trash.computer"
        :loading="loading.computer"
        type="computer"
        :fields="[
        {key:'dnsName', label:'DNS'},
        {key:'marke', label:'Marke'},
        {key:'ram', label:'RAM'}
      ]"
        @restore="restore"
        @delete="deleteSingle"
    />
    <TrashTable
        v-else-if="tab === 'kategorie'"
        :items="trash.kategorie"
        :loading="loading.kategorie"
        type="kategorie"
        :fields="[
        {key:'bezeichnung', label:'Bezeichnung'},
        {key:'farbe', label:'Farbe', badge:true}
      ]"
        @restore="restore"
        @delete="deleteSingle"
    />
    <TrashTable
        v-else
        :items="trash.os"
        :loading="loading.os"
        type="os"
        :fields="[
        {key:'name', label:'Name'}
      ]"
        @restore="restore"
        @delete="deleteSingle"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import http from '@/api/http'
import { useToastStore } from '@/stores/toast'
import TrashTable from '@/features/papierkorb/components/TrashTable.vue' // Falls ausgelagert

const toast = useToastStore()

const tab = ref('computer')
const trash = ref({ computer: [], kategorie: [], os: [] })
const loading = ref({ computer: false, kategorie: false, os: false })

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
    toast.show('Wiederhergestellt!', 3500)
    loadAll()
  } catch {
    toast.show('Fehler beim Wiederherstellen', 3500)
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
    toast.show('Endgültig gelöscht!', 3500)
    loadAll()
  } catch {
    toast.show('Fehler beim Löschen', 3500)
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
    toast.show('Papierkorb geleert!', 3500)
    loadAll()
  } catch {
    toast.show('Fehler beim Leeren', 3500)
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
</style>
