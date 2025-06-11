<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light px-4">
    <router-link class="navbar-brand" :to="homeLink">💻 LRT Verwaltung</router-link>

    <div class="collapse navbar-collapse justify-content-end">
      <ul class="navbar-nav">
        <template v-if="userStore.isAuthenticated">
          <!-- Computer Dropdown -->
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
              <i class="bi bi-pc-display-horizontal me-1"></i> Computer
            </a>
            <ul class="dropdown-menu">
              <li>
                <router-link class="dropdown-item" to="/computer">
                  <i class="bi bi-card-list me-1"></i> Computerliste
                </router-link>
              </li>
              <li>
                <router-link class="dropdown-item" to="/computer/neu">
                  <i class="bi bi-plus-circle me-1"></i> Computer anlegen
                </router-link>
              </li>
            </ul>
          </li>

          <!-- Betriebssystem Dropdown -->
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
              <i class="bi bi-windows me-1"></i> Betriebssysteme
            </a>
            <ul class="dropdown-menu">
              <li>
                <router-link class="dropdown-item" to="/betriebssystem">
                  <i class="bi bi-card-list me-1"></i> OS-Liste
                </router-link>
              </li>
              <li>
                <router-link class="dropdown-item" to="/betriebssystem/neu">
                  <i class="bi bi-plus-circle me-1"></i> OS anlegen
                </router-link>
              </li>
            </ul>
          </li>

          <!-- Kategorie Dropdown -->
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
              <i class="bi bi-tags me-1"></i> Kategorien
            </a>
            <ul class="dropdown-menu">
              <li>
                <router-link class="dropdown-item" to="/kategorie">
                  <i class="bi bi-card-list me-1"></i> Kategorienliste
                </router-link>
              </li>
              <li>
                <router-link class="dropdown-item" to="/kategorie/neu">
                  <i class="bi bi-plus-circle me-1"></i> Kategorie anlegen
                </router-link>
              </li>
            </ul>
          </li>

          <!-- Admin Dashboard -->
          <li class="nav-item" v-if="userStore.isAdmin">
            <router-link class="nav-link" to="/admin">Dashboard</router-link>
          </li>

          <!-- Benutzer Info -->
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
              Eingeloggt als {{ userStore.user.name }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><a class="dropdown-item" href="#" @click.prevent="logout">Logout</a></li>
            </ul>
          </li>
        </template>

        <template v-else>
          <li class="nav-item"><router-link class="nav-link" to="/login">Login</router-link></li>
        </template>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { useUserStore } from '../stores/user'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

const userStore = useUserStore()
const router = useRouter()
const homeLink = computed(() => userStore.isAuthenticated ? '/home' : '/')

const logout = () => {
  userStore.logout()
  router.push('/')
}
</script>
