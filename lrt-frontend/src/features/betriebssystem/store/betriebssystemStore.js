// features/betriebssystem/store/betriebssystemStore.js
import { defineStore } from 'pinia';
import * as api from '@/features/betriebssystem/api/betriebssystemApi';

export const useBetriebssystemStore = defineStore('betriebssystem', {
    state: () => ({
        items: [],
        trash: [],
        isLoading: false,
        error: null
    }),
    actions: {
        async fetchAll(params = {}) {
            this.isLoading = true;
            try {
                const { data } = await api.fetchBetriebssysteme(params);
                // Defensive: Immer ein Array, und keine falschen Werte!
                this.items = Array.isArray(data) ? data.filter(x => typeof x === 'object' && x && x._id) : [];
                this.error = null;
            } catch (err) {
                this.items = []; // <- Immer ein Array
                this.error = err.response?.data?.error || 'Unbekannter Fehler';
            } finally {
                this.isLoading = false;
            }
        },
        async fetchTrash(params = {}) {
            this.isLoading = true;
            try {
                const { data } = await api.trashBetriebssysteme(params);
                // Defensive: Immer ein Array mit gültigen Objekten
                this.trash = Array.isArray(data) ? data.filter(x => typeof x === 'object' && x && x._id) : [];
                this.error = null;
            } catch (err) {
                this.trash = []; // Fallback: leeres Array
                this.error = err.response?.data?.error || 'Unbekannter Fehler';
            } finally {
                this.isLoading = false;
            }
        },
        async create(payload) {
            this.isLoading = true;
            try {
                const { data } = await api.createBetriebssystem(payload);
                this.items.push(data);
                this.error = null;
                return data;
            } catch (err) {
                this.error = err.response?.data?.error || 'Unbekannter Fehler';
                throw err;
            } finally {
                this.isLoading = false;
            }
        },
        async update(id, payload) {
            this.isLoading = true;
            try {
                const { data } = await api.updateBetriebssystem(id, payload);
                const idx = this.items.findIndex(x => x._id === id);
                if (idx >= 0) this.items[idx] = data;
                this.error = null;
                return data;
            } catch (err) {
                this.error = err.response?.data?.error || 'Unbekannter Fehler';
                throw err;
            } finally {
                this.isLoading = false;
            }
        },
        async delete(id) {
            this.isLoading = true;
            try {
                await api.deleteBetriebssystem(id);
                this.items = this.items.filter(x => x._id !== id);
                this.error = null;
            } catch (err) {
                this.error = err.response?.data?.error || 'Unbekannter Fehler';
                throw err;
            } finally {
                this.isLoading = false;
            }
        },
        async restore(id) {
            this.isLoading = true;
            try {
                const { data } = await api.restoreBetriebssystem(id);
                this.trash = this.trash.filter(x => x._id !== id);
                this.items.push(data);
                this.error = null;
            } catch (err) {
                this.error = err.response?.data?.error || 'Unbekannter Fehler';
                throw err;
            } finally {
                this.isLoading = false;
            }
        }
    }
});
