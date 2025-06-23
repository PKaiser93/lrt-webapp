<template>
  <nav class="navbar navbar-expand-lg glass-topbar py-2 shadow-lg position-sticky top-0 z-3">
    <div class="container-fluid px-3 d-flex justify-content-between align-items-center">
      <!-- Brand mit Gradient-Leiste -->
      <div class="d-flex align-items-center brand-highlight pe-3">
        <router-link
            class="navbar-brand d-flex align-items-center gap-2"
            :to="auth.isAuthenticated ? '/home' : '/'"
        >
          <i class="bi bi-cpu-fill fs-3 text-primary"></i>
          <span class="fw-bold logo-text">LRT WebApp</span>
        </router-link>
      </div>

      <!-- Burger für mobile -->
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

      <!-- Main Nav -->
      <div class="collapse navbar-collapse justify-content-end" id="navbarNavDropdown">
        <ul class="navbar-nav align-items-center gap-2 ms-auto">
          <template v-if="auth.isAuthenticated">
            <!-- Direktlinks -->
            <li class="nav-item">
              <router-link class="nav-link" to="/computer">
                <i class="bi bi-pc-display-horizontal me-1"></i>Computer
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/betriebssystem">
                <i class="bi bi-windows me-1"></i>Betriebssysteme
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/kategorie">
                <i class="bi bi-tags me-1"></i>Kategorien
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/student">
                <i class="bi bi-mortarboard me-1"></i>Studenten
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/tickets">
                <i class="bi bi-ticket me-1"></i>Tickets
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/trash">
                <i class="bi bi-trash3 me-1"></i>Papierkorb
              </router-link>
            </li>
            <!-- Admin Dashboard -->
            <li class="nav-item" v-if="auth.user?.isAdmin">
              <router-link class="nav-link" to="/admin">
                <i class="bi bi-bar-chart-line me-1"></i>Dashboard
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
              <ul class="dropdown-menu dropdown-menu-end dropdown-menu-glass" aria-labelledby="userDropdown">
                <li>
                  <router-link class="dropdown-item" to="/profile">
                    <i class="bi bi-person me-1"></i>Profil
                  </router-link>
                </li>
                <li v-if="auth.user?.isAdmin">
                  <router-link class="dropdown-item" to="/settings">
                    <i class="bi bi-gear me-1"></i>Einstellungen
                  </router-link>
                </li>
                <!-- Hier die neuen Links -->
                <li v-if="auth.user?.isAdmin">
                  <router-link class="dropdown-item" to="/documentation">
                    <i class="bi bi-journal-text me-1"></i>Dokumentation
                  </router-link>
                </li>
<!--                <li v-if="auth.user?.isAdmin">
                  <router-link class="dropdown-item" to="/api-docs">
                    <i class="bi bi-code-slash me-1"></i>API Docs
                  </router-link>
                </li>-->
                <hr class="dropdown-divider">
                <li>
                  <button @click="handleLogout" class="dropdown-item text-danger">
                    <i class="bi bi-box-arrow-right me-1"></i>Logout
                  </button>
                </li>
              </ul>
            </li>
          </template>

          <template v-else>
            <li class="nav-item">
              <router-link class="nav-link" to="/login">
                <i class="bi bi-box-arrow-in-right me-1"></i>Login
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
import { useRouter } from 'vue-router'

const auth   = useAuthStore()
const router = useRouter()

function handleLogout() {
  auth.logout()
  router.push('/')
}
</script>

<style scoped>
.glass-topbar {
  background: rgba(245, 249, 255, 0.93);
  backdrop-filter: blur(18px) saturate(170%);
  border-bottom: 2.2px solid #e4eefa;
  box-shadow: 0 8px 32px 0 rgba(56,139,253,0.13), 0 2.5px 8px rgba(44,100,204,0.12);
  border-radius: 0 0 22px 22px;
  transition: background 0.21s, box-shadow 0.22s;
  position: sticky;
  top: 0; z-index: 1090;
  min-height: 66px;
  animation: glass-fade-in 0.5s;
}
@keyframes glass-fade-in {
  from { opacity: 0; filter: blur(8px);}
  to   { opacity: 1; filter: blur(0);}
}
.brand-highlight {
  border-left: 6px solid #388bfd;
  padding-left: 0.9rem;
  background: linear-gradient(90deg,rgba(56,139,253,0.10) 5%,transparent 65%);
  border-radius: 0 14px 14px 0;
  margin-right: 14px;
}
.logo-text {
  color: #2673c9;
  letter-spacing: 0.2px;
  font-size: 1.44rem;
  text-shadow: 0 2px 10px #b7c8fa15;
  background: linear-gradient(90deg, #2673c9 40%, #388bfd 90%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.navbar-brand {
  font-weight: 700;
  font-size: 1.28rem;
  padding: 0.08rem 0.5rem;
  border-radius: 11px;
  transition: background 0.13s;
}
.navbar-brand:hover {
  background: #e7f1fa;
}
.navbar-nav .nav-link {
  color: #2359aa !important;
  font-weight: 500;
  border-radius: 10px;
  padding: 0.45rem 1.13rem;
  font-size: 1.12rem;
  transition: background 0.13s, color 0.13s, box-shadow 0.16s;
}
.navbar-nav .nav-link:hover, .navbar-nav .nav-link.active {
  background: linear-gradient(90deg,#e7f1fa 75%,#cfe6ff 100%);
  color: #12569b !important;
  box-shadow: 0 1.5px 12px #388bfd16;
}
.dropdown-menu-glass {
  background: rgba(252, 253, 255, 0.97);
  border: 1.6px solid #e6ebf2;
  box-shadow: 0 10px 30px rgba(56, 139, 253, 0.11);
  border-radius: 0.95rem;
  min-width: 210px;
  font-size: 1rem;
}
.dropdown-item {
  color: #1e61af;
  border-radius: 0.53rem;
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
.avatar-circle {
  width: 34px;
  height: 34px;
  background: linear-gradient(135deg,#388bfd 60%,#39e6b5 100%);
  color: #fff;
  border-radius: 50%;
  font-weight: 700;
  font-size: 1.13rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 13px #388bfd24;
  margin-left: 2px;
  border: 2.2px solid #f1f5fa;
  transition: border 0.13s;
}
.avatar-circle:hover {
  border: 2.2px solid #388bfd;
}
@media (max-width: 900px) {
  .brand-highlight { border-left-width: 4px; padding-left: 0.6rem;}
  .glass-topbar { border-radius: 0 0 15px 15px; }
  .navbar-brand { font-size: 1.1rem;}
  .logo-text { font-size: 1.08rem;}
  .avatar-circle { width: 30px; height: 30px; font-size: 1rem; }
}
@media (max-width: 650px) {
  .brand-highlight { border-radius: 0 8px 8px 0; }
  .glass-topbar { border-radius: 0 0 9px 9px;}
}
</style>
