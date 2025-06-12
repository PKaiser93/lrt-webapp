import { defineStore } from 'pinia'
import http from '../api/http'

export const useAuthStore = defineStore('auth', {
    state: () => ({ token: null, user: null }),
    actions: {
        async login(credentials) {
            const response = await http.post('/auth/login', credentials)
            this.token = response.data.token
            this.init()
            await this.fetchUser()
        },
        async fetchUser() {
            const res = await http.get('/auth/me')
            this.user = res.data
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

