<template>
  <div class="profile-wrapper container py-4">
    <!-- Kopfbereich mit Avatar, Name, Actions -->
    <div class="profile-header card shadow-sm border-0 rounded-4 mb-4 px-0">
      <div class="card-body d-flex flex-column flex-md-row align-items-center gap-4 p-4 pb-3">
        <div class="profile-avatar">
          <div class="avatar-circle shadow-lg">
            <i class="bi bi-person-circle"></i>
          </div>
        </div>
        <div class="flex-grow-1 w-100">
          <h2 class="mb-1 text-gradient fw-bold d-flex align-items-center gap-2 fs-2">
            {{ profile?.firstName || '' }} {{ profile?.lastName || '' }}
            <span v-if="profile?.isAdmin" class="badge badge-admin ms-2">Admin</span>
          </h2>
          <div class="text-muted mb-2 d-flex align-items-center gap-3 flex-wrap">
            <span><i class="bi bi-person"></i> <strong>{{ profile?.username }}</strong></span>
            <span><i class="bi bi-envelope"></i> {{ profile?.email }}</span>
          </div>
        </div>
        <!-- Buttons kompakt, nebeneinander -->
        <div class="d-flex flex-row gap-2 flex-shrink-0">
          <button class="btn btn-gradient d-flex align-items-center gap-2 shadow-sm" @click="showEdit = true">
            <i class="bi bi-pencil"></i> Bearbeiten
          </button>
          <button class="btn btn-outline-gradient d-flex align-items-center gap-2 shadow-sm" @click="showPassword = true">
            <i class="bi bi-key"></i> Passwort ändern
          </button>
        </div>
      </div>
    </div>

    <!-- Lade-Spinner -->
    <div v-if="loading" class="text-center my-5">
      <span class="spinner-border text-primary"></span>
    </div>

    <!-- Profil-Details -->
    <div v-else-if="profile" class="profile-details card shadow-sm rounded-4 border-0">
      <div class="card-body">
        <div class="row g-4">
          <div class="col-12 col-md-6">
            <h6 class="mb-2 text-uppercase text-muted small">Nutzerinformationen</h6>
            <dl class="row mb-0">
              <dt class="col-5">Benutzername:</dt>
              <dd class="col-7">{{ profile.username }}</dd>
              <dt class="col-5">E‑Mail:</dt>
              <dd class="col-7">{{ profile.email }}</dd>
              <dt class="col-5">Rolle:</dt>
              <dd class="col-7">
                <span class="badge bg-primary-soft text-primary text-capitalize px-3 py-1">{{ profile.isAdmin ? 'Admin' : 'Nutzer' }}</span>
              </dd>
            </dl>
          </div>
          <div class="col-12 col-md-6">
            <h6 class="mb-2 text-uppercase text-muted small">Persönlich</h6>
            <dl class="row mb-0">
              <dt class="col-5">Vorname:</dt>
              <dd class="col-7">{{ profile.firstName || '–' }}</dd>
              <dt class="col-5">Nachname:</dt>
              <dd class="col-7">{{ profile.lastName || '–' }}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>

    <!-- Fehler-Status -->
    <div v-else class="alert alert-danger text-center py-4">
      <i class="bi bi-exclamation-triangle me-2"></i>
      Profil konnte nicht geladen werden.
    </div>

    <!-- Modals -->
    <ProfileEditModal
        v-if="showEdit"
        :initial-profile="profile"
        @close="showEdit = false"
        @saved="onProfileSaved"
    />
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

const toast = useToastStore()
const profile = ref(null)
const loading = ref(false)
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
.profile-header {
  background: linear-gradient(90deg,#fafdff 40%,#e7f1fa 100%);
  border-radius: 1.3rem;
  box-shadow: 0 3px 16px #3a7bd515;
}
.profile-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
}
.avatar-circle {
  width: 82px;
  height: 82px;
  border-radius: 50%;
  background: linear-gradient(135deg,#388bfd20 50%,#fafdff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3.3rem;
  color: #388bfd;
  box-shadow: 0 3px 13px #388bfd25;
}
.profile-details {
  margin-top: 16px;
  background: #fff;
  border-radius: 1.3rem;
}
.badge-admin {
  background: #388bfd18;
  color: #1464c7;
  font-size: 0.99em;
  letter-spacing: .03em;
  border-radius: 1.2em;
  padding: 0.38em 1.15em;
  font-weight: 600;
}
.bg-primary-soft {
  background: #e7f4ff;
  color: #2c7be5;
}
.text-gradient {
  background: linear-gradient(90deg,#388bfd 10%,#38d6ae 90%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
}
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
  min-width: 0;
  width: auto;
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
  min-width: 0;
  width: auto;
}
.btn-outline-gradient:hover, .btn-outline-gradient:focus {
  background: linear-gradient(90deg,#3a7bd5,#00d2ff 70%);
  color: #fff;
}
@media (max-width: 700px) {
  .profile-header, .profile-details, .profile-wrapper { padding: 10px 2px !important; }
  .profile-header { flex-direction: column !important; }
  .avatar-circle { width: 65px; height: 65px; font-size: 2.4rem; }
  /* Buttons untereinander auf Mobile */
  .profile-header .d-flex.flex-row {
    flex-direction: column !important;
    width: 100%;
    gap: 9px !important;
    margin-top: 6px;
  }
}
</style>
