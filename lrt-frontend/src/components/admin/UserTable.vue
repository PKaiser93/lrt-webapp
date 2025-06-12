<template>
  <div class="container py-4">
    <h2 class="mb-4">👥 Benutzerverwaltung</h2>

    <!-- ✅ Neue User anlegen -->
    <form @submit.prevent="createUser" class="card card-body mb-4 shadow-sm">
      <div class="row g-2">
        <div class="col-md-4">
          <input v-model="newUser.username" class="form-control" placeholder="Benutzername" required />
        </div>
        <div class="col-md-4">
          <input v-model="newUser.password" class="form-control" placeholder="Passwort" type="password" required />
        </div>
        <div class="col-md-3">
          <select v-model="newUser.isAdmin" class="form-select">
            <option :value="false">User</option>
            <option :value="true">Admin</option>
          </select>
        </div>
        <div class="col-md-1 d-grid">
          <button class="btn btn-success">➕</button>
        </div>
      </div>
    </form>

    <!-- 👁️ Benutzerliste -->
    <table class="table table-striped table-hover shadow-sm">
      <thead>
      <tr>
        <th>👤 Benutzername</th>
        <th>🛡️ Rolle</th>
        <th class="text-end">🗑️</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="user in users" :key="user._id">
        <td>{{ user.username }}</td>
        <td>
            <span class="badge" :class="user.isAdmin ? 'bg-primary' : 'bg-secondary'">
              {{ user.isAdmin ? 'Admin' : 'User' }}
            </span>
        </td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-danger" @click="deleteUser(user._id)">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import http from '../../api/http'
import { showToast } from '../../utils/toast'

const users = ref([])
const newUser = ref({ username: '', password: '', isAdmin: false })

const loadUsers = async () => {
  users.value = (await http.get('/auth')).data
}

const createUser = async () => {
  try {
    await http.post('/auth/register', newUser.value)
    showToast('✅ Benutzer erstellt')
    newUser.value = { username: '', password: '', isAdmin: false }
    await loadUsers()
  } catch (err) {
    showToast('❌ Fehler beim Anlegen', 'danger')
  }
}

const deleteUser = async (id) => {
  try {
    await http.delete(`/auth/${id}`)
    showToast('🗑️ Benutzer gelöscht')
    await loadUsers()
  } catch (err) {
    showToast('⚠️ Fehler beim Löschen', 'danger')
  }
}

onMounted(loadUsers)
</script>
