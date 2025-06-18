<template>
  <div class="login-wrapper container d-flex flex-column align-items-center text-center pt-5 animate-fadein">
    <h1 class="display-5 fw-bold mb-4">
      <i class="bi bi-box-arrow-in-right me-2"></i> Login
    </h1>
    <div class="login-card bg-white shadow-sm rounded-4 p-4">
      <form @submit.prevent="submit" novalidate>
        <div class="mb-3 text-start">
          <label class="form-label fw-semibold">Benutzername</label>
          <div class="input-group">
            <span class="input-group-text bg-white border-end-0">
              <i class="bi bi-person-fill"></i>
            </span>
            <input
                v-model="credentials.username"
                type="text"
                class="form-control border-start-0"
                placeholder="Dein Benutzername"
                required
                autocomplete="username"
            />
          </div>
        </div>
        <div class="mb-4 text-start">
          <label class="form-label fw-semibold">Passwort</label>
          <div class="input-group">
            <span class="input-group-text bg-white border-end-0">
              <i class="bi bi-lock-fill"></i>
            </span>
            <input
                v-model="credentials.password"
                type="password"
                class="form-control border-start-0"
                placeholder="Dein Passwort"
                required
                autocomplete="current-password"
            />
          </div>
        </div>
        <button
            type="submit"
            class="btn btn-gradient w-100 d-flex align-items-center justify-content-center gap-2 mb-3"
            :disabled="loading"
        >
          <span v-if="loading">
            <span class="spinner-border spinner-border-sm"></span> Lade...
          </span>
          <span v-else>▶️ Login</span>
        </button>
        <div v-if="error" class="alert alert-danger mb-0">{{ error }}</div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

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
        '❌ Login fehlgeschlagen.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-wrapper {
  background: linear-gradient(145deg, #f9fafb, #eef1f5);
  border-radius: 20px;
  padding: 60px 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  animation: fadeIn 1s ease-out;
  /* kein min-height mehr, so sitzt es oben */
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(40px); }
  to   { opacity: 1; transform: translateY(0); }
}

.login-card {
  width: 100%;
}

.btn-gradient {
  background: linear-gradient(90deg, #3a7bd5, #00d2ff 70%);
  color: #fff;
  border: none;
  font-weight: 600;
  border-radius: 14px;
  padding: 10px 0;
  box-shadow: 0 2px 12px #00d2ff22;
  transition: background 0.2s, box-shadow 0.2s;
}
.btn-gradient:hover,
.btn-gradient:focus {
  background: linear-gradient(90deg, #00d2ff, #3a7bd5 70%);
  box-shadow: 0 4px 18px #00d2ff33;
}
</style>
