<template>
  <div class="badge-container">
    <span class="badge" :class="statusClass">
      <i class="bi" :class="iconClass"></i> {{ statusText }}
    </span>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'
import {computed} from "vue";
const auth = useAuthStore()

const statusClass = computed(() =>
    auth.user
        ? 'bg-success text-white'
        : 'bg-secondary text-white'
)

const iconClass = computed(() =>
    auth.user
        ? 'bi-check-circle-fill'
        : 'bi-lock-fill'
)

const statusText = computed(() =>
    auth.user
        ? `Eingeloggt als ${auth.user.username}`
        : 'Nicht eingeloggt'
)
</script>

<style scoped>
.badge-container {
  display: flex;
  justify-content: center;
}

.badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.95rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
