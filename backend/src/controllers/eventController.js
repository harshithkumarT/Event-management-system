import { body, param, query as q } from 'express-validator';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiResponse } from '../utils/apiResponse.js';
import { addEvent, editEvent, fetchEventStats, getEvent, getEvents, getFeaturedEvents, removeEvent } from '../services/eventService.js';
import { validateRequest } from '../middleware/validate.js';

export const listEvents = [
  q('page').optional().isInt({ min: 1 }),
  q('limit').optional().isInt({ min: 1, max: 50 }),
  asyncHandler(async (req, res) => {
    const result = await getEvents(req.query);
    return apiResponse(res, 200, 'Events fetched', result, { total: result.total, page: Number(req.query.page || 1) });
  }),
];

export const featuredEvents = asyncHandler(async (req, res) => {
  const events = await getFeaturedEvents();
  return apiResponse(res, 200, 'Featured events fetched', { events });
});

export const singleEvent = [
  param('id').isInt({ min: 1 }),
  validateRequest,
  asyncHandler(async (req, res) => {
    const event = await getEvent(req.params.id);
    return apiResponse(res, 200, 'Event fetched', { event });
  }),
];

export const createEventHandler = [
  body('title').notEmpty(),
  body('description').notEmpty(),
  body('category').notEmpty(),
  body('venue').notEmpty(),
  body('date').isISO8601(),
  body('time').notEmpty(),
  body('price').isNumeric(),
  body('totalSeats').isInt({ min: 1 }),
  validateRequest,
  asyncHandler(async (req, res) => {
    const event = await addEvent({ ...req.body, organizerId: req.user.id, availableSeats: req.body.availableSeats ?? req.body.totalSeats });
    return apiResponse(res, 201, 'Event created', { event });
  }),
];

export const updateEventHandler = [
  param('id').isInt({ min: 1 }),
  validateRequest,
  asyncHandler(async (req, res) => {
    const event = await editEvent(req.params.id, req.body);
    return apiResponse(res, 200, 'Event updated', { event });
  }),
];

export const deleteEventHandler = [
  param('id').isInt({ min: 1 }),
  validateRequest,
  asyncHandler(async (req, res) => {
    await removeEvent(req.params.id);
    return apiResponse(res, 200, 'Event deleted');
  }),
];

export const analyticsEvents = asyncHandler(async (req, res) => {
  const stats = await fetchEventStats();
  return apiResponse(res, 200, 'Event analytics fetched', { stats });
});