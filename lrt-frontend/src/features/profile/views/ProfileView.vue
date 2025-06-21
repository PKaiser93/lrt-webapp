<template>
  <div class="profile-wrapper container py-4">
    <!-- Überschrift -->
    <div class="d-flex justify-content-between align-items-center mb-4 gap-2 flex-wrap">
      <h2 class="mb-0 text-gradient fw-bold d-flex align-items-center gap-2">
        <i class="bi bi-person-circle me-2"></i>Mein Profil
      </h2>
      <div class="d-flex gap-2 flex-wrap">
        <button class="btn btn-gradient d-flex align-items-center gap-2 shadow-sm" @click="showEdit = true">
          <i class="bi bi-pencil"></i> Bearbeiten
        </button>
        <button class="btn btn-outline-gradient d-flex align-items-center gap-2 shadow-sm" @click="showPassword = true">
          <i class="bi bi-key"></i> Passwort ändern
        </button>
      </div>
    </div>

    <!-- Lade-Spinner -->
    <div v-if="loading" class="text-center my-5">
      <span class="spinner-border text-primary"></span>
    </div>

    <!-- Profil anzeigen -->
    <div v-else-if="profile" class="card shadow-sm rounded-4 border-0">
      <div class="card-body">
        <div class="row gy-2 gx-3">
          <div class="col-md-6">
            <p><strong>Benutzername:</strong> {{ profile.username }}</p>
            <p><strong>E‑Mail:</strong>      {{ profile.email }}</p>
          </div>
          <div class="col-md-6">
            <p><strong>Vorname:</strong> {{ profile.firstName }}</p>
            <p><strong>Nachname:</strong> {{ profile.lastName }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Fehler-Status -->
    <div v-else class="alert alert-danger text-center py-4">
      <i class="bi bi-exclamation-triangle me-2"></i>
      Profil konnte nicht geladen werden.
    </div>

    <!-- Modal zum Bearbeiten -->
    <ProfileEditModal
        v-if="showEdit"
        :initial-profile="profile"
        @close="showEdit = false"
        @saved="onProfileSaved"
    />
    <!-- Modal Passwort ändern -->
    <ChangePasswordModal
        v-if="showPassword"
        @close="showPassword = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import http from '@/api/http'
import { useToastStore } from '@/stores/toast'
import ProfileEditModal from '@/features/profile/components/ProfileEditModal.vue'
import ChangePasswordModal from '@/features/profile/components/ChangePasswordModal.vue'

const toast    = useToastStore()
const profile  = ref(null)
const loading  = ref(false)
const showEdit = ref(false)
const showPassword = ref(false)

async function fetchProfile() {
  loading.value = true
  try {
    const res = await http.get('/profile')
    profile.value = res.data
  } catch (err) {
    toast.show('Profil konnte nicht geladen werden', 'danger')
    profile.value = null
  } finally {
    loading.value = false
  }
}

function onProfileSaved(newData) {
  profile.value = newData
  showEdit.value = false
}

onMounted(fetchProfile)
</script>

<style scoped>
.profile-wrapper {
  background: #f8fafc;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(44,62,80,0.07);
  margin-top: 30px;
}

/* Überschrift wie in den anderen Listen */
.text-gradient {
  background: linear-gradient(90deg, #388bfd 10%, #38d6ae 90%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
}

/* Einheitliche Card-Gestaltung */
.card {
  border-radius: 1.3rem;
}

.btn-gradient {
  background: linear-gradient(90deg,#3a7bd5,#00d2ff 70%);
  color: #fff;
  font-weight: 600;
  border: none;
  border-radius: 1.2em;
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
  border-radius: 1.2em;
  transition: background 0.15s, color 0.15s;
}
.btn-outline-gradient:hover, .btn-outline-gradient:focus {
  background: linear-gradient(90deg,#3a7bd5,#00d2ff 70%);
  color: #fff;
}
@media (max-width: 700px) {
  .profile-wrapper { padding: 12px 2px !important; }
}
</style>
