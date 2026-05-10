import { query } from '../config/db.js';

export const createNotification = async ({ userId, message, isRead = false }) => {
  const result = await query(
    `INSERT INTO notifications (user_id, message, is_read)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [userId, message, isRead],
  );

  return result.rows[0];
};

export const listNotificationsByUser = async (userId) => {
  const result = await query(
    `SELECT * FROM notifications
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId],
  );

  return result.rows;
};

export const markNotificationRead = async (id, userId) => {
  const result = await query(
    `UPDATE notifications
     SET is_read = true
     WHERE id = $1 AND user_id = $2
     RETURNING *`,
    [id, userId],
  );

  return result.rows[0] || null;
};

export const markAllNotificationsRead = async (userId) => {
  await query('UPDATE notifications SET is_read = true WHERE user_id = $1', [userId]);
};