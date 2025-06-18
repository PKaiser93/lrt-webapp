import { defineStore } from 'pinia';
import { ref } from 'vue';
import * as api from '@/features/kategorie/api/kategorieApi';

export const useKategorieStore = defineStore('kategorie', () => {
    const items = ref([]);
    const isLoading = ref(false);
    const error = ref(null);

    async function fetchAll(params = {}) {
        isLoading.value = true;
        error.value = null;
        try {
            const res = await api.fetchKategorien(params);
            console.log('Kategorien vom Server:', res.data)
            items.value = res.data;
        } catch (err) {
            error.value = err.message || 'Fehler beim Laden';
        } finally {
            isLoading.value = false;
        }
    }

    return { items, isLoading, error, fetchAll };
});
