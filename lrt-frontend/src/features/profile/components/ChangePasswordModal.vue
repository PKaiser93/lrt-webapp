<template>
  <div class="container py-4">
    <h2 class="mb-4 text-gradient">Passwort ändern</h2>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <form @submit.prevent="submit">
      <div class="mb-3">
        <label class="form-label">Altes Passwort</label>
        <input v-model="form.currentPassword" type="password" class="form-control" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Neues Passwort</label>
        <input v-model="form.newPassword" type="password" class="form-control" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Neues Passwort bestätigen</label>
        <input v-model="form.confirmPassword" type="password" class="form-control" required />
      </div>
      <button type="submit" class="btn btn-gradient" :disabled="saving">
        {{ saving ? "Speichern..." : "Passwort speichern" }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import http from '@/api/http';
import { useToastStore } from '@/stores/toast';
import router from '@/router';

const toast = useToastStore();
const form = ref({ currentPassword: '', newPassword: '', confirmPassword: '' });
const error = ref('');
const saving = ref(false);

async function submit() {
  error.value = '';
  if (form.value.newPassword !== form.value.confirmPassword) {
    error.value = 'Die neuen Passwörter stimmen nicht überein.';
    return;
  }
  saving.value = true;
  try {
    await http.post('/profile/password', {
      currentPassword: form.value.currentPassword,
      newPassword: form.value.newPassword
    });
    toast.show('Passwort geändert', 'success');
    // Felder leeren
    form.value.currentPassword = '';
    form.value.newPassword = '';
    form.value.confirmPassword = '';
    router.push('/profile');
  } catch (e) {
    error.value = e.response?.data?.error || 'Fehler beim Ändern';
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped>
.text-gradient {
  background: linear-gradient(90deg,#ff9360,#388bfd);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}
</style>
