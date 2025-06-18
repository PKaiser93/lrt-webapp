<template>
  <nav class="navbar navbar-expand-lg glass-topbar py-2 shadow-lg">
    <div class="container-fluid px-3 d-flex justify-content-between align-items-center">
      <!-- Brand -->
      <div class="d-flex align-items-center">
        <router-link
            class="navbar-brand d-flex align-items-center gap-2"
            :to="auth.isAuthenticated ? '/home' : '/'"
        >
          <i class="bi bi-cpu-fill fs-4 text-primary"></i>
          <span class="fw-bold logo-text">LRT WebApp</span>
        </router-link>
      </div>

      <button
          class="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
      >
        <i class="bi bi-list fs-3"></i>
      </button>

      <div class="collapse navbar-collapse justify-content-end" id="navbarNavDropdown">
        <ul class="navbar-nav align-items-center gap-2 ms-auto">
          <template v-if="auth.isAuthenticated">
            <!-- Direktlinks statt Dropdowns -->
            <li class="nav-item">
              <router-link class="nav-link" to="/computer">
                <i class="bi bi-pc-display-horizontal me-1"></i> Computer
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/betriebssystem">
                <i class="bi bi-windows me-1"></i> Betriebssysteme
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/kategorie">
                <i class="bi bi-tags me-1"></i> Kategorien
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/student">
                <i class="bi bi-mortarboard me-1"></i> Studenten
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/trash">
                <i class="bi bi-trash3 me-1"></i> Papierkorb
              </router-link>
            </li>
            <!-- Admin Dashboard -->
            <li class="nav-item" v-if="auth.user?.isAdmin">
              <router-link class="nav-link" to="/admin">
                <i class="bi bi-bar-chart-line me-1"></i> Dashboard
              </router-link>
            </li>
            <!-- User Dropdown -->
            <li class="nav-item dropdown">
              <a
                  class="nav-link dropdown-toggle"
                  href="#"
                  id="userDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
              >
                <i class="bi bi-person-circle me-1"></i>
                {{ auth.user?.username }}
              </a>
              <ul
                  class="dropdown-menu dropdown-menu-end dropdown-menu-glass"
                  aria-labelledby="userDropdown"
              >
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
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()
</script>

<style scoped>
.glass-topbar {
  background: rgba(255,255,255,0.88);
  backdrop-filter: blur(8px);
  border-bottom: 1.5px solid #f1f5f9;
  box-shadow: 0 4px 24px rgba(43, 97, 223, 0.06), 0 1.5px 2px rgba(43, 97, 223, 0.05);
  border-radius: 0 0 18px 18px;
}
.logo-text {
  color: #2673c9;
  letter-spacing: 0.2px;
  font-size: 1.3rem;
}
.navbar-brand {
  font-weight: 700;
  font-size: 1.3rem;
  padding: 0.1rem 0.3rem;
  border-radius: 10px;
  transition: background 0.12s;
}
.navbar-brand:hover {
  background: #e7f1fa;
}
.navbar-nav .nav-link {
  color: #2359aa !important;
  font-weight: 500;
  border-radius: 9px;
  padding: 0.42rem 1.04rem;
  font-size: 1.06rem;
  transition: background 0.13s, color 0.13s;
}
.navbar-nav .nav-link:hover, .navbar-nav .nav-link.active {
  background: #e7f1fa;
  color: #12569b !important;
}
.dropdown-menu-glass {
  background: rgba(252, 253, 255, 0.98);
  border: 1.5px solid #e6ebf2;
  box-shadow: 0 7px 30px rgba(41, 94, 160, 0.08);
  border-radius: 0.75rem;
  min-width: 200px;
  font-size: 1rem;
}
.dropdown-item {
  color: #1e61af;
  border-radius: 0.5rem;
  padding: 0.54rem 1.2rem;
}
.dropdown-item:hover, .dropdown-item:focus {
  background: #e4effb !important;
  color: #12335a !important;
}
.dropdown-item.text-danger {
  color: #e02424 !important;
}
.dropdown-item.text-danger:hover {
  background: #fbeaea !important;
}
.navbar-toggler {
  background: transparent;
  outline: none;
}
.navbar-toggler:focus {
  box-shadow: none;
}
@media (max-width: 700px) {
  .logo-text { font-size: 1.07rem; }
  .glass-topbar { padding-left: 5px; padding-right: 5px;}
  .navbar-nav .nav-link { font-size: 0.99rem; }
}
</style>
