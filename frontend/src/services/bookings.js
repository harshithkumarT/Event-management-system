import http from '../api/http';

export const createBooking = (payload) => http.post('/bookings', payload);
export const fetchBookingHistory = () => http.get('/bookings/me/history');
export const cancelBooking = (id) => http.patch(`/bookings/${id}/cancel`);
export const fetchAllBookings = (params) => http.get('/bookings/admin', { params });
export const updateBookingDecision = (id, payload) => http.patch(`/bookings/${id}/decision`, payload);