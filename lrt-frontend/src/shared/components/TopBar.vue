<template>
  <nav class="navbar navbar-expand-lg glass-topbar shadow position-sticky top-0 z-3">
    <div class="container-fluid px-3 d-flex justify-content-between align-items-center">
      <!-- Brand -->
      <div class="d-flex align-items-center brand-highlight pe-3">
        <router-link
            class="navbar-brand d-flex align-items-center gap-2"
            :to="auth.isAuthenticated ? '/home' : '/'"
        >
          <i class="bi bi-cpu-fill fs-3 text-primary"></i>
          <span class="fw-bold logo-text">LRT WebApp</span>
        </router-link>
      </div>

      <!-- Mobile Toggle -->
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

      <!-- Nav Links -->
      <div class="collapse navbar-collapse justify-content-end" id="navbarNavDropdown">
        <ul class="navbar-nav align-items-center gap-2 ms-auto">
          <template v-if="auth.isAuthenticated">
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
                  data-bs-display="static"
                  aria-expanded="false"
              >
                <i class="bi bi-person-circle me-1"></i> {{ auth.user.username }}
              </a>
              <ul class="dropdown-menu dropdown-menu-end dropdown-glass" aria-labelledby="userDropdown">
                <li>
                  <router-link class="dropdown-item" to="/profile">
                    <i class="bi bi-person me-1"></i>Profil
                  </router-link>
                </li>
                <li v-if="auth.user.isAdmin">
                  <router-link class="dropdown-item" to="/settings">
                    <i class="bi bi-gear me-1"></i>Einstellungen
                  </router-link>
                </li>
                <li v-if="auth.user.isAdmin">
                  <router-link class="dropdown-item" to="/documentation">
                    <i class="bi bi-journal-text me-1"></i>Dokumentation
                  </router-link>
                </li>
                <li><hr class="dropdown-divider"></li>
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

  <!-- Maintenance‑Banner für Admins -->
  <div
      v-if="auth.user?.isAdmin && settings.maintenanceMode"
      class="maintenance-banner-admin d-flex align-items-center justify-content-center gap-2"
  >
    <i class="bi bi-exclamation-triangle-fill fs-4"></i>
    <span class="fw-semibold">
      Wartungsmodus aktiv – Anwendung nur im Read‑Only.
    </span>
  </div>

  <!-- Guest‑Banner -->
  <div
      v-else-if="!auth.isAuthenticated && settings.maintenanceMode"
      class="maintenance-banner-guest d-flex align-items-center justify-content-center gap-2"
  >
    <i class="bi bi-tools-fill"></i>
    <span class="banner-text">
      Wartungsarbeiten – bitte später erneut anmelden.
    </span>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/shared/stores/auth'
import { useSettingsStore } from '@/shared/stores/settings'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const settings = useSettingsStore()
const router = useRouter()

function handleLogout() {
  auth.logout()
  router.push('/')
}
</script>

<style scoped>
.glass-topbar {
  background: rgba(var(--clr-bg-rgb), 0.9);
  backdrop-filter: blur(var(--space-sm)) saturate(170%);
  border-bottom: 1px solid var(--clr-border);
  box-shadow: var(--shadow-light);
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
  transition: background 0.2s, box-shadow 0.2s;
  z-index: 1090;
}

/* Branding */
.brand-highlight {
  border-left: 0.375rem solid var(--clr-primary-start);
  background: linear-gradient(90deg, rgba(var(--clr-primary-start-rgb),0.1) 5%, transparent 65%);
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
  margin-right: var(--space-md);
}
.logo-text {
  font-size: 1.5rem;
  background: linear-gradient(90deg, var(--clr-primary-start) 40%, var(--clr-primary-end) 90%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 0.5px;
}

/* Nav‐Links */
.navbar-brand { padding: var(--space-xs) var(--space-sm); border-radius: var(--radius-md); }
.navbar-brand:hover { background: var(--clr-card-bg); }
.nav-link {
  color: var(--clr-text) !important;
  font-weight: 500;
  border-radius: var(--radius-sm);
  padding: var(--space-xs) var(--space-md);
  transition: background 0.2s, color 0.2s;
}
.nav-link:hover,
.nav-link.active { background: var(--clr-card-bg); }

/* Dropdown styling */
.dropdown-glass {
  background: rgba(var(--clr-card-bg-rgb), 0.95);
  border: 1px solid var(--clr-border);
  box-shadow: var(--shadow-strong);
  border-radius: var(--radius-md);
}
.dropdown-item { border-radius: var(--radius-sm); transition: background 0.2s; }
.dropdown-item:hover { background: var(--clr-bg); }

/* Ensure nothing is clipped */
.glass-topbar,
.navbar,
.container-fluid,
.navbar-collapse {
  overflow: visible !important;
}

/* Position dropdown directly below navbar */
.nav-item.dropdown { position: static; }
.dropdown-menu {
  position: absolute !important;
  top: 100% !important;
  right: 0 !important;
  margin-top: 0 !important;
  z-index: 3000 !important;
}

/* Banners */
.maintenance-banner-admin {
  background: linear-gradient(90deg, #ffc107, #ff9800);
  color: var(--clr-text);
  padding: var(--space-sm) var(--space-md);
  font-size: var(--fs-sm);
  box-shadow: var(--shadow-light);
  position: sticky;
  top: calc(1rem + var(--space-sm));
  z-index: 1080;
}
.maintenance-banner-guest {
  background: linear-gradient(90deg, #e3f2fd, #bbdefb);
  color: #0d47a1;
  padding: var(--space-sm) var(--space-md);
  font-size: var(--fs-sm);
  position: sticky;
  top: calc(1rem + var(--space-sm));
  z-index: 1080;
  border-bottom: 2px solid #90caf9;
}
.banner-text { line-height: 1.2; }
</style>
