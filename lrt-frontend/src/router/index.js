import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'

import Welcome from '../views/Welcome.vue'
import LoginForm from '../views/LoginForm.vue'
import Home from '../views/Home.vue'
import AdminDashboard from '../views/AdminDashboard.vue'
import ComputerList from '../views/ComputerList.vue'
import ComputerCreate from '../views/ComputerCreate.vue'
import BetriebssystemList from '../views/BetriebssystemList.vue'
import KategorieList from '../views/KategorieList.vue'
import KategorieCreate from '../views/KategorieCreate.vue'
import ComputerImport from '../views/ComputerImport.vue'

const routes = [
    { path: '/', component: Welcome },
    { path: '/login', component: LoginForm },
    {
        path: '/home',
        component: Home,
        meta: { requiresAuth: true }
    },
    {
        path: '/computer',
        component: ComputerList,
        meta: { requiresAuth: true }
    },
    {
        path: '/computer/neu',
        component: ComputerCreate,
        meta: { requiresAuth: true }
    },
    {
        path: '/computer/import',
        component: ComputerImport,
        meta: { requiresAuth: true }
    },
    {
        path: '/betriebssystem',
        component: BetriebssystemList,
        meta: { requiresAuth: true }
    },
    {
        path: '/betriebssystem/neu',
        component: () => import('../views/BetriebssystemForm.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/betriebssystem/:id',
        name: 'BetriebssystemEdit',
        component: () => import('../views/BetriebssystemForm.vue'),
    },
    {
        path: '/betriebssystem/trash',
        name: 'BetriebssystemTrash',
        component: () => import('../views/BetriebssystemTrash.vue')
    },
    {
        path: '/betriebssystem/import',
        component: () => import('../views/BetriebssystemImport.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/kategorie',
        component: KategorieList,
        meta: { requiresAuth: true }
    },
    {
        path: '/kategorie/neu',
        component: KategorieCreate,
        meta: { requiresAuth: true }
    },
    {
        path: '/kategorie/import',
        component: () => import('../views/KategorieImport.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/kategorie/trash',
        component: () => import('../views/KategorieTrash.vue')
    },
    {
        path: '/admin',
        component: AdminDashboard,
        meta: { requiresAuth: true, requiresAdmin: true }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// Navigation Guard
router.beforeEach((to, from, next) => {
    const userStore = useUserStore()
    if (to.meta.requiresAuth && !userStore.isAuthenticated) {
        next('/login')
    } else if (to.meta.requiresAdmin && !userStore.isAdmin) {
        next('/home')
    } else {
        next()
    }
})

export default router
