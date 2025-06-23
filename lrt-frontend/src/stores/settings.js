// src/stores/settings.js
import { defineStore } from 'pinia'
import http from '@/api/http'

export const useSettingsStore = defineStore('settings', {
    state: () => ({
        maintenanceMode: false,
        _loaded: false
    }),
    actions: {
        async fetch() {
            if (this._loaded) return
            try {
                const { data } = await http.get('/admin/settings')
                this.maintenanceMode = data.maintenanceMode
            } catch (err) {
                // Bei 503 oder anderen Fehlern => Wartungs‑Modus annehmen
                this.maintenanceMode = true
            } finally {
                this._loaded = true
            }
        }
    }
})
