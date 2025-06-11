<template>
  <div class="container py-5" style="max-width: 500px">
    <h2 class="mb-4">🔐 Login</h2>

    <form @submit.prevent="submit">
      <div class="mb-3">
        <label class="form-label">Benutzername</label>
        <input
            type="text"
            v-model="credentials.username"
            class="form-control"
            placeholder="z. B. admin"
            required
        />
      </div>

      <div class="mb-3">
        <label class="form-label">Passwort</label>
        <input
            type="password"
            v-model="credentials.password"
            class="form-control"
            placeholder="••••••••"
            required
        />
      </div>

      <button class="btn btn-primary w-100" :disabled="loading">
        <i class="bi bi-box-arrow-in-right me-1"></i>
        Einloggen
      </button>
    </form>

    <div v-if="error" class="alert alert-danger mt-3" role="alert">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const credentials = ref({ username: '', password: '' })
const error = ref('')
const loading = ref(false)
const auth = useAuthStore()
const router = useRouter()

const submit = async () => {
  error.value = ''
  loading.value = true

  try {
    await auth.login(credentials.value)
    router.push('/') // 🔁 redirect nach Login
  } catch (err) {
    error.value = 'Login fehlgeschlagen. Bitte überprüfen Sie Ihre Eingaben.'
  } finally {
    loading.value = false
  }
}
</script>
