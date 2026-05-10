import { query } from '../config/db.js';

export const findUserByEmail = async (email) => {
  const result = await query('SELECT * FROM users WHERE email = $1 LIMIT 1', [email]);
  return result.rows[0] || null;
};

export const findUserById = async (id) => {
  const result = await query('SELECT id, name, email, role, profile_image, is_active, created_at FROM users WHERE id = $1 LIMIT 1', [id]);
  return result.rows[0] || null;
};

export const createUser = async ({ name, email, password, role = 'user', profileImage = null }) => {
  const result = await query(
    `INSERT INTO users (name, email, password, role, profile_image)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, email, role, profile_image, is_active, created_at`,
    [name, email, password, role, profileImage],
  );

  return result.rows[0];
};

export const updateUserProfile = async (id, { name, profileImage }) => {
  const result = await query(
    `UPDATE users
     SET name = COALESCE($2, name),
         profile_image = COALESCE($3, profile_image)
     WHERE id = $1
     RETURNING id, name, email, role, profile_image, is_active, created_at`,
    [id, name, profileImage],
  );

  return result.rows[0] || null;
};

export const listUsers = async ({ page = 1, limit = 10, search = '', role = '' }) => {
  const offset = (page - 1) * limit;
  const where = [];
  const params = [];

  if (search) {
    params.push(`%${search}%`);
    where.push(`(name ILIKE $${params.length} OR email ILIKE $${params.length})`);
  }

  if (role) {
    params.push(role);
    where.push(`role = $${params.length}`);
  }

  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const countResult = await query(`SELECT COUNT(*)::int AS count FROM users ${whereClause}`, params);
  params.push(limit, offset);
  const result = await query(
    `SELECT id, name, email, role, profile_image, is_active, created_at
     FROM users
     ${whereClause}
     ORDER BY created_at DESC
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params,
  );

  return { users: result.rows, total: countResult.rows[0].count };
};

export const updateUserRole = async (id, role) => {
  const result = await query(
    `UPDATE users SET role = $2 WHERE id = $1 RETURNING id, name, email, role, profile_image, is_active, created_at`,
    [id, role],
  );

  return result.rows[0] || null;
};

export const toggleUserStatus = async (id, isActive) => {
  const result = await query(
    `UPDATE users SET is_active = $2 WHERE id = $1 RETURNING id, name, email, role, profile_image, is_active, created_at`,
    [id, isActive],
  );

  return result.rows[0] || null;
};