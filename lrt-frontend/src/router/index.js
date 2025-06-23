import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useSettingsStore } from '@/stores/settings'

const routes = [
    { path: '/', component: () => import('@/views/Welcome.vue') },
    { path: '/maintenance', component: () => import('@/views/Maintenance.vue') },
    { path: '/login', component: () => import('@/views/LoginForm.vue') },
    { path: '/documentation', component: () => import('@/features/docs/DocumentationHub.vue') },
    { path: '/api-docs',     component: () => import('@/views/SwaggerView.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
    {
        path: '/profile',
        component: () => import('@/features/profile/views/ProfileView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/profile/password',
        component: () => import('@/features/profile/components/ChangePasswordModal.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/home',
        component: () => import('@/views/Home.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/computer',
        component: () => import('@/features/computer/views/ComputerList.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/computer/:id',
        name: 'ComputerDetail',
        component: () => import('@/features/computer/views/ComputerDetail.vue')
    },
    {
        path: '/computer/:id/edit',
        component: () => import('@/features/computer/views/ComputerEdit.vue')
    },
    {
        path: '/computer/neu',
        component: () => import('@/features/computer/views/ComputerCreate.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/betriebssystem',
        component: () => import('@/features/betriebssystem/views/BetriebssystemList.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/betriebssystem/neu',
        component: () => import('@/features/betriebssystem/components/BetriebssystemForm.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/betriebssystem/:id',
        name: 'BetriebssystemEdit',
        component: () => import('@/features/betriebssystem/components/BetriebssystemForm.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/betriebssystem/trash',
        name: 'BetriebssystemTrash',
        component: () => import('@/features/betriebssystem/views/BetriebssystemTrash.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/kategorie',
        component: () => import('@/features/kategorie/views/KategorieList.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/kategorie/neu',
        component: () => import('@/features/kategorie/components/KategorieForm.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/kategorie/:id',
        component: () => import('@/features/kategorie/components/KategorieForm.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/kategorie/trash',
        component: () => import('@/features/kategorie/views/KategorieTrash.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/student',
        component: () => import('@/features/student/views/StudentList.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/tickets',
        component: () => import('@/features/ticket/views/TicketList.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/tickets/:id',
        component: () => import('@/features/ticket/views/TicketDetail.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/student/neu',
        component: () => import('@/features/student/views/StudentCreate.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/trash',
        component: () => import('@/features/papierkorb/views/TrashPage.vue')
    },
    {
        path: '/admin',
        component: () => import('@/features/admin/views/AdminDashboard.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
        path: '/settings',
        component: () => import('@/features/admin/views/AdminSettings.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
        path: '/admin/privacy',
        component: () => import('@/features/privacy/views/PrivacyRequests.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach(async (to, from, next) => {
    const auth     = useAuthStore()
    const isAdmin  = Boolean(auth.user?.isAdmin)
    const settings = useSettingsStore()

    // 1) Einmalig die Einstellungen laden
    await settings.fetch()

    // 2) Maintenance‑Mode: Normale Nutzer umleiten
    if (settings.maintenanceMode && !isAdmin && to.path !== '/maintenance') {
        return next({ path: '/maintenance' })
    }

    // 3) Authentifizierung prüfen
    if (to.meta.requiresAuth && !auth.token) {
        return next({ path: '/login', query: { redirect: to.fullPath } })
    }

    // 4) Admin‑Recht prüfen
    if (to.meta.requiresAdmin && !isAdmin) {
        return next('/home')
    }

    next()
})

export default router
