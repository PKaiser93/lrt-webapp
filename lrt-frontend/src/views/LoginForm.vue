<template>
  <div class="container py-5" style="max-width: 500px">
    <h2 class="mb-4 text-center">🔐 Login</h2>
    <form @submit.prevent="submit">
      <div class="mb-3">
        <label class="form-label">Benutzername</label>
        <input
            v-model="credentials.username"
            class="form-control"
            required
            autocomplete="username"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">Passwort</label>
        <input
            type="password"
            v-model="credentials.password"
            class="form-control"
            required
            autocomplete="current-password"
        />
      </div>
      <button class="btn btn-primary w-100" :disabled="loading">
        <span v-if="loading">Lade...</span>
        <span v-else>▶️ Login</span>
      </button>
      <!-- Fehleranzeige -->
      <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const credentials = ref({ username: '', password: '' })
const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const error = ref('')
const loading = ref(false)

const submit = async () => {
  error.value = ''
  loading.value = true
  try {
    await auth.login(credentials.value)
    // Redirect nach ursprünglicher Route oder Standard
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
