// features/betriebssystem/api/betriebssystemApi.js
import http from '@/shared/api/http';

export function fetchBetriebssysteme(params) {
  return http.get('/betriebssystem', { params });
}
export function createBetriebssystem(data) {
  return http.post('/betriebssystem', data);
}
export function updateBetriebssystem(id, data) {
  return http.patch(`/betriebssystem/${id}`, data);
}
export function deleteBetriebssystem(id) {
  return http.patch(`/betriebssystem/${id}/soft-delete`);
}
export function restoreBetriebssystem(id) {
  return http.patch(`/betriebssystem/${id}/restore`);
}
export function trashBetriebssysteme(params = {}) {
  // KORREKT:
  return http.get('/betriebssystem/trash/list', { params });
}
