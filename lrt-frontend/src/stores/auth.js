import { defineStore } from 'pinia'
import http from '../api/http'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('user')) || null,
        token: localStorage.getItem('token') || null
    }),

    actions: {
        async login(credentials) {
            const { data } = await http.post('/auth/login', credentials)
            this.token = data.token
            this.user = data.user

            localStorage.setItem('token', data.token)
            localStorage.setItem('user', JSON.stringify(data.user))

            http.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
        },

        logout() {
            this.user = null
            this.token = null
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            delete http.defaults.headers.common['Authorization']
        },

        init() {
            if (this.token) {
                http.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
            }
        }
    }
})
