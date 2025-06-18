// stores/auth.js
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

            // Token im localStorage speichern (wichtig für persistentes Login)
            localStorage.setItem('token', this.token)

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
            // 1) State zurücksetzen
            this.token = null
            this.user = null

            // 2) HTTP-Header entfernen
            delete http.defaults.headers.common.Authorization

            // 3) Token aus localStorage entfernen
            localStorage.removeItem('token')

            // 4) Persisted State komplett löschen (Standard-Key: 'pinia')
            localStorage.removeItem('pinia')
        },

        init() {
            // Token aus localStorage laden, falls vorhanden
            const storedToken = localStorage.getItem('token')
            if (storedToken) {
                this.token = storedToken
                http.defaults.headers.common.Authorization = `Bearer ${this.token}`
            }
        }
    },

    // Pinia-Persisted-State aktiv
    persist: true
})
