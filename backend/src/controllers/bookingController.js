import { body, param, query as q } from 'express-validator';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiResponse } from '../utils/apiResponse.js';
import { bookEventTickets, cancelBooking, getBooking, getBookingHistory, getBookingsForAdmin, updateBookingDecision } from '../services/bookingService.js';
import { validateRequest } from '../middleware/validate.js';

export const bookEvent = [
  body('eventId').isInt({ min: 1 }),
  body('quantity').isInt({ min: 1, max: 20 }),
  validateRequest,
  asyncHandler(async (req, res) => {
    const booking = await bookEventTickets({
      user: req.user,
      eventId: req.body.eventId,
      quantity: req.body.quantity,
      paymentMethod: req.body.paymentMethod,
    });

    return apiResponse(res, 201, 'Booking created', booking);
  }),
];

export const cancelBookingHandler = [
  param('id').isInt({ min: 1 }),
  validateRequest,
  asyncHandler(async (req, res) => {
    await cancelBooking({ bookingId: req.params.id, user: req.user });
    return apiResponse(res, 200, 'Booking cancelled');
  }),
];

export const bookingHistory = asyncHandler(async (req, res) => {
  const bookings = await getBookingHistory(req.user.id);
  return apiResponse(res, 200, 'Booking history fetched', { bookings });
});

export const adminBookings = [
  q('page').optional().isInt({ min: 1 }),
  q('limit').optional().isInt({ min: 1, max: 50 }),
  asyncHandler(async (req, res) => {
    const bookings = await getBookingsForAdmin(req.query);
    return apiResponse(res, 200, 'Bookings fetched', bookings, { page: Number(req.query.page || 1) });
  }),
];

export const bookingDetails = [
  param('id').isInt({ min: 1 }),
  validateRequest,
  asyncHandler(async (req, res) => {
    const booking = await getBooking(req.params.id);
    return apiResponse(res, 200, 'Booking fetched', { booking });
  }),
];

export const adminDecision = [
  param('id').isInt({ min: 1 }),
  body('bookingStatus').isIn(['confirmed', 'rejected']),
  validateRequest,
  asyncHandler(async (req, res) => {
    const booking = await updateBookingDecision({
      bookingId: req.params.id,
      bookingStatus: req.body.bookingStatus,
      adminId: req.user.id,
    });
    return apiResponse(res, 200, 'Booking status updated', { booking });
  }),
];