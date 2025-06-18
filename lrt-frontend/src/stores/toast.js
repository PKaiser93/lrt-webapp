// src/stores/toast.js
import { defineStore } from 'pinia'

export const useToastStore = defineStore('toast', {
    state: () => ({
        toasts: []
    }),
    actions: {
        show(message, type = 'info', timeout = 4000) {
            this.toasts.push({ message, type })
            setTimeout(() => this.toasts.shift(), timeout)
        },
        remove(index) {
            this.toasts.splice(index, 1)
        }
    }
})
