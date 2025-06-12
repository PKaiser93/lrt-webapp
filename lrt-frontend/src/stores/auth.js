import { defineStore } from 'pinia'
import http from '../api/http'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: null,
        user: null
    }),

    getters: {
        isAuthenticated: (state) => !!state.token
    },

    actions: {
        async login(credentials) {
            console.log('📥 Login-Daten:', credentials)
            const response = await http.post('/auth/login', credentials)
            this.token = response.data.token

            // Authorization Header setzen
            http.defaults.headers.common.Authorization = `Bearer ${this.token}`
            this.init()

            await this.fetchUser()
        },

        async fetchUser() {
            try {
                const res = await http.get('/auth/me')
                this.user = res.data
                console.log('👤 Benutzer geladen:', this.user)
            } catch (err) {
                console.error('⚠️ Fehler bei fetchUser:', err)
                this.logout()
            }
        },

        logout() {
            this.token = null
            this.user = null
            delete http.defaults.headers.common.Authorization
        },

        init() {
            if (this.token) {
                http.defaults.headers.common.Authorization = `Bearer ${this.token}`
            }
        }
    },

    persist: true
})
