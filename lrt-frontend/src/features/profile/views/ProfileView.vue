<template>
  <div class="profile-wrapper container py-4">
    <!-- Header Card -->
    <div class="profile-header card shadow-sm border-0 rounded-4 mb-4 overflow-hidden">
      <div class="bg-gradient-header p-4 d-flex flex-column flex-md-row align-items-center gap-4">
        <!-- Avatar -->
        <div class="profile-avatar flex-shrink-0">
          <div class="avatar-circle shadow-lg">
            <i class="bi bi-person-circle"></i>
          </div>
        </div>

        <!-- Name & Meta -->
        <div class="flex-grow-1 text-center text-md-start">
          <h2 class="mb-1 text-gradient fw-bold d-flex align-items-center gap-2 justify-content-center justify-content-md-start">
            {{ profile?.firstName || '' }} {{ profile?.lastName || '' }}
            <span v-if="profile?.isAdmin" class="badge badge-admin">Admin</span>
          </h2>
          <div class="meta-info text-muted d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-md-start">
            <span><i class="bi bi-person me-1"></i><strong>{{ profile?.username }}</strong></span>
            <span><i class="bi bi-envelope me-1"></i>{{ profile?.email }}</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="action-buttons d-flex gap-2">
          <button class="btn btn-gradient" @click="showEdit = true">
            <i class="bi bi-pencil"></i> Bearbeiten
          </button>
          <button class="btn btn-outline-gradient" @click="showPassword = true">
            <i class="bi bi-key"></i> Passwort ändern
          </button>
        </div>
      </div>
    </div>

    <!-- Loading Spinner -->
    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <!-- Profile Details Card -->
    <div v-else-if="profile" class="profile-details card shadow-sm rounded-4 border-0">
      <div class="card-body p-4">
        <div class="row gx-4 gy-3">
          <!-- Nutzerinformationen -->
          <div class="col-12 col-md-6">
            <div class="section-card p-3">
              <h5 class="section-title mb-3"><i class="bi bi-info-circle me-2"></i>Nutzer­informationen</h5>
              <dl class="row mb-0">
                <dt class="col-5">Benutzername</dt>
                <dd class="col-7">{{ profile.username }}</dd>
                <dt class="col-5">E‑Mail</dt>
                <dd class="col-7">{{ profile.email }}</dd>
                <dt class="col-5">Rolle</dt>
                <dd class="col-7">
                  <span class="badge bg-primary-soft text-primary text-capitalize px-3 py-1">
                    {{ profile.isAdmin ? 'Admin' : 'Nutzer' }}
                  </span>
                </dd>
              </dl>
            </div>
          </div>
          <!-- Persönliche Daten -->
          <div class="col-12 col-md-6">
            <div class="section-card p-3">
              <h5 class="section-title mb-3"><i class="bi bi-person-lines-fill me-2"></i>Persön­lich</h5>
              <dl class="row mb-0">
                <dt class="col-5">Vorname</dt>
                <dd class="col-7">{{ profile.firstName || '–' }}</dd>
                <dt class="col-5">Nachname</dt>
                <dd class="col-7">{{ profile.lastName || '–' }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="alert alert-danger text-center py-4">
      <i class="bi bi-exclamation-triangle me-2"></i>
      Profil konnte nicht geladen werden.
    </div>

    <!-- Profile Edit Modal -->
    <ProfileEditModal
        v-if="showEdit"
        :initial-profile="profile"
        @close="showEdit = false"
        @saved="onProfileSaved"
    />

    <!-- Change Password Modal -->
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
  border-radius: 1rem;
  box-shadow: 0 8px 32px rgba(44, 62, 80, 0.05);
  margin-top: 2rem;
}
.profile-header {
  overflow: hidden;
}
.bg-gradient-header {
  background: linear-gradient(120deg, #fafdff 30%, #e7f1fa 100%);
}
.avatar-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(56, 139, 253,0.2) 50%, #fff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: #388bfd;
  box-shadow: 0 4px 16px rgba(56, 139, 253, 0.2);
}
.text-gradient {
  background: linear-gradient(90deg, #388bfd 10%, #38d6ae 90%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.action-buttons .btn {
  min-width: 0;
  width: auto;
  font-size: 0.95rem;
}
.btn-gradient {
  background: linear-gradient(90deg, #3a7bd5, #00d2ff 70%);
  color: #fff;
  font-weight: 600;
  border: none;
  border-radius: 1.2rem;
  padding: 0.6rem 1.4rem;
  transition: background 0.3s, box-shadow 0.3s;
}
.btn-gradient:hover {
  background: linear-gradient(90deg, #00d2ff, #3a7bd5 70%);
}
.btn-outline-gradient {
  border: 2px solid #3a7bd5;
  color: #3a7bd5;
  background: #fafdff;
  font-weight: 500;
  border-radius: 1.2rem;
  padding: 0.5rem 1.2rem;
  transition: background 0.3s, color 0.3s, box-shadow 0.3s;
}
.btn-outline-gradient:hover {
  background: linear-gradient(90deg, #3a7bd5, #00d2ff 70%);
  color: #fff;
}
.badge-admin {
  background: rgba(56, 139, 253, 0.15);
  color: #1464c7;
  font-size: 0.9rem;
  text-transform: uppercase;
  border-radius: 1rem;
  padding: 0.25em 0.8em;
  font-weight: 600;
  letter-spacing: 0.02em;
}
.meta-info span {
  display: inline-flex;
  align-items: center;
}
.profile-details {
  background: #fff;
  margin-bottom: 2rem;
}
.section-card {
  background: #f8fafc;
  border-radius: 1rem;
  box-shadow: 0 4px 24px rgba(58, 123, 213, 0.08);
}
.section-title {
  font-size: 1rem;
  color: #3a7bd5;
  font-weight: 600;
}
.dl dt {
  font-weight: 600;
}
.badge.bg-primary-soft {
  background: #e7f4ff;
}
.badge.bg-primary-soft.text-primary {
  color: #2c7be5;
}
@media (max-width: 768px) {
  .meta-info {
    justify-content: center !important;
    text-align: center;
  }
  .action-buttons {
    justify-content: center;
  }
}
</style>
