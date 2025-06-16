<template>
  <div class="container py-4">
    <h2 class="mb-4"><i class="bi bi-trash3 me-2"></i>Papierkorb</h2>

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

    <div v-if="tab==='computer'">
      <h5 class="mb-3">Gelöschte Computer</h5>
      <div v-if="loading.computer" class="py-5 text-center"><span class="spinner-border"></span></div>
      <div v-else>
        <table v-if="trash.computer.length" class="table table-striped table-hover">
          <thead>
          <tr>
            <th>DNS</th>
            <th>Marke</th>
            <th>RAM</th>
            <th>Aktionen</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="comp in trash.computer" :key="comp._id">
            <td>{{ comp.dnsName }}</td>
            <td>{{ comp.marke }}</td>
            <td>{{ comp.ram }}</td>
            <td>
              <button class="btn btn-sm btn-success" @click="restore('computer', comp._id)">
                <i class="bi bi-arrow-clockwise me-1"></i> Wiederherstellen
              </button>
            </td>
          </tr>
          </tbody>
        </table>
        <div v-else class="alert alert-secondary">Keine gelöschten Computer.</div>
      </div>
    </div>

    <div v-else-if="tab==='kategorie'">
      <h5 class="mb-3">Gelöschte Kategorien</h5>
      <div v-if="loading.kategorie" class="py-5 text-center"><span class="spinner-border"></span></div>
      <div v-else>
        <table v-if="trash.kategorie.length" class="table table-striped table-hover">
          <thead>
          <tr>
            <th>Bezeichnung</th>
            <th>Farbe</th>
            <th>Aktionen</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="kat in trash.kategorie" :key="kat._id">
            <td>{{ kat.bezeichnung }}</td>
            <td>
              <span class="badge" :style="{ backgroundColor: kat.farbe }">{{ kat.farbe }}</span>
            </td>
            <td>
              <button class="btn btn-sm btn-success" @click="restore('kategorie', kat._id)">
                <i class="bi bi-arrow-clockwise me-1"></i> Wiederherstellen
              </button>
            </td>
          </tr>
          </tbody>
        </table>
        <div v-else class="alert alert-secondary">Keine gelöschten Kategorien.</div>
      </div>
    </div>

    <div v-else>
      <h5 class="mb-3">Gelöschte Betriebssysteme</h5>
      <div v-if="loading.os" class="py-5 text-center"><span class="spinner-border"></span></div>
      <div v-else>
        <table v-if="trash.os.length" class="table table-striped table-hover">
          <thead>
          <tr>
            <th>Name</th>
            <th>Aktionen</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="os in trash.os" :key="os._id">
            <td>{{ os.name }}</td>
            <td>
              <button class="btn btn-sm btn-success" @click="restore('os', os._id)">
                <i class="bi bi-arrow-clockwise me-1"></i> Wiederherstellen
              </button>
            </td>
          </tr>
          </tbody>
        </table>
        <div v-else class="alert alert-secondary">Keine gelöschten Betriebssysteme.</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import http from '../api/http'
import { showToast } from '../utils/toast'

const tab = ref('computer')
const trash = ref({ computer: [], kategorie: [], os: [] })
const loading = ref({ computer: false, kategorie: false, os: false })

function loadAll() {
  loadComputer()
  loadKategorie()
  loadOS()
}

async function loadComputer() {
  loading.value.computer = true
  try {
    trash.value.computer = (await http.get('/computer?deleted=true')).data
  } finally {
    loading.value.computer = false
  }
}
async function loadKategorie() {
  loading.value.kategorie = true
  try {
    trash.value.kategorie = (await http.get('/kategorie?deleted=true')).data
  } finally {
    loading.value.kategorie = false
  }
}
async function loadOS() {
  loading.value.os = true
  try {
    trash.value.os = (await http.get('/betriebssystem?deleted=true')).data
  } finally {
    loading.value.os = false
  }
}

async function restore(type, id) {
  let endpoint = ''
  if (type === 'computer') endpoint = `/computer/${id}/restore`
  if (type === 'kategorie') endpoint = `/kategorie/${id}/restore`
  if (type === 'os') endpoint = `/betriebssystem/${id}/restore`
  try {
    await http.patch(endpoint)
    showToast('Wiederhergestellt!', 'success')
    loadAll()
  } catch {
    showToast('Fehler beim Wiederherstellen', 'danger')
  }
}

onMounted(loadAll)
</script>
