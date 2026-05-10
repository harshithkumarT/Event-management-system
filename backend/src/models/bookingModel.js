import { query } from '../config/db.js';

export const createBooking = async (client, bookingData) => {
  const { userId, eventId, quantity, totalPrice, bookingStatus = 'confirmed', paymentStatus = 'pending' } = bookingData;
  const result = await client.query(
    `INSERT INTO bookings (user_id, event_id, quantity, total_price, booking_status, payment_status)
     VALUES ($1,$2,$3,$4,$5,$6)
     RETURNING *`,
    [userId, eventId, quantity, totalPrice, bookingStatus, paymentStatus],
  );

  return result.rows[0];
};

export const findBookingById = async (id) => {
  const result = await query(
    `SELECT b.*, e.title AS event_title, e.banner_image, e.date, e.time, e.venue
     FROM bookings b
     JOIN events e ON b.event_id = e.id
     WHERE b.id = $1
     LIMIT 1`,
    [id],
  );

  return result.rows[0] || null;
};

export const listBookingsByUser = async (userId) => {
  const result = await query(
    `SELECT b.*, e.title AS event_title, e.banner_image, e.date, e.time, e.venue
     FROM bookings b
     JOIN events e ON b.event_id = e.id
     WHERE b.user_id = $1
     ORDER BY b.created_at DESC`,
    [userId],
  );

  return result.rows;
};

export const listBookings = async ({ page = 1, limit = 10, status = '' }) => {
  const offset = (page - 1) * limit;
  const filters = [];
  const params = [];

  if (status) {
    params.push(status);
    filters.push(`b.booking_status = $${params.length}`);
  }

  const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  const countResult = await query(
    `SELECT COUNT(*)::int AS count
     FROM bookings b
     ${whereClause}`,
    params,
  );

  params.push(limit, offset);
  const result = await query(
    `SELECT b.*, u.name AS user_name, u.email AS user_email, e.title AS event_title, e.venue, e.date, e.time
     FROM bookings b
     JOIN users u ON b.user_id = u.id
     JOIN events e ON b.event_id = e.id
     ${whereClause}
     ORDER BY b.created_at DESC
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params,
  );

  return { bookings: result.rows, total: countResult.rows[0].count };
};

export const updateBookingStatus = async (client, bookingId, updates) => {
  const fields = [];
  const params = [bookingId];

  for (const [key, value] of Object.entries(updates)) {
    params.push(value);
    fields.push(`${key} = $${params.length}`);
  }

  const result = await client.query(
    `UPDATE bookings SET ${fields.join(', ')} WHERE id = $1 RETURNING *`,
    params,
  );

  return result.rows[0] || null;
};