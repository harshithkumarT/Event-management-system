import { query } from '../config/db.js';

export const createEvent = async (eventData) => {
  const {
    title,
    description,
    category,
    venue,
    date,
    time,
    price,
    totalSeats,
    availableSeats,
    bannerImage,
    organizerId,
  } = eventData;

  const resolvedAvailableSeats = availableSeats ?? totalSeats;

  const result = await query(
    `INSERT INTO events
     (title, description, category, venue, date, time, price, total_seats, available_seats, banner_image, organizer_id)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
     RETURNING *`,
    [title, description, category, venue, date, time, price, totalSeats, resolvedAvailableSeats, bannerImage, organizerId],
  );

  return result.rows[0];
};

export const findEventById = async (id) => {
  const result = await query(
    `SELECT e.*, u.name AS organizer_name
     FROM events e
     LEFT JOIN users u ON e.organizer_id = u.id
     WHERE e.id = $1
     LIMIT 1`,
    [id],
  );

  return result.rows[0] || null;
};

export const listEvents = async ({ page = 1, limit = 10, search = '', category = '', date = '', sort = 'date_asc' }) => {
  const offset = (page - 1) * limit;
  const filters = [];
  const params = [];

  if (search) {
    params.push(`%${search}%`);
    filters.push(`(title ILIKE $${params.length} OR description ILIKE $${params.length} OR venue ILIKE $${params.length})`);
  }

  if (category) {
    params.push(category);
    filters.push(`category = $${params.length}`);
  }

  if (date) {
    params.push(date);
    filters.push(`date = $${params.length}`);
  }

  const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  const orderMap = {
    date_asc: 'date ASC, time ASC',
    date_desc: 'date DESC, time DESC',
    price_asc: 'price ASC',
    price_desc: 'price DESC',
  };
  const orderClause = orderMap[sort] || orderMap.date_asc;

  const countResult = await query(`SELECT COUNT(*)::int AS count FROM events ${whereClause}`, params);
  params.push(limit, offset);
  const result = await query(
    `SELECT e.*, u.name AS organizer_name
     FROM events e
     LEFT JOIN users u ON e.organizer_id = u.id
     ${whereClause}
     ORDER BY ${orderClause}
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params,
  );

  return { events: result.rows, total: countResult.rows[0].count };
};

export const updateEvent = async (id, eventData) => {
  const fields = [];
  const params = [id];
  const entries = Object.entries(eventData);

  for (const [key, value] of entries) {
    if (value !== undefined) {
      const column = key.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);
      params.push(value);
      fields.push(`${column} = $${params.length}`);
    }
  }

  if (!fields.length) {
    return findEventById(id);
  }

  const result = await query(
    `UPDATE events SET ${fields.join(', ')} WHERE id = $1 RETURNING *`,
    params,
  );

  return result.rows[0] || null;
};

export const deleteEvent = async (id) => {
  await query('DELETE FROM events WHERE id = $1', [id]);
};

export const listUpcomingEvents = async () => {
  const result = await query(
    `SELECT e.*, u.name AS organizer_name
     FROM events e
     LEFT JOIN users u ON e.organizer_id = u.id
     WHERE e.date >= CURRENT_DATE
     ORDER BY e.date ASC, e.time ASC
     LIMIT 6`,
  );

  return result.rows;
};

export const getEventStats = async () => {
  const result = await query(
    `SELECT
      COUNT(*)::int AS total_events,
      COALESCE(SUM(total_seats - available_seats), 0)::int AS booked_seats,
      COALESCE(SUM(price * (total_seats - available_seats)), 0)::numeric(12,2) AS revenue
     FROM events`,
  );

  return result.rows[0];
};