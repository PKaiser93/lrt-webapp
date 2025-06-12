<template>
  <nav class="navbar navbar-expand-lg topbar px-4 shadow-sm">
    <router-link class="navbar-brand fw-bold text-white" :to="auth.isAuthenticated ? '/home' : '/'">
      💻 LRT WebApp
    </router-link>

    <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
    >
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
      <ul class="navbar-nav align-items-center gap-2">
        <template v-if="auth.isAuthenticated">
          <!-- 💾 Computer -->
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">💾 Computer</a>
            <ul class="dropdown-menu dropdown-menu-dark">
              <li><router-link class="dropdown-item" to="/computer/neu">🆕 Anlegen</router-link></li>
              <li><router-link class="dropdown-item" to="/computer">📄 Liste</router-link></li>
              <li><router-link class="dropdown-item" to="/computer/import">🧩 CSV-Import</router-link></li>
            </ul>
          </li>

          <!-- 🪟 Betriebssystem -->
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">🪟 OS</a>
            <ul class="dropdown-menu dropdown-menu-dark">
              <li><router-link class="dropdown-item" to="/betriebssystem/neu">➕ Anlegen</router-link></li>
              <li><router-link class="dropdown-item" to="/betriebssystem">📄 Liste</router-link></li>
              <li><router-link class="dropdown-item" to="/betriebssystem/import">🧩 CSV-Import</router-link></li>
            </ul>
          </li>

          <!-- 🏷️ Kategorie -->
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">🏷️ Kategorie</a>
            <ul class="dropdown-menu dropdown-menu-dark">
              <li><router-link class="dropdown-item" to="/kategorie/neu">➕ Anlegen</router-link></li>
              <li><router-link class="dropdown-item" to="/kategorie">📄 Liste</router-link></li>
              <li><router-link class="dropdown-item" to="/kategorie/import">🧩 CSV-Import</router-link></li>
            </ul>
          </li>

          <!-- 📊 Admin Dashboard -->
          <li class="nav-item" v-if="auth.user?.isAdmin">
            <router-link class="nav-link" to="/admin">📊 Dashboard</router-link>
          </li>

          <!-- 👤 User -->
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
              👤 {{ auth.user?.username }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end dropdown-menu-dark">
              <li>
                <button @click="auth.logout" class="dropdown-item text-danger">
                  <i class="bi bi-box-arrow-right me-1"></i> Logout
                </button>
              </li>
            </ul>
          </li>
        </template>

        <template v-else>
          <li class="nav-item">
            <router-link class="nav-link" to="/login">
              <i class="bi bi-box-arrow-in-right me-1"></i> Login
            </router-link>
          </li>
        </template>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'
const auth = useAuthStore()
</script>

<style scoped>
.topbar {
  background: linear-gradient(135deg, #1f2937, #111827);
  color: #fff;
  font-size: 0.95rem;
  border-bottom: 1px solid #2d3748;
}

.navbar-brand {
  font-size: 1.3rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.navbar-nav .nav-link {
  color: #f3f4f6 !important;
  transition: all 0.2s ease-in-out;
}

.navbar-nav .nav-link:hover {
  color: #ffffff !important;
  background-color: rgba(255, 255, 255, 0.08);
  border-radius: 6px;
}

.dropdown-menu {
  border-radius: 0.5rem;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.25);
  font-size: 0.92rem;
}

.dropdown-item:hover {
  background-color: #e2e8f0;
  color: #111827;
}
</style>
