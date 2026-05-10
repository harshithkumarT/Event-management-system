import http from '../api/http';

export const fetchNotifications = () => http.get('/notifications');
export const markNotificationRead = (id) => http.patch(`/notifications/${id}/read`);
export const markAllNotificationsRead = () => http.patch('/notifications/read-all');