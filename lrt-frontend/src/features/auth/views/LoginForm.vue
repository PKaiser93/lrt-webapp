<template>
  <div class="login-wrapper container d-flex flex-column align-items-center text-center py-5 animate-fadein">
    <h1 class="display-5 fw-bold mb-4 gradient-text">
      <i class="bi bi-box-arrow-in-right me-2"></i> Anmeldung
    </h1>

    <div class="login-card p-4">
      <form @submit.prevent="submit" novalidate>
        <div class="mb-3 text-start">
          <label class="form-label fw-semibold">Benutzername</label>
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-person-fill"></i></span>
            <input
                v-model="credentials.username"
                type="text"
                class="form-control"
                placeholder="Benutzername"
                required
                autocomplete="username"
            />
          </div>
        </div>

        <div class="mb-4 text-start">
          <label class="form-label fw-semibold">Passwort</label>
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-lock-fill"></i></span>
            <input
                v-model="credentials.password"
                type="password"
                class="form-control"
                placeholder="Passwort"
                required
                autocomplete="current-password"
            />
          </div>
        </div>

        <button
            type="submit"
            class="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2 mb-3"
            :disabled="loading"
        >
          <template v-if="loading">
            <span class="spinner-border spinner-border-sm" role="status"></span> Anmelden…
          </template>
          <template v-else>
            <i class="bi bi-arrow-right-circle"></i> Anmelden
          </template>
        </button>

        <div v-if="error" class="alert alert-danger py-2 mb-0">
          {{ error }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/shared/stores/auth'

const credentials = ref({ username: '', password: '' })
const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const error = ref('')
const loading = ref(false)

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await auth.login(credentials.value)
    const target = route.query.redirect || '/home'
    router.push(target)
  } catch (err) {
    error.value =
        err?.response?.data?.error ||
        err?.message ||
        'Fehler bei der Anmeldung.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-top: 8vh;
  background: linear-gradient(135deg, #eef2f7, #ffffff);
  background-attachment: fixed;
}

/* Gradient-Text (aus global) */
.gradient-text {
  background: linear-gradient(135deg, var(--clr-primary-start), var(--clr-primary-end));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Login-Card: Abstand statt Transform */
.login-card {
  width: 100%;
  max-width: 360px;
  background: #ffffff;
  backdrop-filter: blur(8px);
  border-radius: 1rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  margin-top: 1rem;       /* <-- genug Abstand zur Überschrift */
}

/* Inputs */
.input-group-text {
  background: transparent;
  border: none;
  border-bottom: 2px solid #ced4da;
  border-radius: 0;
  padding-right: 0.75rem;
  color: #6c757d;
}

.form-control {
  border: none;
  border-bottom: 2px solid #ced4da;
  border-radius: 0;
  box-shadow: none;
}

.form-control:focus {
  box-shadow: none;
  border-bottom-color: var(--clr-primary-start);
}

/* Button */
.btn-primary {
  background-color: var(--clr-primary-start);
  border: none;
  border-radius: var(--radius-md);
  padding: var(--space-sm) var(--space-md);
  font-weight: 600;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(41, 121, 255, 0.4);
}

/* Error-Alert */
.alert-danger {
  font-size: var(--fs-sm);
  border-radius: var(--radius-sm);
}

/* Animation */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(40px); }
  to   { opacity: 1; transform: translateY(0); }
}

.animate-fadein {
  animation: fadeIn 0.8s ease-out both;
}
</style>
