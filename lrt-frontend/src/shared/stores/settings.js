// src/stores/settings.js
import { defineStore } from 'pinia'
import http            from '@/shared/api/http'

export const useSettingsStore = defineStore('settings', {
    state: () => ({
        maintenanceMode: false,
        featureFlags:    []
    }),
    actions: {
        /** Lädt immer frisch aus der DB */
        async fetch() {
            try {
                const { data } = await http.get('/admin/settings')
                this.maintenanceMode = Boolean(data.maintenanceMode)
                this.featureFlags    = data.featureFlags || []
                console.log('🛠 Settings fetched:', this.maintenanceMode)
            } catch (err) {
                console.error('⚠️ Settings fetch failed', err)
            }
        },

        /** togglet das Flag in der DB und im Store */
        async toggleMaintenance() {
            const { data } = await http.patch('/admin/settings/maintenance', {
                enabled: this.maintenanceMode
            })
            this.maintenanceMode = Boolean(data.maintenanceMode)
            return data
        },

        /** togglet einen einzelnen Feature‑Flag */
        async toggleFlag(name, enabled) {
            const { data } = await http.patch(`/admin/settings/flag/${name}`, {
                enabled
            })
            const idx = this.featureFlags.findIndex(f => f.name === name)
            if (idx !== -1) this.featureFlags[idx].enabled = Boolean(data.enabled)
            return data
        }
    }
})
