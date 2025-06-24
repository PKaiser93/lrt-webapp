import http from '@/shared/api/http';

export function fetchComputers(params = {}) {
    return http.get('/computer', { params });
}

export function getComputerById(id) {
    return http.get(`/computer/${id}`);
}

export function createComputer(data) {
    return http.post('/computer', data);
}

export function updateComputer(id, data) {
    return http.patch(`/computer/${id}`, data);
}

export function deleteComputer(id) {
    return http.patch(`/computer/${id}/soft-delete`);
}

export function restoreComputer(id) {
    return http.patch(`/computer/${id}/restore`);
}
