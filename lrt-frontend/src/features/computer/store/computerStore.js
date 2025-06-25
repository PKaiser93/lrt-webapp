import { defineStore } from 'pinia';
import * as api from '@/features/computer/api/computerApi';

export const useComputerStore = defineStore('computer', {
  state: () => ({
    selected: null,
    isLoading: false,
    items: [],
    total: 0,
    error: null,
  }),
  actions: {
    async fetchAll(params = {}) {
      this.isLoading = true;
      try {
        const response = await api.fetchComputers(params);
        const data = response.data;

        if (Array.isArray(data)) {
          // Fall A: Backend liefert Array direkt
          this.items = data;
          this.total = data.length;
        } else {
          // Fall B: Backend liefert { items, total }
          this.items = data.items || [];
          this.total = data.total  || data.items?.length || 0;
        }

        this.error = null;
      } catch (err) {
        this.error = err.response?.data?.error || 'Unbekannter Fehler';
      } finally {
        this.isLoading = false;
      }
    },

    async fetchById(id) {
      this.isLoading = true;
      try {
        const { data } = await api.getComputerById(id);
        this.selected = data;
        this.error = null;
      } catch (err) {
        this.selected = null;
        this.error = err.response?.data?.error || 'Unbekannter Fehler';
      } finally {
        this.isLoading = false;
      }
    },
    async create(data) {
      this.isLoading = true;
      try {
        const res = await api.createComputer(data);
        this.computers.push(res.data);
        this.error = null;
        return res.data;
      } catch (err) {
        this.error = err.response?.data?.error || 'Unbekannter Fehler';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },
    async update(id, data) {
      this.isLoading = true;
      try {
        const res = await api.updateComputer(id, data);
        const idx = this.computers.findIndex(pc => pc._id === id);
        if (idx !== -1) this.computers[idx] = res.data;
        this.error = null;
        return res.data;
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
        await api.deleteComputer(id);
        this.computers = this.computers.filter(pc => pc._id !== id);
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
        await api.restoreComputer(id);
        await this.fetchAll(); // Daten neu laden!
        this.error = null;
      } catch (err) {
        this.error = err.response?.data?.error || 'Unbekannter Fehler';
        throw err;
      } finally {
        this.isLoading = false;
      }
    },
    clearSelected() {
      this.selected = null;
    },
  },
});
