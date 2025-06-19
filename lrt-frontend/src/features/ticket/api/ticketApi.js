import http from '@/api/http';

export function fetchTickets() {
    return http.get('/tickets');
}
export function getTicket(id) {
    return http.get(`/tickets/${id}`);
}
export function createTicket(data) {
    return http.post('/tickets', data);
}
export function updateTicket(id, data) {
    return http.patch(`/tickets/${id}`, data);
}
export function addComment(id, comment) {
    return http.post(`/tickets/${id}/comment`, comment);
}
export function deleteTicket(id) {
    return http.delete(`/tickets/${id}`);
}
export function closeTicket(id) {
    return http.patch(`/tickets/${id}/close`)
}
// Ticket wieder öffnen
export function reopenTicket(id) {
    return http.patch(`/tickets/${id}/reopen`)
}