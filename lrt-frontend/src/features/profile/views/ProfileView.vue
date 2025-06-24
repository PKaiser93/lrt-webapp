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
          <div class="meta-info text-secondary d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-md-start">
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
              <h5 class="section-title mb-3"><i class="bi bi-info-circle me-2"></i>Nutzerinformationen</h5>
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
              <h5 class="section-title mb-3"><i class="bi bi-person-lines-fill me-2"></i>Persönlich</h5>
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
import http from '@/shared/api/http'
import { useToastStore } from '@/shared/stores/toast'
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
  } catch {
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
  background: var(--clr-bg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-light);
  margin-top: var(--space-lg);
  padding-bottom: var(--space-lg);
}
.profile-header {
  overflow: hidden;
}
.bg-gradient-header {
  background: linear-gradient(
      120deg,
      var(--clr-bg-light) 30%,
      var(--clr-card-bg) 100%
  );
}
.avatar-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(
      135deg,
      rgba(56, 139, 253, 0.2) 50%,
      #fff 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: var(--clr-primary-start);
  box-shadow: var(--shadow-strong);
}
.text-gradient {
  background: linear-gradient(
      90deg,
      var(--clr-primary-start) 10%,
      var(--clr-primary-end) 90%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.action-buttons .btn {
  font-size: var(--fs-sm);
}
.btn-gradient {
  background: linear-gradient(90deg, var(--clr-primary-start), var(--clr-primary-end) 70%);
  color: #fff;
  border: none;
  border-radius: var(--radius-md);
  padding: var(--space-xs) var(--space-md);
  font-weight: 600;
  transition: background 0.2s, box-shadow 0.2s;
}
.btn-gradient:hover {
  background: linear-gradient(90deg, var(--clr-primary-end), var(--clr-primary-start) 70%);
}
.btn-outline-gradient {
  background: transparent;
  border: 2px solid var(--clr-primary-start);
  color: var(--clr-primary-start);
  border-radius: var(--radius-md);
  padding: var(--space-xs) var(--space-md);
  font-weight: 500;
  transition: background 0.2s, color 0.2s;
}
.btn-outline-gradient:hover {
  background: var(--clr-primary-start);
  color: #fff;
}
.badge-admin {
  background: rgba(56, 139, 253, 0.15);
  color: var(--clr-primary-start);
  font-size: var(--fs-xs);
  text-transform: uppercase;
  border-radius: var(--radius-md);
  padding: var(--space-xs) var(--space-sm);
  font-weight: 600;
  letter-spacing: 0.02em;
}
.profile-details {
  background: var(--clr-card-bg);
  margin-bottom: var(--space-lg);
}
.section-card {
  background: var(--clr-bg-light);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-light);
}
.section-title {
  font-size: var(--fs-md);
  color: var(--clr-primary-end);
  font-weight: 600;
}
.meta-info span {
  display: inline-flex;
  align-items: center;
}
.badge.bg-primary-soft {
  background: #e7f4ff;
  color: var(--clr-primary-start);
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
