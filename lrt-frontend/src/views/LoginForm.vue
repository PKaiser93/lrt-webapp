<template>
  <div class="container py-5" style="max-width: 500px">
    <h2 class="mb-4 text-center">🔐 Login</h2>
    <form @submit.prevent="submit">
      <div class="mb-3">
        <label class="form-label">Benutzername</label>
        <input v-model="credentials.username" class="form-control" />
      </div>
      <div class="mb-3">
        <label class="form-label">Passwort</label>
        <input type="password" v-model="credentials.password" class="form-control" />
      </div>
      <button class="btn btn-primary w-100">▶️ Login</button>
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

const submit = async () => {
  try {
    await auth.login(credentials.value)
    console.log('✅ Login erfolgreich')

    // Redirect nach ursprünglicher Route oder Standard
    const target = route.query.redirect || '/home'
    router.push(target)
  } catch (err) {
    alert('❌ Login fehlgeschlagen.')
  }
}
</script>
