import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
    { path: '/', component: () => import('@/views/Welcome.vue') },
    { path: '/login', component: () => import('@/views/LoginForm.vue') },
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
        component: () => import('@/features/computer/views/ComputerDetail.vue'),
    },
    {
        path: '/computer/:id/edit',
        component: () => import('@/features/computer/views/ComputerEdit.vue'),
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
        component: () => import('@/features/kategorie/views/old/KategorieCreate.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/kategorie/:id',
        component: () => import('@/features/kategorie/views/old/KategorieCreate.vue'),
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
        component: () => import('@/views/AdminDashboard.vue'),
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

// Navigation Guard
router.beforeEach((to, from, next) => {
    const auth = useAuthStore()

    if (to.meta.requiresAuth && !auth.token) {
        next({ path: '/login', query: { redirect: to.fullPath } })
    }
    else if (to.meta.requiresAdmin && !auth.user?.isAdmin) {
        next('/home')
    }
    else {
        next()
    }
})

export default router
