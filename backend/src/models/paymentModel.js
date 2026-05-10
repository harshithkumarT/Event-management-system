import { query } from '../config/db.js';

export const createPayment = async (client, { bookingId, transactionId, amount, paymentMethod, paymentStatus = 'pending' }) => {
  const db = client || { query };
  const result = await db.query(
    `INSERT INTO payments (booking_id, transaction_id, amount, payment_method, payment_status)
     VALUES ($1,$2,$3,$4,$5)
     RETURNING *`,
    [bookingId, transactionId, amount, paymentMethod, paymentStatus],
  );

  return result.rows[0];
};

export const updatePaymentStatus = async (id, paymentStatus) => {
  const result = await query(
    `UPDATE payments SET payment_status = $2 WHERE id = $1 RETURNING *`,
    [id, paymentStatus],
  );

  return result.rows[0] || null;
};

export const getRevenueSummary = async () => {
  const result = await query(
    `SELECT
      COALESCE(SUM(amount), 0)::numeric(12,2) AS total_revenue,
      COUNT(*)::int AS total_payments,
      COUNT(*) FILTER (WHERE payment_status = 'paid')::int AS successful_payments
     FROM payments`,
  );

  return result.rows[0];
};