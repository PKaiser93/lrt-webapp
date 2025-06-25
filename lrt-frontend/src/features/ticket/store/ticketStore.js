import { defineStore } from 'pinia';
import * as api from '@/features/ticket/api/ticketApi';

export const useTicketStore = defineStore('ticket', {
  state: () => ({
    list: [],
    current: null,
    loading: false,
    error: null,
  }),
  actions: {
    async loadAll() {
      this.loading = true; this.error = null;
      try {
        const res = await api.fetchTickets();
        this.list = res.data;
      } catch (e) {
        this.error = e.message;
      } finally {
        this.loading = false;
      }
    },

    async load(id) {
      this.loading = true; this.error = null;
      try {
        const res = await api.getTicket(id);
        this.current = res.data;
      } catch (e) {
        this.error = e.message;
      } finally {
        this.loading = false;
      }
    },

    async create(data) {
      await api.createTicket(data);
      await this.loadAll();
    },

    async update(id, data) {
      await api.updateTicket(id, data);
      await this.loadAll();
    },

    async comment(id, author, message) {
      await api.addComment(id, { author, message });
      await this.load(id);
    },

    async remove(id) {
      await api.deleteTicket(id);
      await this.loadAll();
    },

    // ─── neu: Ticket schließen ───
    async close(id) {
      await api.closeTicket(id);
      await this.load(id);
    },

    // ─── neu: Ticket wieder öffnen ───
    async reopen(id) {
      await api.reopenTicket(id);
      await this.load(id);
    },

    async changeStatus(id, status) {
      await api.changeStatus(id, { status });
      await this.load(id);
    },

    async assign(id, userId) {
      await api.assignTicket(id, { assignee: userId });
      await this.load(id);
    },
  },
});
