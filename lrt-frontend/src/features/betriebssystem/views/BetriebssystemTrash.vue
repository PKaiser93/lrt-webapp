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
  <div class="os-list-container shadow-lg">
    <div class="os-list-header d-flex justify-content-between align-items-center flex-wrap mb-2">
      <div>
        <h2 class="gradient-text mb-1 d-flex align-items-center">
          <i class="bi bi-trash3 me-2"></i>
          Gelöschte Betriebssysteme
        </h2>
        <div class="subtitle mb-2">Hier kannst du gelöschte Betriebssysteme wiederherstellen</div>
      </div>
    </div>

    <div class="table-responsive rounded-4 shadow-sm mt-3">
      <table class="table table-hover align-middle mb-0 os-table">
        <thead>
        <tr>
          <th style="width:60px"><i class="bi bi-hash"></i></th>
          <th><i class="bi bi-ubuntu me-2"></i>Name</th>
          <th style="width:180px" class="text-end">Aktion</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(bs, i) in store.trash" :key="bs._id">
          <td>{{ i + 1 }}</td>
          <td>
            <i class="bi bi-hdd-network me-2 text-primary"></i>
            {{ bs.name }}
          </td>
          <td class="text-end">
            <button
                class="btn btn-gradient d-inline-flex align-items-center gap-2 px-4 py-2"
                @click="restoreItem(bs._id)"
                title="Wiederherstellen"
            >
              <i class="bi bi-arrow-clockwise"></i>
            </button>
          </td>
        </tr>
        <tr v-if="!store.trash.length">
          <td colspan="3" class="py-5 text-center text-secondary fs-5">
            <i class="bi bi-emoji-laughing text-primary fs-2 mb-2 d-block"></i>
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
  background: #fafdff;
  border-radius: 24px;
  box-shadow: 0 8px 32px 0 rgba(32,78,118,.09), 0 1.5px 8px rgba(0,210,255,0.08);
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
  border-radius: 14px;
  padding: 8px 20px;
  box-shadow: 0 2px 12px #00d2ff13;
  transition: background 0.2s, box-shadow 0.2s;
}
.btn-gradient:hover, .btn-gradient:focus {
  background: linear-gradient(90deg,#00d2ff,#3a7bd5 70%);
  color: #fff;
  box-shadow: 0 4px 18px #3a7bd525;
}
.os-table th, .os-table td {
  vertical-align: middle !important;
  font-size: 1.08em;
}
.os-table th {
  font-weight: 600;
  user-select: none;
  border-top: none;
  background: linear-gradient(90deg,#eaf6fb,#e3f5ff 100%);
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
