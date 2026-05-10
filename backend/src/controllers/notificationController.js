import { asyncHandler } from '../utils/asyncHandler.js';
import { apiResponse } from '../utils/apiResponse.js';
import { listNotificationsByUser, markAllNotificationsRead, markNotificationRead } from '../models/notificationModel.js';

export const myNotifications = asyncHandler(async (req, res) => {
  const notifications = await listNotificationsByUser(req.user.id);
  return apiResponse(res, 200, 'Notifications fetched', { notifications });
});

export const readNotification = asyncHandler(async (req, res) => {
  const notification = await markNotificationRead(req.params.id, req.user.id);
  return apiResponse(res, 200, 'Notification marked as read', { notification });
});

export const readAllNotifications = asyncHandler(async (req, res) => {
  await markAllNotificationsRead(req.user.id);
  return apiResponse(res, 200, 'All notifications marked as read');
});