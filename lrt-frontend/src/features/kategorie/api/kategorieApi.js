import http from '@/shared/api/http'

export function fetchKategorien(params) {
    // Holt alle Kategorien (ggf. mit Query-Params)
    return http.get('/kategorie', { params });
}

export function fetchKategorieById(id) {
    return http.get(`/kategorie/${id}`);
}

export function createKategorie(data) {
    return http.post('/kategorie', data);
}

export function updateKategorie(id, data) {
    return http.patch(`/kategorie/${id}`, data);
}

export function softDeleteKategorie(id) {
    return http.patch(`/kategorie/${id}/soft-delete`);
}

export function restoreKategorie(id) {
    return http.patch(`/kategorie/${id}/restore`);
}

export function hardDeleteKategorie(id) {
    return http.delete(`/kategorie/${id}/hard-delete`);
}

// Papierkorb (nur gelöschte)
export function trashKategorien(params = {}) {
    return http.get('/kategorie/trash/list', { params });
}
