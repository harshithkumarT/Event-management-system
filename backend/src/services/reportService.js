import PDFDocument from 'pdfkit';
import { query } from '../config/db.js';
import { getEventStats } from '../models/eventModel.js';
import { getRevenueSummary } from '../models/paymentModel.js';

export const getAdminAnalytics = async () => {
  const eventStats = await getEventStats();
  const revenueStats = await getRevenueSummary();
  const bookingStats = await query(
    `SELECT
      COUNT(*)::int AS total_bookings,
      COUNT(*) FILTER (WHERE booking_status = 'confirmed')::int AS confirmed_bookings,
      COUNT(*) FILTER (WHERE booking_status = 'pending')::int AS pending_bookings,
      COUNT(*) FILTER (WHERE booking_status = 'cancelled')::int AS cancelled_bookings
     FROM bookings`,
  );
  const categoryStats = await query(
    `SELECT category, COUNT(*)::int AS count
     FROM events
     GROUP BY category
     ORDER BY count DESC`,
  );
  const monthlyRevenue = await query(
    `SELECT TO_CHAR(created_at, 'YYYY-MM') AS month, COALESCE(SUM(amount), 0)::numeric(12,2) AS revenue
     FROM payments
      GROUP BY 1
     ORDER BY month DESC
     LIMIT 12`,
  );

  return {
    eventStats,
    revenueStats,
    bookingStats: bookingStats.rows[0],
    categoryStats: categoryStats.rows,
    monthlyRevenue: monthlyRevenue.rows,
  };
};

export const generateRevenueReportPdf = async () => {
  const analytics = await getAdminAnalytics();
  const doc = new PDFDocument({ margin: 40 });

  doc.fontSize(20).text('Event Management System - Revenue Report', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Total Revenue: $${analytics.revenueStats.total_revenue}`);
  doc.text(`Total Payments: ${analytics.revenueStats.total_payments}`);
  doc.text(`Successful Payments: ${analytics.revenueStats.successful_payments}`);
  doc.moveDown();
  doc.fontSize(14).text('Monthly Revenue');
  analytics.monthlyRevenue.forEach((item) => doc.text(`${item.month}: $${item.revenue}`));
  doc.moveDown();
  doc.fontSize(14).text('Category Distribution');
  analytics.categoryStats.forEach((item) => doc.text(`${item.category}: ${item.count}`));
  doc.end();

  return doc;
};