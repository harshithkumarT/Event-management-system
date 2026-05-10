import http from '../api/http';

export const fetchAnalytics = () => http.get('/admin/analytics');
export const fetchUsers = (params) => http.get('/admin/users', { params });
export const updateUserRole = (id, payload) => http.patch(`/admin/users/${id}/role`, payload);
export const updateUserStatus = (id, payload) => http.patch(`/admin/users/${id}/status`, payload);
export const downloadRevenueReport = () => http.get('/admin/reports/revenue', { responseType: 'blob' });