import crypto from 'crypto';
import QRCode from 'qrcode';
import { ApiError } from '../utils/apiError.js';
import { getClient } from '../config/db.js';
import { createBooking, findBookingById, listBookings, listBookingsByUser, updateBookingStatus } from '../models/bookingModel.js';
import { createPayment } from '../models/paymentModel.js';
import { notifyUser } from './notificationService.js';

const releaseSeats = async (client, eventId, quantity) => {
  await client.query('UPDATE events SET available_seats = available_seats + $2 WHERE id = $1', [eventId, quantity]);
};

const deductSeats = async (client, eventId, quantity) => {
  const eventResult = await client.query('SELECT * FROM events WHERE id = $1 FOR UPDATE', [eventId]);
  const event = eventResult.rows[0];

  if (!event) {
    throw new ApiError(404, 'Event not found');
  }

  if (Number(event.available_seats) < Number(quantity)) {
    throw new ApiError(400, 'Not enough available seats');
  }

  await client.query('UPDATE events SET available_seats = available_seats - $2 WHERE id = $1', [eventId, quantity]);
  return event;
};

export const bookEventTickets = async ({ user, eventId, quantity, paymentMethod = 'card' }) => {
  const client = await getClient();

  try {
    await client.query('BEGIN');
    const event = await deductSeats(client, eventId, quantity);
    const totalPrice = Number(event.price) * Number(quantity);
    const booking = await createBooking(client, {
      userId: user.id,
      eventId,
      quantity,
      totalPrice,
      bookingStatus: 'pending',
      paymentStatus: 'pending',
    });

    const transactionId = crypto.randomUUID();
    const payment = await createPayment(client, {
      bookingId: booking.id,
      transactionId,
      amount: totalPrice,
      paymentMethod,
      paymentStatus: 'pending',
    });

    await client.query('COMMIT');

    const qrCodeData = await QRCode.toDataURL(JSON.stringify({ bookingId: booking.id, transactionId }));
    await notifyUser({
      userId: user.id,
      email: user.email,
      message: `Your booking for ${event.title} has been received and is awaiting confirmation.`,
      subject: 'Booking confirmation received',
    });

    return { booking: { ...booking, qrCodeData }, payment, event };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const cancelBooking = async ({ bookingId, user }) => {
  const client = await getClient();

  try {
    await client.query('BEGIN');
    const booking = await findBookingById(bookingId);
    if (!booking) {
      throw new ApiError(404, 'Booking not found');
    }

    const canCancel = user.role === 'admin' || booking.user_id === user.id;
    if (!canCancel) {
      throw new ApiError(403, 'You are not allowed to cancel this booking');
    }

    if (['cancelled', 'rejected'].includes(booking.booking_status)) {
      throw new ApiError(400, 'Booking already processed');
    }

    await updateBookingStatus(client, bookingId, {
      booking_status: 'cancelled',
      payment_status: 'refunded',
    });
    await releaseSeats(client, booking.event_id, booking.quantity);
    await client.query('COMMIT');

    await notifyUser({
      userId: booking.user_id,
      message: `Your booking for ${booking.event_title} has been cancelled.`,
      subject: 'Booking cancelled',
    });

    return true;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const updateBookingDecision = async ({ bookingId, bookingStatus, adminId }) => {
  const client = await getClient();

  try {
    await client.query('BEGIN');
    const booking = await findBookingById(bookingId);
    if (!booking) {
      throw new ApiError(404, 'Booking not found');
    }

    if (['cancelled', 'rejected'].includes(booking.booking_status)) {
      throw new ApiError(400, 'Booking already closed');
    }

    const updated = await updateBookingStatus(client, bookingId, {
      booking_status: bookingStatus,
      payment_status: bookingStatus === 'confirmed' ? 'paid' : booking.payment_status,
    });

    if (bookingStatus === 'rejected') {
      await releaseSeats(client, booking.event_id, booking.quantity);
    }

    await client.query('COMMIT');
    return { ...updated, reviewed_by: adminId };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const getBookingHistory = async (userId) => listBookingsByUser(userId);
export const getBookingsForAdmin = async (filters) => listBookings(filters);
export const getBooking = async (id) => findBookingById(id);