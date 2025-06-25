import { defineStore } from 'pinia';
import http from '../api/http';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.user && !!state.token,
    isAdmin: (state) => state.user?.isAdmin,
  },
  actions: {
    async login(username, password) {
      const res = await http.post('/auth/login', { name: username, password });
      this.user = res.data.user;
      this.token = res.data.token;
      localStorage.setItem('token', this.token);
      http.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
    },
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
      delete http.defaults.headers.common['Authorization'];
    },
    async fetchUser() {
      if (!this.token) return;
      try {
        http.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
        const res = await http.get('/auth/profile'); // optional: Auth-Profilroute
        this.user = res.data;
      } catch {
        this.logout();
      }
    },
  },
});
