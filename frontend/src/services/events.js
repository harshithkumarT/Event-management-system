import http from '../api/http';

export const fetchEvents = (params) => http.get('/events', { params });
export const fetchFeaturedEvents = () => http.get('/events/featured');
export const fetchEventById = (id) => http.get(`/events/${id}`);
export const createEvent = (payload) => http.post('/events', payload);
export const updateEvent = (id, payload) => http.put(`/events/${id}`, payload);
export const deleteEvent = (id) => http.delete(`/events/${id}`);